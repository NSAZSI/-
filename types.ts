export interface SimulationStep {
  lineNo: number; // The line number in the Python code to highlight
  variables: {
    pre: number;
    count: number;
    target: number | null;
    currentNum: number | null;
    currentIndex: number;
  };
  mapState: Record<number, number>; // Snapshot of the map
  description: string; // Chinese commentary
  highlightMapKey?: number; // If we are looking up or updating a specific key
  foundMatch?: boolean; // Did we find a match in this step?
}

export interface AlgorithmConfig {
  nums: number[];
  k: number;
}