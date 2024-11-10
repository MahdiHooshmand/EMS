import Auth
import asyncio
from Models import AndroidDevice


async def main():
    connection = await Auth.search_for_connection()
    print("Connection from", connection.device)
    username, password, token = await Auth.handle_auth_request(connection)
    mac_address = ":".join(f"{byte:02x}" for byte in connection.device.addr)
    AndroidDevice(username, password, mac_address, token)
    print(mac_address, "authenticated successfully!")

    while connection.is_connected:
        await asyncio.sleep(1)


print("starting the authentication service... Press Ctrl+C to stop. \n")
loop = asyncio.get_event_loop()
loop.run_until_complete(main())
loop.close()
print("end")
