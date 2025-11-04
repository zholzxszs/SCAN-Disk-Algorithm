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
  const [errors, setErrors] = useState({
    head: "",
    diskSize: "",
    requests: ""
  });

  const handleSolve = () => {
    // Reset errors
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

    // Validate head position doesn't exceed disk size (only if both are valid)
    if (!newErrors.head && !newErrors.diskSize && headPos > diskSizeNum) {
      newErrors.head = `Head position (${headPos}) cannot exceed disk size (${diskSizeNum})`;
      hasError = true;
    }

    // Validate requests (if any)
    if (requests.trim() !== "") {
      const numbers = requests.split(" ").filter(item => item !== "");
      
      // Check if all requests are valid integers ≥ 1
      const invalidRequests = numbers.filter(num => {
        const number = parseInt(num);
        return isNaN(number) || number < 1 || !Number.isInteger(number);
      });
      
      if (invalidRequests.length > 0) {
        newErrors.requests = "All requests must be integers ≥ 1";
        hasError = true;
      }

      // Check if any request exceeds disk size (only if disk size is valid)
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

    // If all validations pass, call onSolve
    onSolve();
  };

  // Function to handle input changes and clear errors for that field
  const handleInputChange = (setter: Dispatch<SetStateAction<string>>, field: keyof typeof errors) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  // Function to auto-generate head position, disk size, and 5 random requests
  const generateRandomValues = () => {
    // Generate random disk size between 100 and 300
    const randomDiskSize = Math.floor(Math.random() * 201) + 100; // 100-300
    setDiskSize(randomDiskSize.toString());
    
    // Generate random head position between 0 and disk size
    const randomHead = Math.floor(Math.random() * (randomDiskSize + 1)); // 0 to disk size
    setHead(randomHead.toString());
    
    // Generate exactly 5 random requests between 1 and disk size
    const randomRequests: number[] = [];
    
    for (let i = 0; i < 5; i++) {
      // Generate random number between 1 and disk size
      const randomRequest = Math.floor(Math.random() * randomDiskSize) + 1;
      randomRequests.push(randomRequest);
    }
    
    // Remove duplicates and ensure we have exactly 5 unique numbers
    let uniqueRequests = Array.from(new Set(randomRequests));
    
    // If we have less than 5 due to duplicates, generate more until we have 5
    while (uniqueRequests.length < 5) {
      const additionalRequest = Math.floor(Math.random() * randomDiskSize) + 1;
      if (!uniqueRequests.includes(additionalRequest)) {
        uniqueRequests.push(additionalRequest);
      }
    }
    
    setRequests(uniqueRequests.join(" "));
    
    // Clear any existing errors
    setErrors({ head: "", diskSize: "", requests: "" });
  };

  return (
    <div className="relative max-w-[370px] bg-white shadow-[4px_4px_10px_0px_rgba(0,0,0,0.25)] rounded-[10px] p-6">
      {/* Header */}
      <h2 className="text-2xl font-bold text-black mb-6 font-poppins">Input</h2>

      {/* Algorithm */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-black mb-1 font-poppins">
          Algorithm
        </label>
        <div className="w-full border border-neutral-400 rounded-md px-3 py-2 text-sm font-poppins bg-neutral-100 text-neutral-600">
          SCAN
        </div>
      </div>

      {/* Disk Request */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-black mb-1 font-poppins">
          Work Queue (separated by spaces)
        </label>
        <input
          type="text"
          value={requests}
          onChange={handleInputChange(setRequests, "requests")}
          placeholder="e.g. 82 170 43 140 24 16 190"
          className={`w-full border rounded-md px-3 py-2 text-sm font-poppins focus:outline-none focus:ring-2 ${
            errors.requests 
              ? "border-red-500 focus:ring-red-500" 
              : "border-neutral-400 focus:ring-green-700"
          }`}
        />
        {errors.requests && (
          <p className="text-red-500 text-xs mt-1 font-poppins">{errors.requests}</p>
        )}
      </div>

      {/* Initial Head Position */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-black mb-1 font-poppins">
          Initial Head Position <span className="text-red-500 font-bold">*</span>
        </label>
        <input
          type="number"
          value={head}
          onChange={handleInputChange(setHead, "head")}
          placeholder="e.g. 50"
          min="0"
          step="1"
          className={`w-full border rounded-md px-3 py-2 text-sm font-poppins focus:outline-none focus:ring-2 ${
            errors.head 
              ? "border-red-500 focus:ring-red-500" 
              : "border-neutral-400 focus:ring-green-700"
          }`}
        />
        {errors.head && (
          <p className="text-red-500 text-xs mt-1 font-poppins">{errors.head}</p>
        )}
      </div>

      {/* Direction */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-black mb-1 font-poppins">
          Direction
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
          Disk Size (Max Track Number) <span className="text-red-500 font-bold">*</span>
        </label>
        <input
          type="number"
          value={diskSize}
          onChange={handleInputChange(setDiskSize, "diskSize")}
          placeholder="e.g. 199"
          min="1"
          step="1"
          className={`w-full border rounded-md px-3 py-2 text-sm font-poppins focus:outline-none focus:ring-2 ${
            errors.diskSize 
              ? "border-red-500 focus:ring-red-500" 
              : "border-neutral-400 focus:ring-green-700"
          }`}
        />
        {errors.diskSize && (
          <p className="text-red-500 text-xs mt-1 font-poppins">{errors.diskSize}</p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={generateRandomValues}
          className="flex-1 bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition-colors font-poppins text-base"
        >
          AUTO GENERATE
        </button>
        <button
          onClick={handleSolve}
          className="flex-1 bg-green-700 cursor-pointer hover:bg-green-800 text-white font-bold py-2 rounded-lg transition-colors font-poppins text-base"
        >
          SOLVE
        </button>
      </div>
    </div>
  );
};

export default InputCard;