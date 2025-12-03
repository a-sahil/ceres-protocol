// src/lib/utils.ts

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts a Hedera Account ID (e.g., "0.0.12345") to its EVM-compatible "long-zero" address,
 * or validates an existing EVM address.
 * @param address The Hedera Account ID string or an EVM address string.
 * @returns The 0x-prefixed 20-byte EVM address string.
 * @throws An error if the address format is invalid.
 */
export function hederaAccountIdToEvmAddress(address: string): `0x${string}` {
  if (!address || typeof address !== 'string') {
    throw new Error(`Invalid address input: received ${typeof address}`);
  }

  // 1. Check if it's already a valid EVM address format
  if (/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return address as `0x${string}`;
  }

  // 2. Check if it's a valid Hedera "0.0.X" format and convert it
  if (/^0\.0\.\d+$/.test(address)) {
    try {
      const parts = address.split('.');
      const num = parseInt(parts[2], 10);
      const hex = num.toString(16);
      // Pad with leading zeros to make it 40 hex characters (20 bytes)
      return `0x${'0'.repeat(40 - hex.length)}${hex}`;
    } catch (e) {
      console.error("Error while parsing Hedera Account ID:", e);
      throw new Error("Could not parse the Hedera Account ID number.");
    }
  }

  // 3. If it's neither, throw a specific error
  throw new Error(`Invalid address format: "${address}". Address must be a Hedera "0.0.X" ID or a standard EVM address.`);
}