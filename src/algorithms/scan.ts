export type ScanDirection = "right" | "left";

export interface ScanOutput {
  seekSequence: number[];
  totalSeekTime: number;
  stepsExpression: string;
  stepsValues: string;
  stepsDetailed: string;
}

export function computeSCAN(
  requests: number[],
  headPos: number,
  direction: ScanDirection,
  maxCylinder: number
): ScanOutput {
  console.log("=== SCAN DEBUG START ===");
  console.log("Input Requests:", requests);
  console.log("Initial Head Position:", headPos);
  console.log("Initial Direction:", direction);
  console.log("Max Cylinder:", maxCylinder);
  console.log("----------------------------");

  const left: number[] = [];
  const right: number[] = [];
  const visited: number[] = [];
  const stepsTriples: Array<{ from: number; to: number; dist: number }> = [];

  // Sort requests into left and right arrays
  for (const track of requests) {
    if (track < headPos) {
      left.push(track);
    } else if (track > headPos) {
      right.push(track);
    }
  }

  // Sort left in descending and right in ascending order
  left.sort((a, b) => b - a);  // Descending for left movement
  right.sort((a, b) => a - b); // Ascending for right movement

  console.log("Left Requests (descending):", left);
  console.log("Right Requests (ascending):", right);
  console.log("----------------------------");

  let currentPosition = headPos;
  let totalSeekTime = 0;

  if (direction === "right") {
    console.log("Moving RIGHT first...");

    // Move right first
    for (const track of right) {
      const seekDistance = Math.abs(currentPosition - track);
      console.log(`Move from ${currentPosition} → ${track} | Distance: ${seekDistance}`);
      totalSeekTime += seekDistance;
      stepsTriples.push({ from: currentPosition, to: track, dist: seekDistance });
      visited.push(track);
      currentPosition = track;
    }

    // Move to the end of disk
    if (currentPosition !== maxCylinder) {
      const seekDistance = Math.abs(currentPosition - maxCylinder);
      console.log(`Move to disk end ${maxCylinder} | Distance: ${seekDistance}`);
      totalSeekTime += seekDistance;
      stepsTriples.push({ from: currentPosition, to: maxCylinder, dist: seekDistance });
      visited.push(maxCylinder);
      currentPosition = maxCylinder;
    }

    // Then move left
    console.log("Reversing to LEFT...");
    for (const track of left) {
      const seekDistance = Math.abs(currentPosition - track);
      console.log(`Move from ${currentPosition} → ${track} | Distance: ${seekDistance}`);
      totalSeekTime += seekDistance;
      stepsTriples.push({ from: currentPosition, to: track, dist: seekDistance });
      visited.push(track);
      currentPosition = track;
    }
  } else {
    console.log("Moving LEFT first...");

    // Move left first
    for (const track of left) {
      const seekDistance = Math.abs(currentPosition - track);
      console.log(`Move from ${currentPosition} → ${track} | Distance: ${seekDistance}`);
      totalSeekTime += seekDistance;
      stepsTriples.push({ from: currentPosition, to: track, dist: seekDistance });
      visited.push(track);
      currentPosition = track;
    }

    // Move to the beginning of disk
    if (currentPosition !== 0) {
      const seekDistance = Math.abs(currentPosition - 0);
      console.log(`Move to disk start 0 | Distance: ${seekDistance}`);
      totalSeekTime += seekDistance;
      stepsTriples.push({ from: currentPosition, to: 0, dist: seekDistance });
      visited.push(0);
      currentPosition = 0;
    }

    // Then move right
    console.log("Reversing to RIGHT...");
    for (const track of right) {
      const seekDistance = Math.abs(currentPosition - track);
      console.log(`Move from ${currentPosition} → ${track} | Distance: ${seekDistance}`);
      totalSeekTime += seekDistance;
      stepsTriples.push({ from: currentPosition, to: track, dist: seekDistance });
      visited.push(track);
      currentPosition = track;
    }
  }

  // Build step strings
  const exprParts: string[] = [];
  const valueParts: string[] = [];
  const detailedParts: string[] = [];

  for (const { from, to, dist } of stepsTriples) {
    const large = Math.max(from, to);
    const small = Math.min(from, to);
    exprParts.push(`(${large} - ${small})`);
    valueParts.push(`${dist}`);
    detailedParts.push(`(${large} - ${small}) = ${dist}`);
  }

  const output: ScanOutput = {
    seekSequence: [headPos, ...visited],
    totalSeekTime,
    stepsExpression: exprParts.join(" + "),
    stepsValues: valueParts.join(" + "),
    stepsDetailed: detailedParts.join(" + "),
  };

  console.log("----------------------------");
  console.log("Final Seek Sequence:", output.seekSequence);
  console.log("Total Seek Time:", totalSeekTime);
  console.log("Steps Expression:", output.stepsExpression);
  console.log("Steps Values:", output.stepsValues);
  console.log("Steps Detailed:", output.stepsDetailed);
  console.log("=== SCAN DEBUG END ===\n");

  return output;
}
