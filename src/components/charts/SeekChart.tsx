import React from "react";

interface SeekChartProps {
  sequence: number[];
}

const SeekChart: React.FC<SeekChartProps> = ({ sequence }) => {
  const maxValue = Math.max(...sequence);
  const minValue = Math.min(...sequence);
  const range = maxValue - minValue;
  const padding = 40; // Padding for labels

  const contentHeight = Math.max(274, padding + (sequence.length * 40) + 40); // Minimum height or calculated height
  // Function to select a subset of values to show as labels
  const selectLabelValues = () => {
    if (sequence.length <= 5) return sequence;
    
    // Always include first, last, and some values in between
    const result = [sequence[0]];
    
    // Calculate how many middle points to show based on sequence length
    const numMiddlePoints = Math.min(3, Math.floor(sequence.length / 10));
    const step = Math.floor(sequence.length / (numMiddlePoints + 1));
    
    for (let i = step; i < sequence.length - step; i += step) {
      result.push(sequence[i]);
    }
    
    if (!result.includes(sequence[sequence.length - 1])) {
      result.push(sequence[sequence.length - 1]);
    }
    
    return result;
  };

  const labelValues = selectLabelValues();
  
  // Calculate if we need to rotate labels based on the number of values
  const shouldRotateLabels = sequence.length > 10;

  return (
    <div className="w-full h-[274px] relative">
      <div className="absolute inset-0 overflow-y-auto overflow-x-hidden">
        <div style={{ width: '100%', height: contentHeight, position: 'relative' }}>
          {/* X-axis with values */}
          <div className="sticky top-0 left-0 right-0 h-8 flex items-center bg-white z-10">
            {labelValues.map((value) => {
              const position = ((value - minValue) / range) * 100;
              return (
                <div
                  key={`label-${value}`}
                  className="absolute text-xs text-black whitespace-nowrap"
                  style={{
                    left: `${position}%`,
                    transform: shouldRotateLabels 
                      ? 'translateX(-50%) rotate(-45deg) translateY(8px)'
                      : 'translateX(-50%)',
                    transformOrigin: 'top center'
                  }}
                >
                  {value}
                </div>
              );
            })}
          </div>

      {/* Main chart area */}
      <div className="absolute top-8 left-0 right-0 bottom-0">
        {/* Track line */}
        <div className="absolute top-4 left-0 right-0 h-[1px] bg-gray-300" />

        {/* Points and connecting lines */}
        {sequence.map((value, index) => {
          const position = ((value - minValue) / range) * 100;
          const nextValue = sequence[index + 1];
          const nextPosition = nextValue !== undefined 
            ? ((nextValue - minValue) / range) * 100
            : null;

          return (
            <React.Fragment key={`point-${value}-${index}`}>
              {/* Point */}
              <div
                className="absolute w-2 h-2 bg-green-800 rounded-full -translate-x-1 -translate-y-1"
                style={{
                  left: `${position}%`,
                  top: `${padding + index * 40}px`,
                  zIndex: 20
                }}
              />

              {/* Connecting line with arrow */}
              {nextPosition !== null && (
                <svg
                  className="absolute"
                  style={{
                    left: 0,
                    top: 0,
                    width: "100%",
                    height: "100%",
                    overflow: "visible",
                    pointerEvents: "none"
                  }}
                >
                  <defs>
                    <marker
                      id={`arrowhead-${index}`}
                      markerWidth="6"
                      markerHeight="4"
                      refX="5.5"
                      refY="2"
                      orient="auto"
                    >
                      <polygon
                        points="0 0, 6 2, 0 4"
                        fill="rgb(22 101 52)"
                      />
                    </marker>
                  </defs>
                  <line
                    x1={`${position}%`}
                    y1={padding + index * 40}
                    x2={`${nextPosition}%`}
                    y2={padding + (index + 1) * 40}
                    stroke="rgb(22 101 52)"
                    strokeWidth="2"
                    markerEnd={`url(#arrowhead-${index})`}
                  />
                </svg>
              )}
            </React.Fragment>
          );
        })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeekChart;