import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthFromRequest } from '@/lib/auth';

const POLL_INTERVAL_MS = 2000; // Poll DB every 2s
const HEARTBEAT_INTERVAL_MS = 15000; // Send heartbeat every 15s
const MAX_DURATION_MS = 10 * 60 * 1000; // 10 min max stream duration

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = getAuthFromRequest(req);
  if (!auth) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { id: simulationId } = await params;

  // Verify ownership
  const sim = await prisma.simulation.findUnique({ where: { id: simulationId } });
  if (!sim || sim.userId !== auth.userId) {
    return new Response('Not found', { status: 404 });
  }

  // SSE response
  const encoder = new TextEncoder();
  let closed = false;
  let heartbeatTimer: ReturnType<typeof setTimeout> | null = null;
  let pollTimer: ReturnType<typeof setTimeout> | null = null;

  const cleanup = () => {
    closed = true;
    if (heartbeatTimer) {
      clearTimeout(heartbeatTimer);
      heartbeatTimer = null;
    }
    if (pollTimer) {
      clearTimeout(pollTimer);
      pollTimer = null;
    }
  };

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        if (closed) return;
        try {
          const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
          controller.enqueue(encoder.encode(payload));
        } catch {
          cleanup();
        }
      };

      const startTime = Date.now();
      let lastRound = -1;
      let lastStatus = sim.status;
      let lastJobStatus: string | null = null;

      const sendHeartbeat = () => {
        if (closed) return;
        send('heartbeat', { ts: Date.now() });
        if (!closed) {
          heartbeatTimer = setTimeout(sendHeartbeat, HEARTBEAT_INTERVAL_MS);
        }
      };

      heartbeatTimer = setTimeout(sendHeartbeat, HEARTBEAT_INTERVAL_MS);

      // Send initial state
      const initial = await prisma.simulation.findUnique({
        where: { id: simulationId },
        include: { workerJob: true },
      });
      lastStatus = initial?.status ?? sim.status;
      lastJobStatus = initial?.workerJob?.status ?? null;
      send('connected', { simulationId, status: initial?.status, currentRound: initial?.currentRound });

      const poll = async () => {
        if (closed) return;
        if (Date.now() - startTime > MAX_DURATION_MS) {
          send('timeout', { message: 'Stream timeout, reconnect to continue' });
          cleanup();
          try { controller.close(); } catch {}
          return;
        }

        try {
          const current = await prisma.simulation.findUnique({
            where: { id: simulationId },
            include: {
              workerJob: true,
              rounds: {
                where: { status: 'COMPLETED' },
                orderBy: { roundNumber: 'desc' },
                take: 1,
              },
            },
          });

          if (!current || closed) {
            if (!current) send('error', { message: 'Simulation not found' });
            cleanup();
            try { controller.close(); } catch {}
            return;
          }

          // Send status update if something changed
          const latestRound = current.rounds[0]?.roundNumber ?? -1;
          const currentJobStatus = current.workerJob?.status ?? null;
          if (latestRound !== lastRound || current.status !== lastStatus || currentJobStatus !== lastJobStatus) {
            lastRound = latestRound;
            lastStatus = current.status;
            lastJobStatus = currentJobStatus;
            send('update', {
              status: current.status,
              currentRound: current.currentRound,
              totalRounds: current.totalRounds,
              jobStatus: currentJobStatus,
              lastError: current.workerJob?.lastError ?? null,
            });
          }

          // Terminal states - close stream
          if (['COMPLETED', 'FAILED'].includes(current.status)) {
            send('done', { status: current.status, simulationId });
            cleanup();
            try { controller.close(); } catch {}
            return;
          }
        } catch (err) {
          if (!closed) {
            console.error('[SSE poll error]', err);
            send('error', { message: 'Poll error, retrying' });
          }
        }

        if (!closed) {
          pollTimer = setTimeout(poll, POLL_INTERVAL_MS);
        }
      };

      // Start initial poll after 100ms
      if (!closed) {
        pollTimer = setTimeout(poll, 100);
      }

      // Handle client disconnect via abort signal
      req.signal.addEventListener('abort', () => {
        cleanup();
        try { controller.close(); } catch {}
      });
    },
    cancel() {
      cleanup();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
      // SSE reconnection: tells client to retry after 3 seconds on disconnect
      'retry': '3000',
    },
  });
}
