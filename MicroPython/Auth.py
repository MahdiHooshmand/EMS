import sys

from Models import AndroidDevice

sys.path.append("")

from micropython import const
from assets.ble_services import (
    AUTH_USERNAME,
    AUTH_PASSWORD,
    AUTH_TOKEN,
    AUTH_RESPONSE,
    AUTH_SERVICE,
)
import struct
import aioble
import time

from assets.blutooth_const import (
    ENV_SERVICE,
    ADV_INTERVAL_MS,
    bluetooth_name,
)

# Human Interface Device
_GENERIC_VALUE = const(960)

auth = aioble.Service(AUTH_SERVICE)
username = aioble.Characteristic(
    auth,
    AUTH_USERNAME,
    read=False,
    write=True,
    notify=True,
    capture=True,
    initial=struct.pack("<h", 0),
)
password = aioble.Characteristic(
    auth,
    AUTH_PASSWORD,
    read=False,
    write=True,
    notify=True,
    capture=True,
    initial=struct.pack("<h", 0),
)
token = aioble.Characteristic(
    auth,
    AUTH_TOKEN,
    read=True,
    write=False,
    notify=True,
    capture=True,
    initial=struct.pack("<h", 0),
)
response = aioble.Characteristic(
    auth,
    AUTH_RESPONSE,
    read=True,
    write=True,
    notify=True,
    capture=True,
    initial=struct.pack("<h", 0),
)
aioble.register_services(auth)


async def search_for_connection():
    return await aioble.advertise(
        ADV_INTERVAL_MS,
        name=bluetooth_name,
        services=[ENV_SERVICE],
        appearance=_GENERIC_VALUE,
    )


async def handle_auth_request(connection):
    auth.active = True
    print("Waiting for username and password...")

    while True:
        await username.written()
        await password.written()

        received_username_bytes = username.read()
        received_password_bytes = password.read()

        received_username = received_username_bytes.decode("utf-8")
        received_password = received_password_bytes.decode("utf-8")

        print("Received credentials:", received_username, received_password)
        is_auth, un, pw, tk = AndroidDevice.validate_credentials(
            received_username, received_password
        )
        if is_auth:
            print("Credentials valid. Sending token:", tk)
            tk_bytes = tk.encode("utf-8")
            token.write(tk_bytes, send_update=True)
            token.notify(connection)
            await response.written()
            received_response_bytes = username.read()
            received_response = received_response_bytes.decode("utf-8")
            if received_response == "OK":
                print("Response OK received. Disabling auth service...")
                token.write(struct.pack("<h", 0), send_update=True)
                username.write(struct.pack("<h", 0), send_update=True)
                password.write(struct.pack("<h", 0), send_update=True)
                response.write(struct.pack("<h", 0), send_update=True)
                username.read = False
                password.read = False
                token.read = False
                response.read = False
                return un, pw, token
