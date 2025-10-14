import type React from "react";
import { useState } from "react";
import InputCard from "@/components/InputCard";
import OutputCard from "@/components/OutputCard";
import { computeSCAN } from "@/algorithms/scan";

const DiskScheduling: React.FC = () => {
  const [output, setOutput] = useState<{
    seekSequence: number[];
    totalSeekTime: number;
    steps: string;
  } | null>(null);

  const [requests, setRequests] = useState<string>("");
  const [head, setHead] = useState<string>("");
  const [direction, setDirection] = useState<string>("right");
  const [diskSize, setDiskSize] = useState<string>("");

  const handleSolve = () => {
    // Handle both comma and space separated numbers
    const reqs = requests
      .split(/[\s,]+/)  // split by one or more spaces or commas
      .map((r) => parseInt(r.trim()))
      .filter((r) => !isNaN(r));

    const headPos = parseInt(head);
    const maxCylinder = parseInt(diskSize) || 199;

    if (!reqs.length || isNaN(headPos)) {
      alert("Please enter valid inputs");
      return;
    }

    const result = computeSCAN(reqs, headPos, direction as "right" | "left", maxCylinder);
    setOutput({
      seekSequence: result.seekSequence,
      totalSeekTime: result.totalSeekTime,
      steps: result.stepsExpression // or result.stepsDetailed if you want more detailed steps
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content */}
      <main className="flex-1 w-full pt-10">
        <div className="w-full max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-15">
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
            <div className="flex-1 min-w-0">
              <OutputCard output={output} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full flex justify-center mt-auto">
        <div className="w-[620px] bg-green-800 text-white py-3 px-4 text-center text-xs sm:text-sm rounded-t-[10px]">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-1 sm:gap-2">
            <span>© 2025–2026 College of Computer Science, DMMMSU–SLUC.</span>
            <span className="hidden sm:block">|</span>
            <span>zholzxszs</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DiskScheduling;
