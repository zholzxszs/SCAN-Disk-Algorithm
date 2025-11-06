// InputCard.tsx - OPTIMIZED VERSION
import { useState, type Dispatch, type SetStateAction, useCallback } from "react";

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

/**
 * Input component for SCAN disk scheduling algorithm parameters
 * Optimized for performance with reduced animations and memoization
 */
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
  const [errors, setErrors] = useState({
    head: "",
    diskSize: "",
    requests: ""
  });

  /**
   * Main validation and solve handler
   */
  const handleSolve = () => {
    setErrors({ head: "", diskSize: "", requests: "" });

    let hasError = false;
    const newErrors = { head: "", diskSize: "", requests: "" };

    // Validate head position
    const headPos = parseInt(head);
    if (head === "") {
      newErrors.head = "This field is required";
      hasError = true;
    } else if (isNaN(headPos) || headPos < 0 || !Number.isInteger(headPos)) {
      newErrors.head = "Head position must be a non-negative integer";
      hasError = true;
    }

    // Validate disk size
    const diskSizeNum = parseInt(diskSize);
    if (diskSize === "") {
      newErrors.diskSize = "This field is required";
      hasError = true;
    } else if (isNaN(diskSizeNum) || diskSizeNum <= 0 || !Number.isInteger(diskSizeNum)) {
      newErrors.diskSize = "Disk size must be an integer greater than 0";
      hasError = true;
    }

    // Cross-validation
    if (!newErrors.head && !newErrors.diskSize && headPos > diskSizeNum) {
      newErrors.head = `Head position (${headPos}) cannot exceed disk size (${diskSizeNum})`;
      hasError = true;
    }

    // Validate requests
    if (requests.trim() !== "") {
      const numbers = requests.split(" ").filter(item => item !== "");
      
      const invalidRequests = numbers.filter(num => {
        const number = parseInt(num);
        return isNaN(number) || number < 0 || !Number.isInteger(number);
      });
      
      if (invalidRequests.length > 1) {
        newErrors.requests = "All requests must be integers ≥ 0";
        hasError = true;
      }

      if (!newErrors.diskSize && !newErrors.requests) {
        const exceedingRequests = numbers.filter(num => {
          const number = parseInt(num);
          return number > diskSizeNum;
        });
        
        if (exceedingRequests.length > 0) {
          newErrors.requests = `Requests cannot exceed disk size (${diskSizeNum}): ${exceedingRequests.join(", ")}`;
          hasError = true;
        }
      }
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    onSolve();
  };

  /**
   * Optimized input change handler with useCallback
   */
  const handleInputChange = useCallback((
    setter: Dispatch<SetStateAction<string>>, 
    field: keyof typeof errors
  ) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  }, [errors]);

  /**
   * Auto-generate test values
   */
  const generateRandomValues = () => {
    // Generate random disk size between 100–300
    const randomDiskSize = Math.floor(Math.random() * 201) + 100;
    setDiskSize(randomDiskSize.toString());

    // Generate random head position within disk range
    const randomHead = Math.floor(Math.random() * (randomDiskSize + 1));
    setHead(randomHead.toString());

    // Generate a *random number* of requests (between 4 and 10)
    const numberOfRequests = Math.floor(Math.random() * 7) + 4; // 4–10 requests
    const randomRequests: number[] = [];

    // Generate random unique requests within disk size
    while (randomRequests.length < numberOfRequests) {
      const randomRequest = Math.floor(Math.random() * (randomDiskSize + 1));
      if (!randomRequests.includes(randomRequest)) {
        randomRequests.push(randomRequest);
      }
    }

    setRequests(randomRequests.join(" "));
    setErrors({ head: "", diskSize: "", requests: "" });
  };

  return (
    <div className="relative w-full bg-white rounded-2xl shadow-sm p-4 sm:p-6 transition-shadow duration-200 border border-gray-100">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 font-poppins bg-gradient-to-r from-green-700 to-green-900 bg-clip-text">
          Input Parameters
        </h2>
      </div>

      {/* Algorithm display */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2 font-poppins">
          Algorithm
        </label>
        <div className="w-full border border-green-200 rounded-xl px-4 py-3 text-sm font-poppins bg-green-50 text-green-800 font-medium">
          SCAN (Elevator Algorithm)
        </div>
      </div>

      {/* Work Queue input */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2 font-poppins">
          Work Queue (separated by spaces)
        </label>
        <input
          type="text"
          value={requests}
          onChange={handleInputChange(setRequests, "requests")}
          placeholder="e.g. 82 170 43 140 24 16 190"
          className={`w-full border rounded-xl px-4 py-3 text-sm font-poppins focus:outline-none focus:ring-2 transition-colors duration-200 ${
            errors.requests 
              ? "border-red-400 focus:ring-red-100 focus:border-red-500" 
              : "border-green-200 focus:ring-green-100 focus:border-green-500"
          } bg-white`}
        />
        {errors.requests && (
          <p className="text-red-500 text-xs mt-2 font-poppins">{errors.requests}</p>
        )}
      </div>

      {/* Initial Head Position input */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2 font-poppins">
          Initial Head Position <span className="text-red-500 font-bold">*</span>
        </label>
        <input
          type="number"
          value={head}
          onChange={handleInputChange(setHead, "head")}
          placeholder="e.g. 50"
          min="0"
          step="1"
          className={`w-full border rounded-xl px-4 py-3 text-sm font-poppins focus:outline-none focus:ring-2 transition-colors duration-200 ${
            errors.head 
              ? "border-red-400 focus:ring-red-100 focus:border-red-500" 
              : "border-green-200 focus:ring-green-100 focus:border-green-500"
          } bg-white`}
        />
        {errors.head && (
          <p className="text-red-500 text-xs mt-2 font-poppins">{errors.head}</p>
        )}
      </div>

      {/* Direction selection */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2 font-poppins">
          Direction
        </label>
        <select
          value={direction}
          onChange={(e) => setDirection(e.target.value)}
          className="w-full border border-green-200 rounded-xl px-4 py-3 text-sm font-poppins focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-500 transition-colors duration-200 bg-white"
        >
          <option value="right">Right (towards the larger value)</option>
          <option value="left">Left (towards the smaller value)</option>
        </select>
      </div>

      {/* Disk Size input */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2 font-poppins">
          Disk Size (Max Track Number) <span className="text-red-500 font-bold">*</span>
        </label>
        <input
          type="number"
          value={diskSize}
          onChange={handleInputChange(setDiskSize, "diskSize")}
          placeholder="e.g. 199"
          min="1"
          step="1"
          className={`w-full border rounded-xl px-4 py-3 text-sm font-poppins focus:outline-none focus:ring-2 transition-colors duration-200 ${
            errors.diskSize 
              ? "border-red-400 focus:ring-red-100 focus:border-red-500" 
              : "border-green-200 focus:ring-green-100 focus:border-green-500"
          } bg-white`}
        />
        {errors.diskSize && (
          <p className="text-red-500 text-xs mt-2 font-poppins">{errors.diskSize}</p>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={generateRandomValues}
          className="flex-1 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white font-bold py-3 px-4 rounded-xl transition-colors duration-200 font-poppins text-sm sm:text-base flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          GENERATE
        </button>
        <button
          onClick={handleSolve}
          className="flex-1 bg-green-600 hover:bg-green-700 cursor-pointer text-white font-bold py-3 px-4 rounded-xl transition-colors duration-200 font-poppins text-sm sm:text-base flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          SOLVE
        </button>
      </div>
    </div>
  );
};

export default InputCard;