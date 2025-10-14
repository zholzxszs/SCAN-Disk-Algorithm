import { useState, type Dispatch, type SetStateAction } from "react";

interface InputCardProps {
  requests: string;
  setRequests: Dispatch<SetStateAction<string>>;
  head: string;
  setHead: Dispatch<SetStateAction<string>>;
  direction: string;
  setDirection: Dispatch<SetStateAction<string>>;
  diskSize: string;
  setDiskSize: Dispatch<SetStateAction<string>>;
  onSolve: () => void;
}

const InputCard = ({
  requests,
  setRequests,
  head,
  setHead,
  direction,
  setDirection,
  diskSize,
  setDiskSize,
  onSolve,
}: InputCardProps) => {
  const [algorithm, setAlgorithm] = useState("SCAN");

  return (
    <div className="relative max-w-[370px] bg-white shadow-[4px_4px_10px_0px_rgba(0,0,0,0.25)] rounded-[10px] p-6">
      {/* Header */}
      <h2 className="text-2xl font-bold text-black mb-6 font-poppins">Input</h2>

      {/* Algorithm */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-black mb-1 font-poppins">
          Algorithm
        </label>
        <select
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
          className="w-full border border-neutral-400 rounded-md px-3 py-2 text-sm font-poppins focus:outline-none focus:ring-2 focus:ring-green-700"
        >
          <option value="SCAN">SCAN</option>
          <option value="SSTF">SSTF</option>
          <option value="LOOK">LOOK</option>
          <option value="C-LOOK">C-LOOK</option>
        </select>
      </div>

      {/* Disk Request */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-black mb-1 font-poppins">
          Disk Request / Queue
        </label>
        <input
          type="text"
          value={requests}
          onChange={(e) => setRequests(e.target.value)}
          placeholder="e.g. 82 170 43 140 24 16 190"
          className="w-full border border-neutral-400 rounded-md px-3 py-2 text-sm font-poppins focus:outline-none focus:ring-2 focus:ring-green-700"
        />
      </div>

      {/* Initial Head Position */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-black mb-1 font-poppins">
          Initial Head Position
        </label>
        <input
          type="number"
          value={head}
          onChange={(e) => setHead(e.target.value)}
          placeholder="e.g. 50"
          className="w-full border border-neutral-400 rounded-md px-3 py-2 text-sm font-poppins focus:outline-none focus:ring-2 focus:ring-green-700"
        />
      </div>

      {/* Direction */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-black mb-1 font-poppins">
          Direction of Head Movement
        </label>
        <select
          value={direction}
          onChange={(e) => setDirection(e.target.value)}
          className="w-full border border-neutral-400 rounded-md px-3 py-2 text-sm font-poppins focus:outline-none focus:ring-2 focus:ring-green-700"
        >
          <option value="right">Right (towards the larger value)</option>
          <option value="left">Left (towards the smaller value)</option>
        </select>
      </div>

      {/* Disk Size */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-black mb-1 font-poppins">
          Disk Size (Max Track Number)
        </label>
        <input
          type="number"
          value={diskSize}
          onChange={(e) => setDiskSize(e.target.value)}
          placeholder="e.g. 199"
          className="w-full border border-neutral-400 rounded-md px-3 py-2 text-sm font-poppins focus:outline-none focus:ring-2 focus:ring-green-700"
        />
      </div>

      {/* Solve Button */}
      <button
        onClick={onSolve}
        className="w-[150px] bg-green-700 cursor-pointer hover:bg-green-800 text-white font-bold py-2 rounded-lg transition-colors font-poppins text-base"
      >
        SOLVE
      </button>
    </div>
  );
};

export default InputCard;
