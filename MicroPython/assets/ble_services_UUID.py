import bluetooth

"""
This module defines UUIDs for Bluetooth Low Energy (BLE) services and characteristics.

UUIDs are used to identify services and characteristics in a BLE network.
Each UUID is a 128-bit value that uniquely identifies a service or characteristic.

This module defines UUIDs for an authentication service and a run service.
The authentication service includes UUIDs for username, password, token, and response.
The run service includes UUIDs for command and response.
"""

# UUID for Authentication Service
AUTH_SERVICE = bluetooth.UUID(0x1010)  # Service UUID for Authentication
AUTH_USERNAME = bluetooth.UUID(0x1011)  # Characteristic UUID for Username
AUTH_PASSWORD = bluetooth.UUID(0x1012)  # Characteristic UUID for Password
AUTH_TOKEN = bluetooth.UUID(0x1013)  # Characteristic UUID for Authentication Token
AUTH_RESPONSE = bluetooth.UUID(0x1014)  # Characteristic UUID for Authentication Response

# UUID for Run Service
RUN_SERVICE = bluetooth.UUID(0x1020)  # Service UUID for Running Commands
RUN_COMMAND = bluetooth.UUID(0x1021)  # Characteristic UUID for Command to Run
RUN_RESPONSE = bluetooth.UUID(0x1022)  # Characteristic UUID for Response of the Command
