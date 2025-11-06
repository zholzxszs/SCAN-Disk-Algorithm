// InputCard.tsx
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

/**
 * Input component for SCAN disk scheduling algorithm parameters
 * Handles user input, validation, and provides auto-generation for testing
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
  // State for tracking validation errors per field
  const [errors, setErrors] = useState({
    head: "",
    diskSize: "",
    requests: ""
  });

  /**
   * Main validation and solve handler
   * Performs comprehensive input validation before executing the algorithm
   */
  const handleSolve = () => {
    // Reset all errors before validation
    setErrors({ head: "", diskSize: "", requests: "" });

    let hasError = false;
    const newErrors = { head: "", diskSize: "", requests: "" };

    // Validate head position - must be non-negative integer
    const headPos = parseInt(head);
    if (head === "") {
      newErrors.head = "This field is required";
      hasError = true;
    } else if (isNaN(headPos) || headPos < 0 || !Number.isInteger(headPos)) {
      newErrors.head = "Head position must be a non-negative integer";
      hasError = true;
    }

    // Validate disk size - must be positive integer
    const diskSizeNum = parseInt(diskSize);
    if (diskSize === "") {
      newErrors.diskSize = "This field is required";
      hasError = true;
    } else if (isNaN(diskSizeNum) || diskSizeNum <= 0 || !Number.isInteger(diskSizeNum)) {
      newErrors.diskSize = "Disk size must be an integer greater than 0";
      hasError = true;
    }

    // Cross-validation: head position cannot exceed disk size
    if (!newErrors.head && !newErrors.diskSize && headPos > diskSizeNum) {
      newErrors.head = `Head position (${headPos}) cannot exceed disk size (${diskSizeNum})`;
      hasError = true;
    }

    // Validate requests (optional field) - if provided, must be valid integers
    if (requests.trim() !== "") {
      const numbers = requests.split(" ").filter(item => item !== "");
      
      // Check all requests are valid integers ≥ 1
      const invalidRequests = numbers.filter(num => {
        const number = parseInt(num);
        return isNaN(number) || number < 0 || !Number.isInteger(number);
      });
      
      if (invalidRequests.length > 1) {
        newErrors.requests = "All requests must be integers ≥ 0";
        hasError = true;
      }

      // Check no requests exceed disk size boundaries
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

    // If validation failed, show errors and abort
    if (hasError) {
      setErrors(newErrors);
      return;
    }

    // All validations passed - execute the algorithm
    onSolve();
  };

  /**
   * Generic input change handler that clears field-specific errors
   * Provides immediate feedback by clearing errors when user starts correcting
   */
  const handleInputChange = (setter: Dispatch<SetStateAction<string>>, field: keyof typeof errors) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
    // Clear error for this specific field when user modifies it
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  /**
   * Auto-generates realistic test values for all input fields
   * Creates a complete, valid test case with one click
   */
  const generateRandomValues = () => {
    // Generate random disk size in realistic range (100-300)
    const randomDiskSize = Math.floor(Math.random() * 201) + 100; // 100-300
    setDiskSize(randomDiskSize.toString());
    
    // Generate random head position within disk boundaries
    const randomHead = Math.floor(Math.random() * (randomDiskSize + 1)); // 0 to disk size
    setHead(randomHead.toString());
    
    // Generate exactly 5 unique random requests within disk size
    const randomRequests: number[] = [];
    
    for (let i = 0; i < 5; i++) {
      const randomRequest = Math.floor(Math.random() * randomDiskSize) + 1;
      randomRequests.push(randomRequest);
    }
    
    // Ensure uniqueness - remove duplicates and maintain 5 requests
    let uniqueRequests = Array.from(new Set(randomRequests));
    
    // If duplicates were removed, generate additional unique requests
    while (uniqueRequests.length < 5) {
      const additionalRequest = Math.floor(Math.random() * randomDiskSize) + 1;
      if (!uniqueRequests.includes(additionalRequest)) {
        uniqueRequests.push(additionalRequest);
      }
    }
    
    setRequests(uniqueRequests.join(" "));
    
    // Clear any pre-existing errors since generated values are always valid
    setErrors({ head: "", diskSize: "", requests: "" });
  };

  return (
    <div className="relative w-full bg-white/95 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-lg p-4 sm:p-6 transform transition-all duration-300 border border-gray-100">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 font-poppins bg-gradient-to-r from-green-700 to-green-900 bg-clip-text">
          Input Parameters
        </h2>
      </div>

      {/* Algorithm display (read-only) */}
      <div className="mb-4 transform transition-all duration-200 hover:scale-[1.02]">
        <label className="block text-sm font-semibold text-gray-700 mb-2 font-poppins">
          Algorithm
        </label>
        <div className="w-full border-2 border-green-200 rounded-xl px-4 py-3 text-sm font-poppins bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 font-medium shadow-inner">
          SCAN (Elevator Algorithm)
        </div>
      </div>

      {/* Work Queue input - optional field for disk requests */}
      <div className="mb-4 transform transition-all duration-200 hover:scale-[1.02]">
        <label className="block text-sm font-semibold text-gray-700 mb-2 font-poppins">
          Work Queue (separated by spaces)
        </label>
        <input
          type="text"
          value={requests}
          onChange={handleInputChange(setRequests, "requests")}
          placeholder="e.g. 82 170 43 140 24 16 190"
          className={`w-full border-2 rounded-xl px-4 py-3 text-sm font-poppins focus:outline-none focus:ring-4 transition-all duration-200 ${
            errors.requests 
              ? "border-red-400 focus:ring-red-200 focus:border-red-500" 
              : "border-green-200 focus:ring-green-200 focus:border-green-500"
          } bg-white/80 backdrop-blur-sm`}
        />
        {errors.requests && (
          <p className="text-red-500 text-xs mt-2 font-poppins animate-pulse">{errors.requests}</p>
        )}
      </div>

      {/* Initial Head Position input - required field */}
      <div className="mb-4 transform transition-all duration-200 hover:scale-[1.02]">
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
          className={`w-full border-2 rounded-xl px-4 py-3 text-sm font-poppins focus:outline-none focus:ring-4 transition-all duration-200 ${
            errors.head 
              ? "border-red-400 focus:ring-red-200 focus:border-red-500" 
              : "border-green-200 focus:ring-green-200 focus:border-green-500"
          } bg-white/80 backdrop-blur-sm`}
        />
        {errors.head && (
          <p className="text-red-500 text-xs mt-2 font-poppins animate-pulse">{errors.head}</p>
        )}
      </div>

      {/* Direction selection - determines initial head movement direction */}
      <div className="mb-4 transform transition-all duration-200 hover:scale-[1.02]">
        <label className="block text-sm font-semibold text-gray-700 mb-2 font-poppins">
          Direction
        </label>
        <select
          value={direction}
          onChange={(e) => setDirection(e.target.value)}
          className="w-full border-2 border-green-200 rounded-xl px-4 py-3 text-sm font-poppins focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
        >
          <option value="right">Right (towards the larger value)</option>
          <option value="left">Left (towards the smaller value)</option>
        </select>
      </div>

      {/* Disk Size input - required field defining disk boundaries */}
      <div className="mb-6 transform transition-all duration-200 hover:scale-[1.02]">
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
          className={`w-full border-2 rounded-xl px-4 py-3 text-sm font-poppins focus:outline-none focus:ring-4 transition-all duration-200 ${
            errors.diskSize 
              ? "border-red-400 focus:ring-red-200 focus:border-red-500" 
              : "border-green-200 focus:ring-green-200 focus:border-green-500"
          } bg-white/80 backdrop-blur-sm`}
        />
        {errors.diskSize && (
          <p className="text-red-500 text-xs mt-2 font-poppins animate-pulse">{errors.diskSize}</p>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={generateRandomValues}
          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 cursor-pointer hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-poppins text-sm sm:text-base flex items-center justify-center gap-2 group"
        >
          <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          GENERATE
        </button>
        <button
          onClick={handleSolve}
          className="flex-1 bg-gradient-to-r from-green-600 to-green-700 cursor-pointer hover:from-green-700 hover:to-green-800 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-poppins text-sm sm:text-base flex items-center justify-center gap-2 group"
        >
          <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          SOLVE
        </button>
      </div>
    </div>
  );
};

export default InputCard;