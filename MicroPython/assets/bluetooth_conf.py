import bluetooth
from micropython import const

GENERIC_VALUE = const(960)
ENV_SERVICE = bluetooth.UUID(0x1000)
ADV_INTERVAL_MS = 100_000
bluetooth_name = "Febina EMS 10001"
