import type { CalibrationMemory } from "@/core";
import { createEmptyMemory } from "@/core";

const STORAGE_KEY = "trajectory-drift:calibration-memory";

export function loadCalibrationMemory(): CalibrationMemory {
  if (typeof window === "undefined") return createEmptyMemory();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createEmptyMemory();
    return JSON.parse(raw) as CalibrationMemory;
  } catch {
    return createEmptyMemory();
  }
}

export function saveCalibrationMemory(memory: CalibrationMemory): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memory));
  } catch {
    // quota or privacy mode — ignore
  }
}
