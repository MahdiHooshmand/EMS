import sys

sys.path.append("")

from micropython import const

import asyncio
import aioble

from assets.blutooth_const import (
    ENV_SERVICE,
    ADV_INTERVAL_MS,
    bluetooth_name,
)
from assets.ble_services import (
    AUTH_SERVICE,
)

# Human Interface Device
_GENERIC_VALUE = const(960)

auth = aioble.Service(AUTH_SERVICE)
# username = aioble.Characteristic(
#     auth,
#     AUTH_USERNAME,
#     read=False,
#     write=True,
#     notify=True,
#     capture=True,
#     initial=struct.pack("<h", 0),
# )
# password = aioble.Characteristic(
#     auth,
#     AUTH_PASSWORD,
#     read=False,
#     write=True,
#     notify=True,
#     capture=True,
#     initial=struct.pack("<h", 0),
# )
# token = aioble.Characteristic(
#     auth,
#     AUTH_TOKEN,
#     read=True,
#     write=False,
#     notify=True,
#     capture=True,
#     initial=struct.pack("<h", 0),
# )
# response = aioble.Characteristic(
#     auth,
#     AUTH_RESPONSE,
#     read=True,
#     write=True,
#     notify=True,
#     capture=True,
#     initial=struct.pack("<h", 0),
# )
# aioble.register_services(auth)


# async def peripheral_task():
#     """
#     Continuously advertise the device as a Bluetooth peripheral and handle connections.
#
#     This asynchronous function sets up the device as a Bluetooth Low Energy (BLE) peripheral,
#     advertising its presence to nearby devices. When a connection is established, it prints
#     the connected device's information and waits for the connection to be terminated.
#
#     The function runs in an infinite loop, restarting the advertisement process after each
#     disconnection.
#
#     Parameters:
#     None
#
#     Returns:
#     None
#
#     Note:
#     - The function uses global variables ADV_INTERVAL_MS, bluetooth_name, ENV_SERVICE,
#       and _GENERIC_VALUE for advertisement configuration.
#     - This function is designed to run indefinitely and should be called as part of
#       an asyncio event loop.
#     """
#     while True:
#         async with await aioble.advertise(
#             ADV_INTERVAL_MS,
#             name=bluetooth_name,
#             services=[ENV_SERVICE],
#             appearance=_GENERIC_VALUE,
#         ) as connection:
#             print("Connection from", connection.device)
#             auth_task = asyncio.create_task()
#             await asyncio.gather(auth_task)
#             await connection.disconnected(timeout_ms=None)


async def search_for_connection():
    return await asyncio.gather(
        asyncio.create_task(
            aioble.advertise(
                ADV_INTERVAL_MS,
                name=bluetooth_name,
                services=[ENV_SERVICE],
                appearance=_GENERIC_VALUE,
            )
        )
    )
