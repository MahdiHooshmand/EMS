/**
 * Configuration constants for Bluetooth Low Energy (BLE) scanning.
 */

/**
 * The duration of the BLE scan in seconds.
 */
export const SECONDS_TO_SCAN_FOR = 5;

/**
 * An array of service UUIDs to filter BLE devices during scanning.
 * An empty array means no filtering will be applied.
 */
export const SERVICE_UUIDS: any[] = [];

/**
 * Determines whether duplicate advertisements from BLE devices should be reported during scanning.
 * When set to true, multiple advertisements from the same device will be reported.
 */
export const ALLOW_DUPLICATES = true;
