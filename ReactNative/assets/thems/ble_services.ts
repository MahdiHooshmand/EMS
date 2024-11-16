/**
 * BLE service and characteristic UUIDs for authentication and run operations.
 * These constants are used to identify specific BLE services and characteristics
 * for communication between a client device and a BLE-enabled server.
 */

/** UUID for the authentication service */
export const AUTH_SERVICE_UUID = "1010";

/** UUID for the username characteristic within the authentication service */
export const USERNAME_CHARACTERISTIC_UUID = "1011";

/** UUID for the password characteristic within the authentication service */
export const PASSWORD_CHARACTERISTIC_UUID = "1012";

/** UUID for the token characteristic within the authentication service */
export const TOKEN_CHARACTERISTIC_UUID = "1013";

/** UUID for the response characteristic within the authentication service */
export const RESPONSE_CHARACTERISTIC_UUID = "1014";

/** UUID for the run service */
export const RUN_SERVICE_UUID = "1020";

/** UUID for the run characteristic within the run service */
export const RUN_CHARACTERISTIC_UUID = "1021";

/** UUID for the run response characteristic within the run service */
export const RUN_RESPONSE_CHARACTERISTIC_UUID = "1022";