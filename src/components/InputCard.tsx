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
    requests: "",
    head: "",
    diskSize: ""
  });

  const validateRequests = (value: string, currentDiskSize: string = diskSize) => {
    if (value.trim() === "") {
      setErrors(prev => ({ ...prev, requests: "" }));
      return true;
    }
    
    const numbers = value.split(" ").filter(item => item !== "");
    const diskSizeNum = parseInt(currentDiskSize);
    
    const hasInvalid = numbers.some(num => {
      const number = parseInt(num);
      return isNaN(number) || number < 1 || !Number.isInteger(number);
    });
    
    if (hasInvalid) {
      setErrors(prev => ({ ...prev, requests: "Requests must be integers ≥ 1 or empty" }));
      return false;
    }
    
    // Check if any request exceeds disk size
    const exceedsDiskSize = numbers.some(num => {
      const number = parseInt(num);
      return number > diskSizeNum;
    });
    
    if (exceedsDiskSize && !isNaN(diskSizeNum)) {
      setErrors(prev => ({ ...prev, requests: `Requests cannot exceed disk size (${diskSizeNum})` }));
      return false;
    }
    
    setErrors(prev => ({ ...prev, requests: "" }));
    return true;
  };

  const validateHead = (value: string, currentDiskSize: string = diskSize) => {
    const number = parseInt(value);
    const diskSizeNum = parseInt(currentDiskSize);
    
    if (value === "" || isNaN(number) || number < 0 || !Number.isInteger(number)) {
      setErrors(prev => ({ ...prev, head: "Head position must be a non-negative integer" }));
      return false;
    }
    
    // Check if head position exceeds disk size
    if (!isNaN(diskSizeNum) && number > diskSizeNum) {
      setErrors(prev => ({ ...prev, head: `Head position cannot exceed disk size (${diskSizeNum})` }));
      return false;
    }
    
    setErrors(prev => ({ ...prev, head: "" }));
    return true;
  };

  const validateDiskSize = (value: string) => {
    const number = parseInt(value);
    if (value === "" || isNaN(number) || number <= 0 || !Number.isInteger(number)) {
      setErrors(prev => ({ ...prev, diskSize: "Disk size must be an integer greater than 0" }));
      return false;
    }
    
    // When disk size changes, revalidate requests and head against new disk size
    if (requests) {
      validateRequests(requests, value);
    }
    if (head) {
      validateHead(head, value);
    }
    
    setErrors(prev => ({ ...prev, diskSize: "" }));
    return true;
  };

  const handleRequestsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRequests(value);
    validateRequests(value);
  };

  const handleHeadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setHead(value);
    validateHead(value);
  };

  const handleDiskSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDiskSize(value);
    validateDiskSize(value);
  };

  const handleSolve = () => {
    const isRequestsValid = validateRequests(requests);
    const isHeadValid = validateHead(head);
    const isDiskSizeValid = validateDiskSize(diskSize);

    if (isRequestsValid && isHeadValid && isDiskSizeValid) {
      onSolve();
    }
  };

  const isSolveDisabled = () => {
    return errors.requests !== "" || errors.head !== "" || errors.diskSize !== "" || 
           head === "" || diskSize === "";
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
          Disk Request / Queue (separated by spaces)
        </label>
        <input
          type="text"
          value={requests}
          onChange={handleRequestsChange}
          placeholder="e.g. 82 170 43 140 24 16 190"
          className={`w-full border rounded-md px-3 py-2 text-sm font-poppins focus:outline-none focus:ring-2 focus:ring-green-700 ${
            errors.requests ? "border-red-500" : "border-neutral-400"
          }`}
        />
        {errors.requests && (
          <p className="text-red-500 text-xs mt-1 font-poppins">{errors.requests}</p>
        )}
      </div>

      {/* Initial Head Position */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-black mb-1 font-poppins">
          Initial Head Position
        </label>
        <input
          type="number"
          value={head}
          onChange={handleHeadChange}
          placeholder="e.g. 50"
          min="0"
          step="1"
          className={`w-full border rounded-md px-3 py-2 text-sm font-poppins focus:outline-none focus:ring-2 focus:ring-green-700 ${
            errors.head ? "border-red-500" : "border-neutral-400"
          }`}
        />
        {errors.head && (
          <p className="text-red-500 text-xs mt-1 font-poppins">{errors.head}</p>
        )}
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
          onChange={handleDiskSizeChange}
          placeholder="e.g. 199"
          min="1"
          step="1"
          className={`w-full border rounded-md px-3 py-2 text-sm font-poppins focus:outline-none focus:ring-2 focus:ring-green-700 ${
            errors.diskSize ? "border-red-500" : "border-neutral-400"
          }`}
        />
        {errors.diskSize && (
          <p className="text-red-500 text-xs mt-1 font-poppins">{errors.diskSize}</p>
        )}
      </div>

      {/* Solve Button */}
      <button
        onClick={handleSolve}
        disabled={isSolveDisabled()}
        className={`w-[150px] font-bold py-2 rounded-lg transition-colors font-poppins text-base ${
          isSolveDisabled() 
            ? "bg-gray-400 cursor-not-allowed text-gray-200" 
            : "bg-green-700 cursor-pointer hover:bg-green-800 text-white"
        }`}
      >
        SOLVE
      </button>
    </div>
  );
};

export default InputCard;