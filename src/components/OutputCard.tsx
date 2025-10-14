import SeekChart from "../components/charts/SeekChart";

interface OutputCardProps {
  output: {
    seekSequence: number[];
    totalSeekTime: number;
    steps: string;
  } | null;
}

const OutputCard = ({ output }: OutputCardProps) => {
  return (
    <div className="relative min-w-[825px] min-h-[575px] bg-white rounded-[10px] shadow-[4px_4px_10px_rgba(0,0,0,0.25)] p-6">
      <h2 className="text-2xl font-bold text-black mb-6 font-poppins">Output</h2>

      {output ? (
        <>
          {/* Total Seek Time */}
          <div className="mb-4 font-poppins text-black">
            <div className="flex text-sm">
              <span className="font-medium">Total Seek Time</span>
              <span className="ml-2">= {output.steps}</span>
            </div>
            <div className="flex mt-1 ml-[108px]">
              <span className="text-sm font-bold">= {output.totalSeekTime}</span>
            </div>
          </div>

          {/* Seek Sequence */}
          <div className="mb-15">
            <p className="text-sm text-black font-poppins">
              <span className="font-medium">Seek Sequence</span>{" "}
              <span className="ml-2">
                = {output.seekSequence.join(" ")}
              </span>
            </p>
          </div>

          {/* Chart */}
          <div className="w-full h-[274px] mx-auto">
            <SeekChart sequence={output.seekSequence} />
          </div>
        </>
      ) : (
        <p className="text-gray-500 text-sm font-poppins">
          No output yet. Fill input and click SOLVE.
        </p>
      )}
    </div>
  );
};

export default OutputCard;
