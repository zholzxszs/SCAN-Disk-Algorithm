import React from "react";

interface SeekChartProps {
  sequence: number[];
  diskSize: number;
}

const SeekChart: React.FC<SeekChartProps> = ({ sequence, diskSize }) => {
  if (!sequence || sequence.length === 0) {
    return <div>No seek sequence provided.</div>;
  }

  // Include 0 and diskSize in the tracks to always show them
  const allTracks = Array.from(new Set([0, ...sequence, diskSize])).sort((a, b) => a - b);
  
  // Chart layout
  const baseWidth = 750;
  const minWidthPerTrack = 60;
  const width = Math.max(baseWidth, allTracks.length * minWidthPerTrack);
  const baseHeight = 400;
  const minHeightPerStep = 50;
  const height = Math.max(baseHeight, sequence.length * minHeightPerStep);
  const padding = 60;

  const stepHeight = minHeightPerStep;
  const usableWidth = width - padding * 2;

  // Map track → X coordinate (based on all tracks including 0 and diskSize)
  const trackToX = (track: number) => {
    const index = allTracks.indexOf(track);
    return padding + (index / (allTracks.length - 1)) * usableWidth;
  };

  // Map step → Y coordinate (based on order of access)
  const stepToY = (step: number) => padding + step * stepHeight;

  // Prepare plotted points
  const points = sequence.map((track, i) => ({
    x: trackToX(track),
    y: stepToY(i),
    track,
    step: i,
  }));

  // Function to draw arrowhead
  const drawArrowhead = (x: number, y: number, angle: number) => {
    const size = 8;
    const radians = (angle * Math.PI) / 180;
    
    const points = [
      [x, y],
      [x - size * Math.cos(radians - Math.PI/6), y - size * Math.sin(radians - Math.PI/6)],
      [x - size * Math.cos(radians + Math.PI/6), y - size * Math.sin(radians + Math.PI/6)]
    ];
    
    return points.map(p => p.join(",")).join(" ");
  };

  // Calculate angles for arrows between points
  const getArrowAngle = (currentPoint: typeof points[0], nextPoint: typeof points[0] | null) => {
    if (!nextPoint) return 0; // Last point, no arrow
    
    const dx = nextPoint.x - currentPoint.x;
    const dy = nextPoint.y - currentPoint.y;
    return (Math.atan2(dy, dx) * 180) / Math.PI;
  };

  return (
    <div
      className="w-full h-[355px] overflow-y-auto"
      style={{
        border: "1px solid #ddd",
        borderRadius: 8,
        background: "white",
        paddingBottom: "8px",
      }}
    >
      <svg
        width={width}
        height={height + 40}
        style={{
          display: "block",
          background: "white",
        }}
      >
        {/* X-axis (TOP) */}
        <line
          x1={padding}
          y1={padding - 20}
          x2={width - padding}
          y2={padding - 20}
          stroke="#111"
          strokeWidth={1.5}
        />

        {/* X-axis Labels (all tracks including 0 and diskSize) */}
        {allTracks.map((track) => {
          const x = trackToX(track);
          return (
            <text
              key={track}
              x={x}
              y={padding - 28}
              fontSize="12"
              textAnchor="middle"
              fill="#333"
            >
              {track}
            </text>
          );
        })}

        {/* Polyline connecting points in original seek order */}
        <polyline
          fill="none"
          stroke="#007bff"
          strokeWidth={2}
          points={points.map((p) => `${p.x},${p.y}`).join(" ")}
        />

        {/* Arrows at each point (except the last one) */}
        {points.map((point, i) => {
          if (i < points.length - 1) {
            const nextPoint = points[i + 1];
            const angle = getArrowAngle(point, nextPoint);
            
            return (
              <g key={i}>
                {/* Arrowhead */}
                <polygon
                  points={drawArrowhead(nextPoint.x, nextPoint.y, angle)}
                  fill="#007bff"
                />
                {/* Step number label */}
                <text
                  x={point.x + 8}
                  y={point.y + 4}
                  fontSize="12"
                  fill="#111"
                >
                  {`[${point.track}]`}
                </text>
              </g>
            );
          } else {
            // Last point - just show the label without arrow
            return (
              <text
                key={i}
                x={point.x + 8}
                y={point.y + 4}
                fontSize="12"
                fill="#111"
              >
                {`[${point.track}]`}
              </text>
            );
          }
        })}
      </svg>
    </div>
  );
};

export default SeekChart;