// SeekChart.tsx - ARROWS ONLY VERSION
import React from "react";

interface SeekChartProps {
  sequence: number[];
  diskSize: number;
}

const SeekChart: React.FC<SeekChartProps> = ({ sequence, diskSize }) => {
  // Early return if no valid sequence is provided
  if (!sequence || sequence.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <p>No seek sequence provided.</p>
        </div>
      </div>
    );
  }

  // Create comprehensive track list that always includes boundaries (0 and diskSize)
  const allTracks = Array.from(new Set([0, ...sequence, diskSize])).sort((a, b) => a - b);
  
  // Responsive chart sizing
  const containerWidth = Math.min(800, Math.max(350, typeof window !== 'undefined' ? window.innerWidth - 100 : 800));
  const baseWidth = containerWidth;
  const minWidthPerTrack = 40;
  const width = Math.max(baseWidth, allTracks.length * minWidthPerTrack);
  const baseHeight = 300;
  const minHeightPerStep = 40;
  const height = Math.max(baseHeight, sequence.length * minHeightPerStep);
  const padding = 40;

  const stepHeight = minHeightPerStep;
  const usableWidth = width - padding * 2;

  /**
   * Converts a track number to its corresponding X coordinate on the chart
   */
  const trackToX = (track: number) => {
    const index = allTracks.indexOf(track);
    return padding + (index / (allTracks.length - 1)) * usableWidth;
  };

  /**
   * Converts a step index to its corresponding Y coordinate on the chart
   */
  const stepToY = (step: number) => padding + step * stepHeight;

  // Transform seek sequence into plottable points with coordinates
  const points = sequence.map((track, i) => ({
    x: trackToX(track),
    y: stepToY(i),
    track,
    step: i,
  }));

  /**
   * Generates SVG polygon points for an arrowhead
   */
  const drawArrowhead = (x: number, y: number, angle: number, size: number = 6) => {
    const radians = (angle * Math.PI) / 180;
    
    const points = [
      [x, y],
      [x - size * Math.cos(radians - Math.PI/6), y - size * Math.sin(radians - Math.PI/6)],
      [x - size * Math.cos(radians + Math.PI/6), y - size * Math.sin(radians + Math.PI/6)]
    ];
    
    return points.map(p => p.join(",")).join(" ");
  };

  /**
   * Calculates the angle between two points for arrow direction
   */
  const getArrowAngle = (currentPoint: typeof points[0], nextPoint: typeof points[0] | null) => {
    if (!nextPoint) return 0;
    
    const dx = nextPoint.x - currentPoint.x;
    const dy = nextPoint.y - currentPoint.y;
    return (Math.atan2(dy, dx) * 180) / Math.PI;
  };

  return (
    <div
      className="w-full h-full overflow-auto"
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: 8,
        background: "#f8fafc",
      }}
    >
      <svg
        width={width}
        height={height + 30}
        style={{
          display: "block",
          background: "transparent",
          minWidth: "100%",
        }}
        viewBox={`0 0 ${width} ${height + 30}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* X-axis line */}
        <line
          x1={padding}
          y1={padding - 15}
          x2={width - padding}
          y2={padding - 15}
          stroke="#64748b"
          strokeWidth={1.5}
        />

        {/* Track number labels */}
        {allTracks.map((track) => {
          const x = trackToX(track);
          return (
            <g key={track}>
              <text
                x={x}
                y={padding - 22}
                fontSize="10"
                textAnchor="middle"
                fill="#475569"
                fontWeight="500"
              >
                {track}
              </text>
            </g>
          );
        })}

        {/* Main path line */}
        <polyline
          fill="none"
          stroke="#3b82f6"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points.map((p) => `${p.x},${p.y}`).join(" ")}
        />

        {/* ARROWS ONLY - no circles/dots */}
        {points.map((point, i) => {
          if (i < points.length - 1) {
            const nextPoint = points[i + 1];
            const angle = getArrowAngle(point, nextPoint);
            
            return (
              <g key={i}>
                {/* Arrowhead at the destination */}
                <polygon
                  points={drawArrowhead(nextPoint.x, nextPoint.y, angle, 8)}
                  fill="#3b82f6"
                />
                
                {/* Track number label */}
                <text
                  x={point.x + 8}
                  y={point.y + 4}
                  fontSize="10"
                  fill="#1f2937"
                  fontWeight="500"
                >
                  {point.track}
                </text>
              </g>
            );
          } else {
            // Last point - just show the label
            return (
              <g key={i}>
                <text
                  x={point.x + 8}
                  y={point.y + 4}
                  fontSize="10"
                  fill="#1f2937"
                  fontWeight="500"
                >
                  {point.track}
                </text>
              </g>
            );
          }
        })}
      </svg>
    </div>
  );
};

export default SeekChart;