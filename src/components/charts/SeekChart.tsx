import React from "react";

interface SeekChartProps {
  sequence: number[];
}

const SeekChart: React.FC<SeekChartProps> = ({ sequence }) => {
  if (!sequence || sequence.length === 0) {
    return <div>No seek sequence provided.</div>;
  }

  // Sorted unique track positions for X-axis
  const sortedTracks = Array.from(new Set(sequence)).sort((a, b) => a - b);

  // Chart layout
  const baseWidth = 750;
  const minWidthPerTrack = 60; // More tracks = wider chart automatically
  const width = Math.max(baseWidth, sortedTracks.length * minWidthPerTrack);
  const baseHeight = 400;
  const minHeightPerStep = 50; // More steps = taller chart
  const height = Math.max(baseHeight, sequence.length * minHeightPerStep);
  const padding = 60;

  const stepHeight = minHeightPerStep; // Fixed step height
  const usableWidth = width - padding * 2;

  // Map track → X coordinate (based on sorted track order)
  const trackToX = (track: number) => {
    const index = sortedTracks.indexOf(track);
    return padding + (index / (sortedTracks.length - 1)) * usableWidth;
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

        {/* X-axis Labels (sorted ascending track numbers) */}
        {sortedTracks.map((track) => {
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

        {/* Points + labels for each access */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={5} fill="#007bff" />
            <text
              x={p.x + 8}
              y={p.y + 4}
              fontSize="12"
              fill="#111"
            >
              {`[${p.track}]`}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

export default SeekChart;
