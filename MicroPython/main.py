import Auth
import asyncio

connection = asyncio.run(Auth.search_for_connection())

print("Connection from", connection)

while True:
    pass
