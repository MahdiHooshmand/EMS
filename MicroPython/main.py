import Auth
import asyncio

connection = asyncio.run(Auth.search_for_connection())

print("Connection from", connection.device)

while True:
    pass
