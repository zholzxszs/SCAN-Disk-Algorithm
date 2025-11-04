import SeekChart from "../components/charts/SeekChart";

interface OutputCardProps {
  output: {
    seekSequence: number[];
    totalOverheadMovement: number;
    steps: string;
  } | null;
  diskSize: number;
}

const OutputCard = ({ output, diskSize }: OutputCardProps) => {
  // Calculate number of requests (seekSequence length minus 1 for initial head position)
  const numberOfRequests = output ? output.seekSequence.length - 1 : 0;
  // Calculate average overhead movement
  const averageOverheadMovement = output && numberOfRequests > 0 
    ? output.totalOverheadMovement / numberOfRequests 
    : 0;

  return (
    <div className="relative min-w-[825px] min-h-[625px] bg-white rounded-[10px] shadow-[4px_4px_10px_rgba(0,0,0,0.25)] p-6">
      <h2 className="text-2xl font-bold text-black mb-6 font-poppins">Output</h2>

      {output ? (
        <>
          {/* Seek Sequence */}
          <div className="mb-4">
            <p className="text-sm text-black font-poppins">
              <span className="font-medium">Seek Sequence</span>{" "}
              <span className="ml-2">
                = {output.seekSequence.join(" ")}
              </span>
            </p>
          </div>

          {/* Total Overhead Movement */}
          <div className="mb-4 font-poppins text-black">
            <div className="flex text-sm">
              <span className="font-medium">Total Overhead Movement</span>
              <span className="ml-2">= {output.steps}</span>
            </div>
            <div className="flex mt-1 ml-[174px]">
              <span className="text-sm font-bold">= {output.totalOverheadMovement}</span>
            </div>
          </div>

          {/* Average Overhead Movement */}
          <div className="mb-10 font-poppins text-black">
            <div className="flex text-sm">
              <span className="font-medium">Average Overhead Movement</span>
              <span className="ml-2">
                = {output.totalOverheadMovement} / {numberOfRequests}
              </span>
            </div>
            <div className="flex mt-1 ml-[190px]">
              <span className="text-sm font-bold">
                = {averageOverheadMovement.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Chart */}
          <div className="w-full h-[300px] mx-auto">
            <SeekChart sequence={output.seekSequence} diskSize={diskSize} /> 
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