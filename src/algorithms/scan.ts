export type ScanDirection = "right" | "left";

export interface ScanOutput {
  seekSequence: number[];
  totalOverheadMovement: number;
  stepsExpression: string;
  stepsValues: string;
  stepsDetailed: string;
}

/**
 * Computes the SCAN (Elevator) disk scheduling algorithm
 * 
 * SCAN Algorithm Overview:
 * - The disk arm starts at the initial head position and moves in one direction (left or right)
 * - It services all requests in that direction until it reaches the end of the disk
 * - Then it reverses direction and services requests in the opposite direction
 * - This creates an "elevator-like" movement pattern
 * 
 * @param requests - Array of disk track numbers to be serviced (must be integers ≥ 1)
 * @param headPos - Initial position of the disk read/write head (non-negative integer)
 * @param direction - Initial direction of head movement ("right" or "left")
 * @param maxCylinder - Maximum track number on the disk (disk size - 1)
 * 
 * @returns ScanOutput object containing:
 *   - seekSequence: Array of tracks visited in order
 *   - totalOverheadMovement: Total distance traveled by disk head
 *   - stepsExpression: Mathematical expression showing each seek operation
 *   - stepsValues: Numerical values of each seek distance
 *   - stepsDetailed: Detailed breakdown of each calculation
 */
export function computeSCAN(
  requests: number[],
  headPos: number,
  direction: ScanDirection,
  maxCylinder: number
): ScanOutput {
  // Arrays to hold requests on left and right side of initial head position
  const left: number[] = [];  // Tracks less than headPos
  const right: number[] = []; // Tracks greater than headPos
  const visited: number[] = []; // Tracks visited during seek (excluding initial head)
  
  // Array to track each movement step with from, to, and distance
  const stepsTriples: Array<{ from: number; to: number; dist: number }> = [];

  // Phase 1: Categorize requests into left and right arrays
  // Note: Requests equal to headPos are ignored since they're already at the head
  for (const track of requests) {
    if (track < headPos) {
      left.push(track);    // Add to left array if track is less than head position
    } else if (track > headPos) {
      right.push(track);   // Add to right array if track is greater than head position
    }
    // If track === headPos, it's already serviced so we skip it
  }

  // Phase 2: Sort the request arrays for optimal seek order
  // Left array sorted in descending order (largest to smallest) for efficient left movement
  left.sort((a, b) => b - a);
  // Right array sorted in ascending order (smallest to largest) for efficient right movement  
  right.sort((a, b) => a - b);

  // Initialize tracking variables
  let currentPosition = headPos; // Start at initial head position
  let totalOverheadMovement = 0;         // Accumulator for total seek distance

  // Phase 3: Execute SCAN algorithm based on initial direction
  if (direction === "right") {
    // Step 3.1: Service all requests to the RIGHT of initial head position
    for (const track of right) {
      const seekDistance = Math.abs(currentPosition - track);
      totalOverheadMovement += seekDistance;
      
      // Record this movement step
      stepsTriples.push({ 
        from: currentPosition, 
        to: track, 
        dist: seekDistance 
      });
      
      visited.push(track);           // Add to visited sequence
      currentPosition = track;       // Update current position
    }

    // Step 3.2: Move to the END OF DISK if not already there
    // This is the "seek to boundary" characteristic of SCAN
    if (currentPosition !== maxCylinder) {
      const seekDistance = Math.abs(currentPosition - maxCylinder);
      totalOverheadMovement += seekDistance;
      
      stepsTriples.push({ 
        from: currentPosition, 
        to: maxCylinder, 
        dist: seekDistance 
      });
      
      visited.push(maxCylinder);     // Add disk end to visited sequence
      currentPosition = maxCylinder; // Update to disk end position
    }

    // Step 3.3: Reverse direction and service all LEFT requests
    for (const track of left) {
      const seekDistance = Math.abs(currentPosition - track);
      totalOverheadMovement += seekDistance;
      
      stepsTriples.push({ 
        from: currentPosition, 
        to: track, 
        dist: seekDistance 
      });
      
      visited.push(track);           // Add to visited sequence
      currentPosition = track;       // Update current position
    }
  } else {
    // direction === "left" - Same logic but in opposite direction

    // Step 3.1: Service all requests to the LEFT of initial head position
    for (const track of left) {
      const seekDistance = Math.abs(currentPosition - track);
      totalOverheadMovement += seekDistance;
      
      stepsTriples.push({ 
        from: currentPosition, 
        to: track, 
        dist: seekDistance 
      });
      
      visited.push(track);
      currentPosition = track;
    }

    // Step 3.2: Move to the BEGINNING OF DISK (track 0) if not already there
    if (currentPosition !== 0) {
      const seekDistance = Math.abs(currentPosition - 0);
      totalOverheadMovement += seekDistance;
      
      stepsTriples.push({ 
        from: currentPosition, 
        to: 0, 
        dist: seekDistance 
      });
      
      visited.push(0);               // Add disk start to visited sequence
      currentPosition = 0;           // Update to disk start position
    }

    // Step 3.3: Reverse direction and service all RIGHT requests
    for (const track of right) {
      const seekDistance = Math.abs(currentPosition - track);
      totalOverheadMovement += seekDistance;
      
      stepsTriples.push({ 
        from: currentPosition, 
        to: track, 
        dist: seekDistance 
      });
      
      visited.push(track);
      currentPosition = track;
    }
  }

  // Phase 4: Format the output with detailed step information
  const exprParts: string[] = [];    // Mathematical expressions: (large - small)
  const valueParts: string[] = [];   // Numerical values only
  const detailedParts: string[] = []; // Complete calculations: (large - small) = value

  // Process each movement step to create different output formats
  for (const { from, to, dist } of stepsTriples) {
    const large = Math.max(from, to);  // Larger track number
    const small = Math.min(from, to);  // Smaller track number
    
    exprParts.push(`(${large} - ${small})`);           // (199 - 170)
    valueParts.push(`${dist}`);                        // 29
    detailedParts.push(`(${large} - ${small}) = ${dist}`); // (199 - 170) = 29
  }

  // Construct final output object
  const output: ScanOutput = {
    seekSequence: [headPos, ...visited],              // Full path including start position
    totalOverheadMovement,                                    // Sum of all seek distances
    stepsExpression: exprParts.join(" + "),           // " (82-50) + (170-82) + ... "
    stepsValues: valueParts.join(" + "),              // "32 + 88 + ..."
    stepsDetailed: detailedParts.join(" + "),         // "(82-50)=32 + (170-82)=88 + ..."
  };

  return output;
}