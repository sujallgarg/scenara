"use client";

import React, { useEffect, useRef, useState } from "react";

interface AgentNode {
  id: string;
  name: string;
  role: string;
  archetype: "Pragmatist" | "Skeptic" | "Innovator" | "Influencer" | "Regulator";
  color: string;
  stance: string;
  sentiment: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  pulsePhase: number;
}

interface NetworkLink {
  source: number;
  target: number;
  strength: number;
}

interface PulsePacket {
  linkIndex: number;
  progress: number;
  speed: number;
  color: string;
}

const SAMPLE_AGENTS: Omit<AgentNode, "x" | "y" | "vx" | "vy" | "pulsePhase">[] = [
  { id: "1", name: "Dr. Elena Vance", role: "Chief Risk Officer", archetype: "Pragmatist", color: "#10b981", stance: "Demands third-party safety audits before scale", sentiment: 0.25, radius: 8 },
  { id: "2", name: "Marcus Thorne", role: "Venture Partner", archetype: "Innovator", color: "#3b82f6", stance: "Bullish on rapid deployment advantage", sentiment: 0.82, radius: 9 },
  { id: "3", name: "Sarah Lin", role: "Policy Advisor", archetype: "Regulator", color: "#6366f1", stance: "Scrutinizing algorithmic accountability provisions", sentiment: -0.15, radius: 7 },
  { id: "4", name: "Devon Miller", role: "Tech Columnist", archetype: "Influencer", color: "#f59e0b", stance: "Amplifying consumer privacy concerns", sentiment: -0.38, radius: 8 },
  { id: "5", name: "Clara O'Connor", role: "Labor Union Rep", archetype: "Skeptic", color: "#ef4444", stance: "Strongly opposing displacement clauses", sentiment: -0.65, radius: 7 },
  { id: "6", name: "Kenji Sato", role: "Staff Architect", archetype: "Pragmatist", color: "#10b981", stance: "Focusing on integration friction and legacy downtime", sentiment: 0.10, radius: 7 },
  { id: "7", name: "Amina Al-Mansoor", role: "Enterprise Buyer", archetype: "Innovator", color: "#3b82f6", stance: "Testing beta units in closed pilot sandbox", sentiment: 0.60, radius: 8 },
  { id: "8", name: "Liam Bradley", role: "Early Adopter", archetype: "Influencer", color: "#f59e0b", stance: "Sharing organic benchmark comparisons", sentiment: 0.55, radius: 7 },
  { id: "9", name: "Zoe Chen", role: "Data Protection Officer", archetype: "Regulator", color: "#6366f1", stance: "Requiring localized model residency guarantees", sentiment: -0.05, radius: 7 },
  { id: "10", name: "Javier Morales", role: "Ops Lead", archetype: "Pragmatist", color: "#10b981", stance: "Measuring training overhead and ROI thresholds", sentiment: 0.35, radius: 7 },
  { id: "11", name: "Priya Nair", role: "AI Ethics Researcher", archetype: "Skeptic", color: "#ef4444", stance: "Questioning training dataset provenance", sentiment: -0.45, radius: 7 },
  { id: "12", name: "Tomasz Nowak", role: "Growth Strategist", archetype: "Innovator", color: "#3b82f6", stance: "Modeling viral distribution loops", sentiment: 0.70, radius: 7 },
  { id: "13", name: "Chloe Dupont", role: "Consumer Advocate", archetype: "Skeptic", color: "#ef4444", stance: "Demanding transparent pricing caps", sentiment: -0.30, radius: 6 },
  { id: "14", name: "David Kim", role: "Supply Chain Director", archetype: "Pragmatist", color: "#10b981", stance: "Stress testing lead time guarantees", sentiment: 0.20, radius: 7 },
  { id: "15", name: "Maya Patel", role: "Product VP", archetype: "Innovator", color: "#3b82f6", stance: "Advocating for self-serve developer tier", sentiment: 0.75, radius: 8 },
  { id: "16", name: "Gabriel Silva", role: "Community Organizer", archetype: "Influencer", color: "#f59e0b", stance: "Organizing public feedback roundtable", sentiment: 0.05, radius: 7 },
  { id: "17", name: "Hannah Berg", role: "Compliance Counsel", archetype: "Regulator", color: "#6366f1", stance: "Drafting cross-jurisdiction warranty terms", sentiment: 0.00, radius: 7 },
  { id: "18", name: "Julian Rossi", role: "Security Auditor", archetype: "Pragmatist", color: "#10b981", stance: "Validating API isolation barriers", sentiment: 0.40, radius: 7 },
];

