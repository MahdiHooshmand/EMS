import aioble
from assets.ble_services import (
    RUN_COMMAND,
    RUN_RESPONSE,
    RUN_SERVICE,
)
import struct


async def init_run_service():
    # Create the service with the characteristics for command and response
    run = aioble.Service(RUN_SERVICE)
    command = aioble.Characteristic(
        run,
        RUN_COMMAND,
        read=True,
        write=True,
        notify=True,
        capture=True,
        initial=struct.pack("<h", 0),
    )
    response = aioble.Characteristic(
        run,
        RUN_RESPONSE,
        read=True,
        write=False,
        notify=True,
        capture=True,
        initial=struct.pack("<h", 0),
    )
