export interface Clip {
  id: string;
  start_sec: number;
  end_sec: number;
  caption?: string;
  aspect?: string; // e.g., '9:16'
}