export default function AgentNetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hoveredAgent, setHoveredAgent] = useState<AgentNode | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = container.clientWidth);
    let height = (canvas.height = container.clientHeight);

    const handleResize = () => {
      if (!container || !canvas) return;
      width = canvas.width = container.clientWidth;
      height = canvas.height = container.clientHeight;
    };

    window.addEventListener("resize", handleResize);

    // Initialize agent nodes positioned in an organic cluster
    const nodes: AgentNode[] = SAMPLE_AGENTS.map((agent, i) => {
      const angle = (i / SAMPLE_AGENTS.length) * Math.PI * 2;
      const distance = Math.min(width, height) * 0.28 * (0.6 + Math.random() * 0.7);
      return {
        ...agent,
        x: width / 2 + Math.cos(angle) * distance,
        y: height / 2 + Math.sin(angle) * distance,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        pulsePhase: Math.random() * Math.PI * 2,
      };
    });

    // Generate links between close agents
    const links: NetworkLink[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180 || (Math.random() < 0.12 && dist < 240)) {
          links.push({
            source: i,
            target: j,
            strength: Math.max(0.2, 1 - dist / 220),
          });
        }
      }
    }

    // Packet transmissions along links
    const packets: PulsePacket[] = [];
    const maxPackets = 14;

    const mouse = { x: -1000, y: -1000, isHovering: false };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.isHovering = true;

      // Find closest node
      let found: AgentNode | null = null;
      for (const node of nodes) {
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        if (Math.sqrt(dx * dx + dy * dy) < node.radius + 10) {
          found = node;
          break;
        }
      }

      setHoveredAgent(found);
      if (found) {
        setTooltipPos({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseLeave = () => {
      mouse.isHovering = false;
      mouse.x = -1000;
      mouse.y = -1000;
      setHoveredAgent(null);
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    // Animation loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Spawn packets periodically
      if (packets.length < maxPackets && Math.random() < 0.08 && links.length > 0) {
        const linkIdx = Math.floor(Math.random() * links.length);
        const sourceNode = nodes[links[linkIdx].source];
        packets.push({
          linkIndex: linkIdx,
          progress: 0,
          speed: 0.008 + Math.random() * 0.012,
          color: sourceNode.color,
        });
      }

      // Update and draw links
      for (let i = 0; i < links.length; i++) {
        const link = links[i];
        const s = nodes[link.source];
        const t = nodes[link.target];

        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(t.x, t.y);

        const isHighlighted =
          hoveredAgent && (s.id === hoveredAgent.id || t.id === hoveredAgent.id);

        if (isHighlighted) {
          ctx.strokeStyle = "rgba(16, 185, 129, 0.45)";
          ctx.lineWidth = 1.8;
        } else {
          ctx.strokeStyle = `rgba(161, 161, 170, ${0.12 * link.strength})`;
          ctx.lineWidth = 1.0;
        }
        ctx.stroke();
      }

      // Update and draw packets (agent deliberations traveling)
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        p.progress += p.speed;

        if (p.progress >= 1) {
          packets.splice(i, 1);
          continue;
        }

        const link = links[p.linkIndex];
        if (!link) {
          packets.splice(i, 1);
          continue;
        }

        const s = nodes[link.source];
        const t = nodes[link.target];
        const px = s.x + (t.x - s.x) * p.progress;
        const py = s.y + (t.y - s.y) * p.progress;

        ctx.beginPath();
        ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Update and draw agent nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        // Soft physics drift
        node.x += node.vx;
        node.y += node.vy;
        node.pulsePhase += 0.03;

        // Containment bounds
        const pad = 30;
        if (node.x < pad || node.x > width - pad) node.vx *= -1;
        if (node.y < pad || node.y > height - pad) node.vy *= -1;

        // Mouse gentle repulsion
        if (mouse.isHovering) {
          const dx = node.x - mouse.x;
          const dy = node.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100 && dist > 0) {
            const force = (100 - dist) / 100 * 0.4;
            node.x += (dx / dist) * force;
            node.y += (dy / dist) * force;
          }
        }

        const isHovered = hoveredAgent?.id === node.id;
        const pulse = Math.sin(node.pulsePhase) * 1.5;
        const r = node.radius + (isHovered ? 3 : 0);

        // Outer glow aura
        ctx.beginPath();
        ctx.arc(node.x, node.y, r + 4 + pulse, 0, Math.PI * 2);
        ctx.fillStyle = isHovered
          ? "rgba(16, 185, 129, 0.2)"
          : `${node.color}18`;
        ctx.fill();

        // Node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.strokeStyle = node.color;
        ctx.lineWidth = isHovered ? 2.5 : 1.8;
        ctx.stroke();

        // Inner core
        ctx.beginPath();
        ctx.arc(node.x, node.y, r * 0.45, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();

        // Node label
        ctx.font = isHovered
          ? "600 11px -apple-system, sans-serif"
          : "500 10px -apple-system, sans-serif";
        ctx.fillStyle = isHovered ? "#09090b" : "#71717a";
        ctx.textAlign = "center";
        ctx.fillText(node.name.split(" ")[0], node.x, node.y + r + 13);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-[460px] md:h-[540px] overflow-hidden rounded-2xl bg-gradient-to-b from-zinc-50/60 to-white border border-zinc-200/80 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)]">
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 border border-zinc-200/80 backdrop-blur-md shadow-sm">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-xs font-medium text-zinc-600">
          Live Agent Network Graph • Interactive
        </span>
      </div>

      <div className="absolute bottom-4 left-4 z-10 hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-white/80 border border-zinc-200/70 text-[11px] text-zinc-500 backdrop-blur-sm">
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Pragmatist</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Innovator</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Influencer</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-500"></span> Regulator</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500"></span> Skeptic</span>
      </div>

      <div className="absolute bottom-4 right-4 z-10 text-[11px] text-zinc-400 pointer-events-none">
        Hover nodes to inspect belief vectors
      </div>

      <canvas ref={canvasRef} className="block w-full h-full cursor-crosshair" />

      {/* Floating Hover Tooltip */}
      {hoveredAgent && (
        <div
          className="pointer-events-none fixed z-50 transform -translate-x-1/2 -translate-y-full mb-3 px-3.5 py-2.5 rounded-xl bg-zinc-900/95 text-white shadow-xl backdrop-blur-md border border-zinc-700/50 max-w-xs transition-opacity duration-150"
          style={{
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y - 12}px`,
          }}
        >
          <div className="flex items-center justify-between gap-3 mb-1">
            <span className="font-semibold text-xs text-white">{hoveredAgent.name}</span>
            <span
              className="text-[10px] px-1.5 py-0.5 rounded font-medium"
              style={{
                backgroundColor: `${hoveredAgent.color}25`,
                color: hoveredAgent.color,
              }}
            >
              {hoveredAgent.archetype}
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 mb-1.5">{hoveredAgent.role}</p>
          <div className="text-[11px] text-zinc-300 border-t border-zinc-800 pt-1.5 leading-snug">
            &ldquo;{hoveredAgent.stance}&rdquo;
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[10px] text-zinc-400 font-mono">
            <span>Sentiment:</span>
            <span
              className={
                hoveredAgent.sentiment > 0
                  ? "text-emerald-400"
                  : hoveredAgent.sentiment < 0
                  ? "text-rose-400"
                  : "text-zinc-400"
              }
            >
              {hoveredAgent.sentiment > 0 ? `+${hoveredAgent.sentiment.toFixed(2)}` : hoveredAgent.sentiment.toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

