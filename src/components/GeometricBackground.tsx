import React, { useEffect, useRef } from 'react';

export default function GeometricBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Detect if dark mode is active
    let isDarkMode = document.documentElement.classList.contains('dark');

    // Create a MutationObserver to listen for theme changes
    const observer = new MutationObserver(() => {
      isDarkMode = document.documentElement.classList.contains('dark');
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    // Define geometric shapes
    interface GeometricNode {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      type: 'circle' | 'rupee-coin' | 'bank' | 'star' | 'trading-chart' | 'wallet';
      angle: number;
      spinSpeed: number;
      baseColor: string;
      pulseState?: number;
      pulseSpeed?: number;
    }

    let nodes: GeometricNode[] = [];
    const MAX_NODES = 40; // Slightly fewer nodes for cleaner, softer space

    const resizeCanvas = () => {
      if (!canvas || !containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      width = rect.width;
      height = rect.height;

      // Ensure canvas matches high DPI display
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);

      // Re-populate nodes fitting the new size
      initNodes();
    };

    const initNodes = () => {
      nodes = [];
      const types: Array<'circle' | 'rupee-coin' | 'bank' | 'star' | 'trading-chart' | 'wallet'> = [
        'circle',
        'rupee-coin',
        'bank',
        'star',
        'trading-chart',
        'wallet',
      ];
      
      for (let i = 0; i < MAX_NODES; i++) {
        const type = types[Math.floor(Math.random() * types.length)];
        // Keep sizes elegant and medium-small to avoid distraction
        const size = type === 'circle' ? Math.random() * 4 + 3
                   : type === 'rupee-coin' ? Math.random() * 8 + 18
                   : type === 'bank' ? Math.random() * 10 + 22
                   : type === 'star' ? Math.random() * 10 + 14
                   : type === 'trading-chart' ? Math.random() * 10 + 20
                   : Math.random() * 8 + 18; // wallet
        
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          // Extremely soft, slow drift for relaxed and professional feel
          vx: (Math.random() - 0.5) * 0.42, 
          vy: (Math.random() - 0.5) * 0.42,
          size,
          type,
          angle: Math.random() * Math.PI * 2,
          // Very gentle, lazy spin
          spinSpeed: (Math.random() - 0.5) * 0.015, 
          // Indian Flag & Fintech inspired colors (Soft Blue, Emerald Green, Warm Gold)
          baseColor: i % 3 === 0 ? '59, 130, 246' : i % 3 === 1 ? '16, 185, 129' : '245, 158, 11',
          pulseState: Math.random() * Math.PI,
          pulseSpeed: 0.012 + Math.random() * 0.018,
        });
      }
    };

    const drawSparkleStar = (c: CanvasRenderingContext2D, size: number) => {
      c.beginPath();
      // Draw 4-point sparkle star using quadratic curves
      c.moveTo(0, -size / 1.1);
      c.quadraticCurveTo(0, 0, size / 1.1, 0);
      c.quadraticCurveTo(0, 0, 0, size / 1.1);
      c.quadraticCurveTo(0, 0, -size / 1.1, 0);
      c.quadraticCurveTo(0, 0, 0, -size / 1.1);
      c.closePath();
    };

    const drawBank = (c: CanvasRenderingContext2D, size: number) => {
      // 1. Triangular Roof
      c.beginPath();
      c.moveTo(-size / 2, -size / 6);
      c.lineTo(0, -size / 2);
      c.lineTo(size / 2, -size / 6);
      c.closePath();
      c.fillStyle = ctx.fillStyle;
      c.fill();
      c.stroke();

      // 2. Architrave beam (under roof)
      c.beginPath();
      c.rect(-size / 2 - 2, -size / 6, size + 4, size / 10);
      c.fill();
      c.stroke();

      // 3. Three Pillars
      const pillarWidth = size / 10;
      const pillarHeight = size / 2.2;
      const positions = [-size / 3, 0, size / 3];
      
      positions.forEach((posX) => {
        c.beginPath();
        c.rect(posX - pillarWidth / 2, -size / 15, pillarWidth, pillarHeight);
        c.fill();
        c.stroke();
      });

      // 4. Base Steps
      c.beginPath();
      c.rect(-size / 2 - 4, -size / 15 + pillarHeight, size + 8, size / 10);
      c.fill();
      c.stroke();
    };

    const drawTradingChart = (c: CanvasRenderingContext2D, size: number) => {
      // Draw 3 classic financial candlesticks (green/red trading representation)
      const spacing = size / 3.2;
      
      // Left candlestick (Bearish/Downward style)
      c.beginPath();
      c.moveTo(-spacing, -size / 3);
      c.lineTo(-spacing, size / 3);
      c.stroke();
      c.beginPath();
      c.rect(-spacing - 3, -size / 8, 6, size / 3.2);
      c.fill();
      c.stroke();

      // Middle candlestick (Bullish/Upward style)
      c.beginPath();
      c.moveTo(0, -size / 2);
      c.lineTo(0, size / 6);
      c.stroke();
      c.beginPath();
      c.rect(-3, -size / 3, 6, size / 2.8);
      c.fill();
      c.stroke();

      // Right candlestick (High Bullish style)
      c.beginPath();
      c.moveTo(spacing, -size / 6);
      c.lineTo(spacing, size / 2);
      c.stroke();
      c.beginPath();
      c.rect(spacing - 3, -size / 22, 6, size / 3);
      c.fill();
      c.stroke();
    };

    const drawWallet = (c: CanvasRenderingContext2D, size: number) => {
      // Main wallet body with rounded corners manually or simple rectangles
      c.beginPath();
      c.rect(-size / 2, -size / 3, size, size * 0.72);
      c.fill();
      c.stroke();

      // Flap opening
      c.beginPath();
      c.moveTo(size / 6, -size / 6);
      c.lineTo(size / 2 + 2, -size / 6);
      c.lineTo(size / 2 + 2, size / 6);
      c.lineTo(size / 6, size / 6);
      c.closePath();
      c.fill();
      c.stroke();

      // Flap button
      c.beginPath();
      c.arc(size / 3, 0, size / 12, 0, Math.PI * 2);
      c.fill();
      c.stroke();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Light/dark responsive colors for connections
      const strokeAlpha = isDarkMode ? 0.05 : 0.07;
      const pointAlpha = isDarkMode ? 0.22 : 0.18;
      const nodeFillAlpha = isDarkMode ? 0.025 : 0.035;

      // Draw connections first (line meshes)
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Draw connections if nodes are within close proximity
          if (dist < 160) {
            const alpha = (1 - dist / 160) * strokeAlpha;
            ctx.lineWidth = 0.7;
            ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
          }
        }
      }

      // Draw and update each node shape
      nodes.forEach((node) => {
        // Move softly
        node.x += node.vx;
        node.y += node.vy;
        node.angle += node.spinSpeed;

        // Clip/bounce boundaries smoothly
        if (node.x < -30) node.x = width + 30;
        if (node.x > width + 30) node.x = -30;
        if (node.y < -30) node.y = height + 30;
        if (node.y > height + 30) node.y = -30;

        ctx.save();
        ctx.translate(node.x, node.y);
        ctx.rotate(node.angle);

        // Apply scale pulsing
        if (node.pulseState !== undefined && node.pulseSpeed !== undefined) {
          node.pulseState += node.pulseSpeed;
          const pulseFactor = 0.88 + Math.sin(node.pulseState) * 0.12;
          ctx.scale(pulseFactor, pulseFactor);
        }

        // Apply colors
        ctx.strokeStyle = `rgba(${node.baseColor}, ${pointAlpha})`;
        ctx.fillStyle = `rgba(${node.baseColor}, ${nodeFillAlpha})`;
        ctx.lineWidth = 0.95;

        if (node.type === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, node.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        } else if (node.type === 'rupee-coin') {
          // Double circle coin representation with Indian Rupee symbol
          ctx.beginPath();
          ctx.arc(0, 0, node.size, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${node.baseColor}, ${pointAlpha * 1.5})`;
          ctx.fillStyle = `rgba(${node.baseColor}, ${nodeFillAlpha * 2.2})`;
          ctx.fill();
          ctx.stroke();
          
          ctx.beginPath();
          ctx.arc(0, 0, node.size * 0.74, 0, Math.PI * 2);
          ctx.stroke();

          // ₹ Symbol in coin center (without rotating text so it's upright and legible)
          ctx.save();
          ctx.rotate(-node.angle); // Counter-rotate so symbol is upright
          ctx.fillStyle = `rgba(${node.baseColor}, ${pointAlpha * 2.4})`;
          ctx.font = `bold ${Math.round(node.size * 0.9)}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('₹', 0, 0.5);
          ctx.restore();
        } else if (node.type === 'star') {
          ctx.fillStyle = `rgba(${node.baseColor}, ${nodeFillAlpha * 1.8})`;
          drawSparkleStar(ctx, node.size);
          ctx.fill();
          ctx.stroke();
          
          // Glow dot in center
          ctx.beginPath();
          ctx.arc(0, 0, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${node.baseColor}, ${pointAlpha * 2.2})`;
          ctx.fill();
        } else if (node.type === 'bank') {
          drawBank(ctx, node.size);
        } else if (node.type === 'trading-chart') {
          drawTradingChart(ctx, node.size);
        } else if (node.type === 'wallet') {
          drawWallet(ctx, node.size);
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    // Responsive element resizing using ResizeObserver
    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    resizeCanvas();
    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      observer.disconnect();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden"
    >
      <canvas 
        ref={canvasRef} 
        className="block"
      />
    </div>
  );
}
