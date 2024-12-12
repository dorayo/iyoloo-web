import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function createUpdateData<T extends Record<string, unknown>>(input: Partial<T>): Partial<T> {
  return Object.fromEntries(
    Object.entries(input).filter(([_, value]) => value !== undefined)
  ) as Partial<T>;
}