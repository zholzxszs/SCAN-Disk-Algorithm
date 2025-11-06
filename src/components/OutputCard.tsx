// OutputCard.tsx - OPTIMIZED VERSION
import SeekChart from "../components/charts/SeekChart";

interface OutputCardProps {
  output: {
    seekSequence: number[];
    totalOverheadMovement: number;
    steps: string;
  } | null;
  diskSize: number;
  requests: number[];
  isSolved: boolean;
}

/**
 * Displays the results of the SCAN disk scheduling algorithm
 * Optimized with reduced animations and effects
 */
const OutputCard = ({ output, diskSize, requests, isSolved }: OutputCardProps) => {
  const numberOfRequests = requests ? requests.length : 0;
  const averageOverheadMovement = output && numberOfRequests > 0 
    ? output.totalOverheadMovement / numberOfRequests 
    : 0;

  return (
    <div className="relative w-full min-h-[500px] sm:min-h-[625px] bg-white rounded-2xl shadow-sm p-4 sm:p-6 transition-shadow duration-200 border border-gray-100">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 font-poppins bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text">
          Algorithm Results
        </h2>
      </div>

      {output && isSolved ? (
        <div className="space-y-6">
          {/* Results Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-[#1D4ED8] rounded-xl p-4 transition-colors duration-200">
              <div className="font-poppins uppercase tracking-wide text-xs font-semibold text-white/70">Total Movement</div>
              <div className="font-poppins text-2xl font-bold text-white mt-1">{output.totalOverheadMovement}</div>
              <div className="font-poppins text-xs text-white/60">Cylinders</div>
            </div>
            <div className="bg-[#15803D] rounded-xl p-4 transition-colors duration-200">
              <div className="font-poppins uppercase tracking-wide text-xs font-semibold text-white/70">Average Movement</div>
              <div className="font-poppins text-2xl font-bold text-white mt-1">{averageOverheadMovement.toFixed(2)}</div>
              <div className="font-poppins text-xs text-white/60">Per Request</div>
            </div>
            <div className="bg-[#6D28D9] rounded-xl p-4 transition-colors duration-200">
              <div className="font-poppins uppercase tracking-wide text-xs font-semibold text-white/70">Requests</div>
              <div className="font-poppins text-2xl font-bold text-white mt-1">{numberOfRequests}</div>
              <div className="font-poppins text-xs text-white/60">Processed</div>
            </div>
          </div>

          {/* Seek Sequence */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 font-poppins">
              Seek Sequence
            </h3>
            <div className="bg-white rounded-lg p-3 border border-gray-300">
              <p className="text-sm font-mono text-gray-800 break-all font-poppins">
                {output.seekSequence.join(" → ")}
              </p>
            </div>
          </div>

          {/* Calculation Steps */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 font-poppins">
              Calculation Steps
            </h3>
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-sm font-poppins">
                <span className="font-semibold text-gray-700">Total Overhead Movement =</span>
                <span className="text-gray-600">{output.steps}<span className="font-semibold text-blue-700 ml-2">= {output.totalOverheadMovement}</span></span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-sm font-poppins">
                <span className="font-semibold text-gray-700">Average Overhead Movement =</span>
                <span className="text-gray-600">{output.totalOverheadMovement} / {numberOfRequests}</span>
                <span className="font-semibold text-blue-700">= {averageOverheadMovement.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Visual Chart */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 font-poppins">
              Seek Sequence Visualization
            </h3>
            <div className="w-full h-[250px] sm:h-[300px]">
              <SeekChart sequence={output.seekSequence} diskSize={diskSize} /> 
            </div>
          </div>
        </div>
      ) : (
        // Placeholder when no results are available yet
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-sm font-poppins text-center">
            No output yet. Fill input parameters and click <span className="font-semibold text-green-600">SOLVE</span>.
          </p>
        </div>
      )}
    </div>
  );
};

export default OutputCard;