from assets.ble_services_UUID import (
    AUTH_USERNAME,
    AUTH_PASSWORD,
    AUTH_TOKEN,
    AUTH_RESPONSE,
    AUTH_SERVICE,
    RUN_SERVICE,
    RUN_COMMAND,
    RUN_RESPONSE,
)
from assets.bluetooth_conf import (
    GENERIC_VALUE,
    ENV_SERVICE,
    ADV_INTERVAL_MS,
    bluetooth_name,
)
import aioble
import struct
from Models import AndroidDevice
import json

auth = aioble.Service(AUTH_SERVICE)
run = aioble.Service(RUN_SERVICE)

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


data = aioble.Characteristic(
    run,
    RUN_COMMAND,
    read=True,
    write=True,
    notify=True,
    capture=True,
    initial=struct.pack("<h", 0),
)
res = aioble.Characteristic(
    run,
    RUN_RESPONSE,
    read=True,
    write=False,
    notify=True,
    capture=True,
    initial=struct.pack("<h", 0),
)

aioble.register_services(auth, run)

auth.active = True
run.active = True


class AuthService:
    @staticmethod
    async def search_for_connection():
        """
        Advertises the BLE service to nearby devices and waits for connections.

        This asynchronous function initiates Bluetooth Low Energy (BLE) advertising
        to make the device discoverable to nearby BLE-enabled devices. It uses
        predefined constants and settings for the advertisement process.

        Returns:
        --------
        connection : object
            A connection object representing the established BLE connection.
            The exact type depends on the aioble library implementation.

        Note:
        -----
        This function is a coroutine and should be called with await.
        """
        return await aioble.advertise(
            ADV_INTERVAL_MS,
            name=bluetooth_name,
            services=[ENV_SERVICE],
            appearance=GENERIC_VALUE,
        )

    @staticmethod
    async def get_credentials():
        """
        Asynchronously retrieves user credentials from BLE characteristics.

        This function waits for the username and password to be written to their
        respective BLE characteristics. Once both are written, it reads the values
        and decodes them from bytes to UTF-8 strings.

        Returns:
        --------
        tuple
            A tuple containing two strings:
            - username (str): The decoded username received via BLE.
            - password (str): The decoded password received via BLE.

        Note:
        -----
        This function is a coroutine and should be called with await.
        """
        await username.written()
        await password.written()
        received_username_bytes = username.read()
        received_password_bytes = password.read()

        return received_username_bytes.decode("utf-8"), received_password_bytes.decode(
            "utf-8"
        )

    @staticmethod
    def send_token(tk, connection):
        """
        Sends a token to the connected device after successful authentication.

        This function encodes the provided token as UTF-8, writes it to the token
        characteristic, and notifies the connected device of the update.

        Args:
            tk (str): The authentication token to be sent to the connected device.
            connection: The BLE connection object representing the active connection
                        with the device that should receive the token.

        Returns:
            None

        Note:
            This function assumes that a global 'token' characteristic is available
            and properly configured for writing and notifying.
        """
        print("Credentials valid. Sending token:", tk)
        tk_bytes = tk.encode("utf-8")
        token.write(tk_bytes, send_update=True)
        token.notify(connection)

    @staticmethod
    def reset_values():
        """
        Resets all characteristic values to their default state.

        This function is called when the authentication process needs to
        be reset. It sets all BLE characteristics
        (token, username, password, and response) back to their initial
        state by writing a default value of 0 as a 16-bit integer.

        The function also prints a message indicating that values are being
        reset.

        Parameters:
        -----------
        None

        Returns:
        --------
        None

        Side Effects:
        -------------
        - Prints a message to the console.
        - Modifies the global BLE characteristics: token, username, password, and response.
        """
        print("Resetting values...")
        token.write(struct.pack("<h", 0), send_update=True)
        username.write(struct.pack("<h", 0), send_update=True)
        password.write(struct.pack("<h", 0), send_update=True)
        response.write(struct.pack("<h", 0), send_update=True)

    @staticmethod
    def disable_auth_service():
        """
        Disables the authentication service by resetting characteristic values and making them unreadable.

        This function performs the following actions:
        1. Prints a message indicating that the authentication service is being disabled.
        2. Resets all characteristic values to their default state using the reset_values() function.
        3. Sets the 'read' attribute of username, password, token, and response characteristics to False,
           making them unreadable.

        Parameters:
        -----------
        None

        Returns:
        --------
        None

        Side Effects:
        -------------
        - Prints a message to the console.
        - Resets values of BLE characteristics.
        - Modifies the 'read' attribute of multiple BLE characteristics.
        """
        print("Auth service disabled.")
        AuthService.reset_values()
        username.read = False
        password.read = False
        token.read = False
        response.read = False

    @staticmethod
    async def check_response_after_auth(connection):
        """
        Asynchronously checks the response received after sending the authentication token.

        This function waits for a response to be written to the 'response' characteristic,
        reads the response, and checks if it matches the expected 'OK' value. If the response
        is 'OK', it disables the authentication service. Otherwise, it resets all values.

        Parameters:
        -----------
        connection : object
            The BLE connection object representing the active connection with the client device.
            This parameter is currently not used within the function but might be needed for
            future implementations or consistency with other functions.

        Returns:
        --------
        bool
            True if the received response is 'OK', indicating successful authentication.
            False if the received response is not 'OK', indicating failed authentication.

        Side Effects:
        -------------
        - Prints messages to the console indicating the outcome of the response check.
        - Calls disable_auth_service() if the response is 'OK'.
        - Calls reset_values() if the response is not 'OK'.
        """
        await response.written()
        received_response_bytes = response.read()
        received_response = received_response_bytes.decode("utf-8")

        if received_response == "OK":
            print("Response OK received. Disabling auth service...")
            AuthService.disable_auth_service()
            return True
        else:
            print("Response not OK received. Resetting values...")
            AuthService.reset_values()
            return False

    @staticmethod
    async def handle_auth_request(connection):
        """
        Handles the authentication process by validating credentials and managing token response.

        This asynchronous function manages the entire authentication flow, including receiving
        credentials, validating them, sending tokens, and handling responses. It continuously
        loops until a successful authentication is completed.

        Parameters:
        -----------
        connection : object
            The BLE connection object representing the active connection with the client device.
            This object is used for sending the authentication token.

        Returns:
        --------
        tuple or None
            If authentication is successful, returns a tuple containing:
            - un (str): The authenticated username
            - pw (str): The authenticated password
            - token (str): The authentication token sent to the client
            If authentication fails or the process is interrupted, the function continues
            to loop and does not return.

        Side Effects:
        -------------
        - Activates the authentication service
        - Prints status messages to the console
        - Modifies global BLE characteristics (through called functions)
        - Sends BLE notifications to the connected device
        """
        print("Waiting for username and password...")

        while True:
            # Read and validate user credentials
            received_username, received_password = await AuthService.get_credentials()
            print("Received credentials:", received_username, received_password)

            # Validate credentials using external AndroidDevice model
            is_auth, un, pw, tk = AndroidDevice.validate_credentials(
                received_username, received_password
            )

            if is_auth:
                # Send token if authentication is successful
                AuthService.send_token(tk, connection)

                # Check if response after sending token is 'OK'
                if await AuthService.check_response_after_auth(connection):
                    return un, pw, tk
                else:
                    print("Waiting for username and password again...")
                    continue
            else:
                # Reset values and await new credentials if authentication fails
                AuthService.reset_values()
                print("Waiting for username and password again...")
                continue


class RunService:
    @staticmethod
    async def handle_command(connection, android_device):
        while True:
            full_data = ""
            while True:
                await data.written()
                received_chunk = data.read()
                decoded_chunk = received_chunk.decode("utf-8")
                full_data += decoded_chunk
                print("Received chunk:", decoded_chunk)
                if "\n" in full_data:
                    full_data = full_data.rstrip("\n")
                    print("Full data received:", full_data)
                    break

            if full_data == "STOP":
                print("Stopping service...")
                await RunService.send_response("STOP", connection)
            else:
                received_data_dict = json.loads(full_data)
                received_token = received_data_dict.get("token")
                received_cmd = received_data_dict.get("command")
                received_info = received_data_dict.get("info", {})
                if received_token == android_device.token:
                    print("Valid TOKEN")
                else:
                    print("Invalid TOKEN")
                    print("Received token:", received_token)
                    print("correct token:", android_device.token)
                print("Received token:", received_token)
                print("Received command:", received_cmd)
                print("Received info:", received_info)
                await RunService.send_response(received_cmd, connection)

    @staticmethod
    async def send_response(response_data, connection):
        response_bytes = response_data.encode("utf-8")
        res.write(response_bytes, send_update=True)
        token.notify(connection)
