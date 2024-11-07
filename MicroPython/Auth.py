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

# Human Interface Device
_GENERIC_VALUE = const(960)
auth_service = aioble.Service(ENV_SERVICE)


async def peripheral_task():
    """
    Continuously advertise the device as a Bluetooth peripheral and handle connections.

    This asynchronous function sets up the device as a Bluetooth Low Energy (BLE) peripheral,
    advertising its presence to nearby devices. When a connection is established, it prints
    the connected device's information and waits for the connection to be terminated.

    The function runs in an infinite loop, restarting the advertisement process after each
    disconnection.

    Parameters:
    None

    Returns:
    None

    Note:
    - The function uses global variables ADV_INTERVAL_MS, bluetooth_name, ENV_SERVICE,
      and _GENERIC_VALUE for advertisement configuration.
    - This function is designed to run indefinitely and should be called as part of
      an asyncio event loop.
    """
    while True:
        async with await aioble.advertise(
            ADV_INTERVAL_MS,
            name=bluetooth_name,
            services=[ENV_SERVICE],
            appearance=_GENERIC_VALUE,
        ) as connection:
            print("Connection from", connection.device)
            await connection.disconnected(timeout_ms=None)


async def auth():
    await asyncio.gather(asyncio.create_task(peripheral_task()))
