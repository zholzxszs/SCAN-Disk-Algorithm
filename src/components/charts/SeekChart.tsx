import React from "react";

interface SeekChartProps {
  sequence: number[];
  diskSize: number;
}

const SeekChart: React.FC<SeekChartProps> = ({ sequence, diskSize }) => {
  // Early return if no valid sequence is provided
  if (!sequence || sequence.length === 0) {
    return <div>No seek sequence provided.</div>;
  }

  // Create comprehensive track list that always includes boundaries (0 and diskSize)
  // This ensures the chart always shows the full disk range for context
  const allTracks = Array.from(new Set([0, ...sequence, diskSize])).sort((a, b) => a - b);
  
  // Chart layout configuration with responsive sizing
  const baseWidth = 750;                    // Minimum chart width
  const minWidthPerTrack = 60;              // Width allocated per track for spacing
  const width = Math.max(baseWidth, allTracks.length * minWidthPerTrack); // Dynamic width based on track count
  const baseHeight = 400;                   // Minimum chart height
  const minHeightPerStep = 50;              // Height allocated per seek step
  const height = Math.max(baseHeight, sequence.length * minHeightPerStep); // Dynamic height based on sequence length
  const padding = 60;                       // Padding around chart edges

  const stepHeight = minHeightPerStep;      // Fixed vertical spacing between steps
  const usableWidth = width - padding * 2;  // Actual drawing area width

  /**
   * Converts a track number to its corresponding X coordinate on the chart
   * Uses linear interpolation based on track's position in sorted track list
   */
  const trackToX = (track: number) => {
    const index = allTracks.indexOf(track);
    return padding + (index / (allTracks.length - 1)) * usableWidth;
  };

  /**
   * Converts a step index to its corresponding Y coordinate on the chart
   * Steps are plotted vertically to show temporal sequence of disk access
   */
  const stepToY = (step: number) => padding + step * stepHeight;

  // Transform seek sequence into plottable points with coordinates
  const points = sequence.map((track, i) => ({
    x: trackToX(track),  // X coordinate based on track position
    y: stepToY(i),       // Y coordinate based on step order
    track,               // Original track number
    step: i,             // Step index in sequence
  }));

  /**
   * Generates SVG polygon points for an arrowhead
   * Creates a triangular arrow pointing in the specified direction
   */
  const drawArrowhead = (x: number, y: number, angle: number) => {
    const size = 8;  // Arrowhead size in pixels
    const radians = (angle * Math.PI) / 180;  // Convert degrees to radians
    
    // Calculate three points for triangle: tip and two base corners
    const points = [
      [x, y],  // Arrow tip
      [x - size * Math.cos(radians - Math.PI/6), y - size * Math.sin(radians - Math.PI/6)],  // Left base corner
      [x - size * Math.cos(radians + Math.PI/6), y - size * Math.sin(radians + Math.PI/6)]   // Right base corner
    ];
    
    return points.map(p => p.join(",")).join(" ");  // Convert to SVG points format
  };

  /**
   * Calculates the angle (in degrees) between two points for arrow direction
   * Uses arctangent to determine the angle from current to next point
   */
  const getArrowAngle = (currentPoint: typeof points[0], nextPoint: typeof points[0] | null) => {
    if (!nextPoint) return 0; // No angle for last point (no next point)
    
    const dx = nextPoint.x - currentPoint.x;  // Horizontal distance
    const dy = nextPoint.y - currentPoint.y;  // Vertical distance
    return (Math.atan2(dy, dx) * 180) / Math.PI;  // Convert to degrees
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
        {/* X-axis line at the top showing track positions */}
        <line
          x1={padding}
          y1={padding - 20}
          x2={width - padding}
          y2={padding - 20}
          stroke="#111"
          strokeWidth={1.5}
        />

        {/* Track number labels along the X-axis */}
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

        {/* Main path line connecting all seek points in sequence */}
        <polyline
          fill="none"
          stroke="#007bff"
          strokeWidth={2}
          points={points.map((p) => `${p.x},${p.y}`).join(" ")}
        />

        {/* Individual points with arrows and labels */}
        {points.map((point, i) => {
          if (i < points.length - 1) {
            const nextPoint = points[i + 1];
            const angle = getArrowAngle(point, nextPoint);
            
            return (
              <g key={i}>
                {/* Arrowhead at the destination point */}
                <polygon
                  points={drawArrowhead(nextPoint.x, nextPoint.y, angle)}
                  fill="#007bff"
                />
                {/* Track number label positioned to the right of each point */}
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
            // Last point only gets a label (no arrow needed)
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