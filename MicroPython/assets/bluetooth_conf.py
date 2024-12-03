"""
This script sets up Bluetooth configuration for a MicroPython-based device.

Constants:
- GENERIC_VALUE: A constant value used for a generic Bluetooth service characteristic.
- ENV_SERVICE: A unique identifier for a custom Bluetooth service.
- ADV_INTERVAL_MS: The interval in milliseconds between Bluetooth advertising packets.
- bluetooth_name: The name of the Bluetooth device.
"""

import bluetooth
from micropython import const

GENERIC_VALUE = const(960)
# A constant value used to identify the Generic Value characteristic in a Bluetooth service.
# This value is defined by the Bluetooth SIG as 0x2A58.

ENV_SERVICE = bluetooth.UUID(0x1000)
# A unique identifier for a custom Bluetooth service. This UUID is used to identify the service
# and its associated characteristics during Bluetooth discovery.

ADV_INTERVAL_MS = 100_000
# The interval in milliseconds between Bluetooth advertising packets. This interval determines
# how frequently the device will broadcast its presence to other Bluetooth devices.

bluetooth_name = "Febina EMS 10004"
# The name of the Bluetooth device. This name is advertised during Bluetooth discovery, allowing
# other devices to easily identify this device.
