import { useEffect, useRef } from 'react';

export default function AudioVisualizer({
  isActive = false,
  audioLevel = 0,
  frequencyData = null,
  isTts = false,
  height = 64,
  barColor = '#6366F1'
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    const render = () => {
      const width = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, width, h);

      const barCount = 32;
      const barWidth = Math.max(2, (width / barCount) - 3);

      for (let i = 0; i < barCount; i++) {
        let value = 4; // base idle height

        if (isActive) {
          if (frequencyData && frequencyData.length > 0) {
            const dataIndex = Math.floor((i / barCount) * frequencyData.length);
            const rawVal = frequencyData[dataIndex] || 0;
            value = Math.max(4, (rawVal / 255) * (h - 8));
          } else {
            // Simulated dynamic speech wave when frequency buffer is transitioning
            const wave = Math.sin(Date.now() / 150 + i * 0.4);
            const simulatedLevel = (audioLevel / 100) * (h - 8);
            value = Math.max(4, simulatedLevel * (0.6 + 0.4 * wave));
          }
        } else if (isTts) {
          // Tutor speech rhythmic wave
          const wave = (Math.sin(Date.now() / 120 + i * 0.5) + 1) / 2;
          value = Math.max(4, wave * (h * 0.75));
        }

        const x = i * (barWidth + 3) + 4;
        const y = (h - value) / 2;

        // Gradient for each bar
        const gradient = ctx.createLinearGradient(0, y, 0, y + value);
        if (isTts) {
          gradient.addColorStop(0, '#06B6D4'); // Cyan for AI speaking
          gradient.addColorStop(1, '#3B82F6');
        } else if (isActive) {
          gradient.addColorStop(0, '#818CF8'); // Indigo/violet for User speaking
          gradient.addColorStop(1, '#6366F1');
        } else {
          gradient.addColorStop(0, '#374151');
          gradient.addColorStop(1, '#1F2937');
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, value, [4]);
        ctx.fill();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [isActive, audioLevel, frequencyData, isTts]);

  return (
    <div className="w-full flex items-center justify-center overflow-hidden py-1">
      <canvas
        ref={canvasRef}
        width={340}
        height={height}
        className="w-full max-w-sm rounded-xl"
      />
    </div>
  );
}
