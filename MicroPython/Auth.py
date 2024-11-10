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
auth.active = False


async def search_for_connection():
    return await aioble.advertise(
        ADV_INTERVAL_MS,
        name=bluetooth_name,
        services=[ENV_SERVICE],
        appearance=_GENERIC_VALUE,
    )


def enable_auth_service():
    auth.active = True


async def handle_auth_request():
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
        is_auth, un, pw, token = AndroidDevice.validate_credentials(
            received_username, received_password
        )
        if is_auth:
            print("Credentials valid. Sending token:", token)
            token.set_value(struct.pack("<h", token))
            await token.notify()
            await response.written()
            received_response_bytes = username.read()
            received_response = received_response_bytes.decode("utf-8")
            if received_response == "OK":
                print("Response OK received. Disabling auth service...")
                auth.active = False
                return un, pw, token

        # if validate_credentials(received_username, received_password):
        #     print("Credentials valid. Sending token...")
        #     token.set_value(struct.pack("<h", AUTH_TOKEN_VALUE))
        #     await token.notify()  # ارسال توکن به دستگاه متصل
        #
        #     # منتظر دریافت پاسخ OK از دستگاه متصل
        #     await response.written()
        #     received_response = struct.unpack("<h", response.value())[0]
        #
        #     if received_response == RESPONSE_OK:
        #         print("Response OK received. Disabling auth service...")
        #         disable_auth_service()
        #         break
        # else:
        #     print("Invalid credentials. Try again.")
