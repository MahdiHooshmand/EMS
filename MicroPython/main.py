import Auth
import asyncio

from Auth import username, password
from Models import AndroidDevice


async def main():
    connection = await Auth.search_for_connection()
    print("Connection from", connection.device)
    username, password, token = await Auth.handle_auth_request(connection)
    AndroidDevice(username, password, connection.device, token)
    while connection.is_connected:
        await asyncio.sleep(1)


print("starting the authentication service... Press Ctrl+C to stop. \n")
loop = asyncio.get_event_loop()
loop.run_until_complete(main())
loop.close()
print("end")
