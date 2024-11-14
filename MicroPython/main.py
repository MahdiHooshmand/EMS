from ble_services import AuthService, RunService
import asyncio
from Models import AndroidDevice
import machine


async def monitor_connection(connection):
    await connection.disconnected(timeout_ms=None)
    print("Connection lost, performing soft reset.")
    machine.soft_reset()


"""
This is the main function of the authentication service. It handles the authentication process for Android devices.

Parameters:
None

Returns:
None

The function performs the following steps:
1. Calls the `search_for_connection` function from the `Auth` module to establish a connection with an Android device.
2. Prints the MAC address of the connected device.
3. Calls the `handle_auth_request` function from the `Auth` module to handle the authentication request from the connected device.
4. Extracts the username, password, and token from the authentication response.
5. Constructs the MAC address of the connected device.
6. Creates an instance of the `AndroidDevice` class from the `Models` module with the extracted credentials.
7. Prints a success message indicating that the device has been authenticated.
8. Continuously checks the `is_connected` attribute of the `connection` object and sleeps for 1 second if the connection is still active.
"""


async def main():
    connection = await AuthService.search_for_connection()
    asyncio.create_task(monitor_connection(connection))
    print("Connection from", connection.device)
    username, password, token = await AuthService.handle_auth_request(connection)
    mac_address = ":".join(f"{byte:02x}" for byte in connection.device.addr)
    android_device = AndroidDevice(username, password, mac_address, token)
    print(mac_address, "authenticated successfully!")
    await RunService.handle_command(connection, android_device)


"""
This script is the entry point for the authentication service. It initializes the asyncio event loop, runs the main authentication process, and ensures that the loop is closed properly once the process is complete.

Parameters:
None

Returns:
None
"""
print("starting the authentication service... Press Ctrl+C to stop. \n")
loop = asyncio.get_event_loop()
loop.run_until_complete(main())
loop.close()
print("end")
