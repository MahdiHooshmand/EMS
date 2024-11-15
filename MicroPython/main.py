from ble_services import AuthService, RunService
import asyncio
from Models import AndroidDevice
import machine


async def monitor_connection(connection):
    """
    Monitors the connection with a device and performs a soft reset if the connection is lost.

    This asynchronous function waits for the connection to be disconnected and then
    performs a soft reset of the machine. It's designed to handle unexpected
    disconnections and restart the system to maintain operational status.

    Parameters:
    connection (object): The connection object to monitor. It must have a 'disconnected'
                         method that can be awaited.

    Returns:
    None

    Note:
    This function does not return as it triggers a soft reset upon disconnection.
    """
    await connection.disconnected(timeout_ms=None)
    print("Connection lost, performing soft reset.")
    machine.soft_reset()


async def main():
    """
    Main asynchronous function that handles the authentication and command execution process.

    This function performs the following steps:
    1. Searches for a BLE connection
    2. Sets up a connection monitor
    3. Handles the authentication request
    4. Creates an AndroidDevice instance with the authenticated information
    5. Handles incoming commands from the authenticated device

    Parameters:
    None

    Returns:
    None

    Raises:
    Any exceptions raised by the called asynchronous functions.
    """
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
