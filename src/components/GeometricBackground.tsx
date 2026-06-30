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
      type: 'circle' | 'triangle' | 'square' | 'hexagon' | 'currency';
      currencySymbol?: string;
      angle: number;
      spinSpeed: number;
      baseColor: string;
    }

    let nodes: GeometricNode[] = [];
    const MAX_NODES = 45;

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
      const types: Array<'circle' | 'triangle' | 'square' | 'hexagon' | 'currency'> = [
        'circle',
        'triangle',
        'square',
        'hexagon',
        'currency',
      ];
      const currencies = ['₹', '$', '€', '£', '¥', '₩', '₽', '₺', '฿', '₫', '₪', '₱', '₭', 'A$', 'C$'];
      
      for (let i = 0; i < MAX_NODES; i++) {
        const type = types[Math.floor(Math.random() * types.length)];
        // Keep sizes elegant and medium-small to avoid distraction
        const size = type === 'circle' ? Math.random() * 3 + 2 : Math.random() * 14 + 10;
        const currencySymbol = type === 'currency' ? currencies[Math.floor(Math.random() * currencies.length)] : undefined;
        
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 1.5, // Faster drift (was 0.4)
          vy: (Math.random() - 0.5) * 1.5,
          size,
          type,
          currencySymbol,
          angle: Math.random() * Math.PI * 2,
          spinSpeed: (Math.random() - 0.5) * 0.04, // Faster rotation
          baseColor: i % 2 === 0 ? '59, 130, 246' : '245, 158, 11', // Blue vs Amber theme
        });
      }
    };

    const drawHexagon = (c: CanvasRenderingContext2D, x: number, y: number, r: number) => {
      c.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        c.lineTo(x + r * Math.cos(angle), y + r * Math.sin(angle));
      }
      c.closePath();
    };

    const drawTriangle = (c: CanvasRenderingContext2D, x: number, y: number, r: number) => {
      c.beginPath();
      for (let i = 0; i < 3; i++) {
        const angle = (i * 2 * Math.PI) / 3 - Math.PI / 2;
        c.lineTo(x + r * Math.cos(angle), y + r * Math.sin(angle));
      }
      c.closePath();
    };

    const drawSquare = (c: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      c.beginPath();
      c.rect(x - size / 2, y - size / 2, size, size);
      c.closePath();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Light/dark responsive colors for connections
      const strokeAlpha = isDarkMode ? 0.07 : 0.09;
      const pointAlpha = isDarkMode ? 0.25 : 0.2;
      const nodeFillAlpha = isDarkMode ? 0.03 : 0.04;

      // Draw connections first (line meshes)
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Draw connections if nodes are within close proximity
          if (dist < 150) {
            const alpha = (1 - dist / 150) * strokeAlpha;
            ctx.lineWidth = 0.8;
            // Use blue-ish connection colors
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
        // Move
        node.x += node.vx;
        node.y += node.vy;
        node.angle += node.spinSpeed;

        // Bounce boundaries
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        // Clip to edge safely
        if (node.x < -10) node.x = width + 10;
        if (node.x > width + 10) node.x = -10;
        if (node.y < -10) node.y = height + 10;
        if (node.y > height + 10) node.y = -10;

        ctx.save();
        ctx.translate(node.x, node.y);
        ctx.rotate(node.angle);

        // Apply colors
        ctx.strokeStyle = `rgba(${node.baseColor}, ${pointAlpha})`;
        ctx.fillStyle = `rgba(${node.baseColor}, ${nodeFillAlpha})`;
        ctx.lineWidth = 1;

        if (node.type === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, node.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        } else if (node.type === 'triangle') {
          drawTriangle(ctx, 0, 0, node.size);
          ctx.fill();
          ctx.stroke();
        } else if (node.type === 'square') {
          drawSquare(ctx, 0, 0, node.size);
          ctx.fill();
          ctx.stroke();
        } else if (node.type === 'hexagon') {
          drawHexagon(ctx, 0, 0, node.size);
          ctx.fill();
          ctx.stroke();
        } else if (node.type === 'currency' && node.currencySymbol) {
          ctx.fillStyle = `rgba(${node.baseColor}, ${pointAlpha * 1.5})`;
          ctx.font = `900 ${Math.round(node.size)}px sans-serif`;
          ctx.fillText(node.currencySymbol, -node.size / 2, node.size / 3);
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
