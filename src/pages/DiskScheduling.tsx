// DiskScheduling.tsx
import type React from "react";
import { useState, useEffect } from "react";
import InputCard from "@/components/InputCard";
import OutputCard from "@/components/OutputCard";
import { computeSCAN } from "@/algorithms/scan";

/**
 * Main component for the SCAN Disk Scheduling Algorithm simulator
 * Orchestrates the input processing, algorithm execution, and result display
 */
const DiskScheduling: React.FC = () => {
  // State for storing algorithm results
  const [output, setOutput] = useState<{
    seekSequence: number[];
    totalOverheadMovement: number;
    steps: string;
  } | null>(null);

  // State for user inputs
  const [requests, setRequests] = useState<string>("");
  const [head, setHead] = useState<string>("");
  const [direction, setDirection] = useState<string>("right");
  const [diskSize, setDiskSize] = useState<string>("");
  const [parsedRequests, setParsedRequests] = useState<number[]>([]);
  const [isSolved, setIsSolved] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  // Reset solved state when any input changes
  useEffect(() => {
    setIsSolved(false);
    setOutput(null);
  }, [requests, head, diskSize]);

  /**
   * Handles the solve button click - processes inputs and executes SCAN algorithm
   */
  const handleSolve = () => {
    const reqs = requests
      .split(/\s+/)
      .map((r) => parseInt(r.trim()))
      .filter((r) => !isNaN(r));

    const headPos = parseInt(head);
    const maxCylinder = parseInt(diskSize) || 199;
    setParsedRequests(reqs);

    if (isNaN(headPos)) {
      alert("Please enter valid head position");
      return;
    }

    const result = computeSCAN(reqs, headPos, direction as "right" | "left", maxCylinder);
    
    setOutput({
      seekSequence: result.seekSequence,
      totalOverheadMovement: result.totalOverheadMovement,
      steps: result.stepsExpression
    });
    
    setIsSolved(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="w-full max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl lg:text-4xl font-bold font-poppins bg-gradient-to-r from-green-700 via-blue-700 to-purple-700 bg-clip-text text-transparent">
                SCAN Disk Scheduling
              </h1>
              <p className="text-gray-600 font-poppins mt-2">
                Elevator Algorithm Simulator
              </p>
            </div>
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-poppins font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {showInfo ? "Hide Info" : "About SCAN Algorithm"}
            </button>
          </div>
        </div>
      </header>

      {/* Algorithm Information Panel */}
      {showInfo && (
        <div className="w-full bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-inner animate-slideDown">
          <div className="w-full max-w-7xl mx-auto px-4 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-bold font-poppins text-gray-800 flex items-center gap-2">
                  How SCAN Algorithm Works
                </h3>
                <div className="space-y-3 text-sm text-gray-700 font-poppins">
                  <p className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span><strong>Elevator Movement:</strong> The disk arm moves like an elevator - going in one direction until the end, then reversing.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span><strong>Direction-based:</strong> Starts moving in the specified direction (left or right), servicing all requests along the way.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span><strong>Boundary Reach:</strong> Always moves to the disk boundary (0 or max track) before reversing direction.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span><strong>Starvation-free:</strong> Ensures all requests are serviced eventually, preventing starvation.</span>
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold font-poppins text-gray-800 flex items-center gap-2">
                  Key Characteristics
                </h3>
                <div className="space-y-3 text-sm text-gray-700 font-poppins">
                  <p className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span><strong>Better than FCFS:</strong> More efficient than First-Come-First-Serve with lower seek times.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span><strong>Predictable:</strong> Easy to implement and understand with consistent performance.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span><strong>Fairness:</strong> Provides better response times for requests in the middle of the disk.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span><strong>Real-world Use:</strong> Commonly used in modern operating systems and database management.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full py-6 sm:py-8 px-3 sm:px-4">
        <div className="w-full max-w-7xl mx-auto">
          <div className="flex flex-col xl:flex-row gap-6 lg:gap-8 xl:gap-10">
            {/* Input Panel */}
            <div className="w-full xl:w-[400px] xl:flex-shrink-0 animate-fadeInLeft">
              <InputCard
                requests={requests}
                setRequests={setRequests}
                head={head}
                setHead={setHead}
                direction={direction}
                setDirection={setDirection}
                diskSize={diskSize}
                setDiskSize={setDiskSize}
                onSolve={handleSolve}
              />
            </div>
            
            {/* Output Panel */}
            <div className="flex-1 min-w-0 animate-fadeInRight">
              <OutputCard 
                output={output} 
                diskSize={parseInt(diskSize) || 199} 
                requests={parsedRequests} 
                isSolved={isSolved} 
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full flex justify-center mt-auto py-6">
        <div className="w-full max-w-4xl bg-gradient-to-r from-green-800 to-blue-900 text-white py-4 px-6 text-center text-xs sm:text-sm rounded-2xl shadow-2xl backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
            <span className="font-poppins">© 2025–2026 College of Computer Science, DMMMSU–SLUC.</span>
            <span className="hidden sm:block">|</span>
            <a 
              href="https://github.com/zholzxszs/SCAN-Disk-Algorithm" 
              target="_blank" 
              className="text-white/90 hover:text-white hover:underline hover:decoration-white transition-all duration-300 font-poppins flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              zholzxszs
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DiskScheduling;