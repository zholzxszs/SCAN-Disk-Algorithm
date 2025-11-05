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

  // Reset solved state when any input changes
  useEffect(() => {
    setIsSolved(false);
    setOutput(null);
  }, [requests, head, diskSize]);

  /**
   * Handles the solve button click - processes inputs and executes SCAN algorithm
   * Converts string inputs to numbers and validates before computation
   */
  const handleSolve = () => {
    // Parse work queue: split by whitespace, convert to numbers, filter out invalid entries
    const reqs = requests
      .split(/\s+/)  // split by one or more whitespace characters
      .map((r) => parseInt(r.trim())) // Create new array and type cast it in integer
      .filter((r) => !isNaN(r)); // Filter only valid number

    // Parse numeric inputs with fallback values
    const headPos = parseInt(head);
    const maxCylinder = parseInt(diskSize) || 199; // Default to 199 if invalid
    setParsedRequests(reqs);

    // Basic validation - head position is required
    if (isNaN(headPos)) {
      alert("Please enter valid head position");
      return;
    }

    // Execute SCAN algorithm with parsed inputs
    const result = computeSCAN(reqs, headPos, direction as "right" | "left", maxCylinder);
    
    // Update state with algorithm results for display
    setOutput({
      seekSequence: result.seekSequence,
      totalOverheadMovement: result.totalOverheadMovement,
      steps: result.stepsExpression // Mathematical expression of seek operations
    });
    
    setIsSolved(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content Area */}
      <main className="flex-1 w-full pt-10">
        <div className="w-full max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-15">
            {/* Input Panel - Fixed width on large screens */}
            <div className="w-full lg:w-[370px] lg:flex-shrink-0">
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
            {/* Output Panel - Flexible width to accommodate chart */}
            <div className="flex-1 min-w-0">
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

      {/* Footer with attribution and links */}
      <footer className="w-full flex justify-center mt-auto">
        <div className="w-[620px] bg-green-800 text-white py-3 px-4 text-center text-xs sm:text-sm rounded-t-[10px]">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-1 sm:gap-2">
            <span>© 2025–2026 College of Computer Science, DMMMSU–SLUC.</span>
            <span className="hidden sm:block">|</span>
            <a href="https://github.com/zholzxszs/SCAN-Disk-Algorithm" target="_blank" className="text-white hover:underline hover:decoration-white">zholzxszs</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DiskScheduling;