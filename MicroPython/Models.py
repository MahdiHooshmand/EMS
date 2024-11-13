import hashlib
from assets.credential import Credentials
import os
import binascii
import json


class AndroidDevice:
    """
    A class representing an Android device with authentication capabilities.
    """

    def __init__(self, username, password, ip_address, token):
        """
        Initialize an AndroidDevice instance.

        Sets up initial values for username, password, IP address, authentication status, and token.
        """
        self._username = username
        self._password = password
        self._ip_address = ip_address
        self._token = token

    @property
    def username(self):
        """
        Get the username of the authenticated user.

        Returns:
            str or None: The username if authenticated, None otherwise.
        """
        return self._username

    @property
    def password(self):
        """
        Get the password of the authenticated user.

        Returns:
            str or None: The password if authenticated, None otherwise.
        """
        return self._password

    @property
    def ip_address(self):
        """
        Get the IP address of the authenticated device.

        Returns:
            str or None: The IP address if authenticated, None otherwise.
        """
        return self._ip_address

    @property
    def token(self):
        """
        Get the authentication token.

        Returns:
            str or None: The authentication token if authenticated, None otherwise.
        """
        return self._token

    @staticmethod
    def __generate_random_token():
        """
        Generate a random authentication token.

        Returns:
            str: A randomly generated SHA-256 token.
        """
        random_bytes = os.urandom(32)
        hash_object = hashlib.sha256(random_bytes)
        token = binascii.hexlify(hash_object.digest()).decode("utf-8")
        return token

    @staticmethod
    def validate_credentials(username, password):
        hash_user = hashlib.sha256(username.encode("utf-8"))
        hash_pass = hashlib.sha256(password.encode("utf-8"))
        hash_user_hex = binascii.hexlify(hash_user.digest()).decode("utf-8")
        hash_pass_hex = binascii.hexlify(hash_pass.digest()).decode("utf-8")

        print(hash_user_hex, hash_pass_hex)
        if hash_user_hex == Credentials.get(
            "username"
        ) and hash_pass_hex == Credentials.get("password"):
            token = AndroidDevice.__generate_random_token()
            return True, hash_user_hex, hash_pass_hex, token
        else:
            return False, None, None, None


class RunModel:
    def __init__(self, status="stop", frequency=None, pulse_width=None, duration=None):
        """
        Initializes the RunModel instance with default or provided values.

        :param status: Current status (e.g., 'stop', 'run', 'set')
        :param frequency: Frequency of the electrical stimulation
        :param pulse_width: Pulse width of the electrical stimulation
        :param duration: Duration of the treatment
        """
        self.status = status
        self.frequency = frequency
        self.pulse_width = pulse_width
        self.duration = duration

    def update(self, status=None, frequency=None, pulse_width=None, duration=None):
        """
        Update the RunModel instance with new values.

        :param status: New status value
        :param frequency: New frequency value
        :param pulse_width: New pulse width value
        :param duration: New duration value
        """
        if status:
            self.status = status
        if frequency:
            self.frequency = frequency
        if pulse_width:
            self.pulse_width = pulse_width
        if duration:
            self.duration = duration

    def __str__(self):
        return f"RunModel(status={self.status}, frequency={self.frequency}, pulse_width={self.pulse_width}, duration={self.duration})"


def json_to_run_model(info_json: str):
    """
    Converts a JSON string to a RunModel instance.

    :param info_json: JSON string representing the electrotherapy data
    :return: RunModel instance with values from the JSON
    """
    # Parse the JSON string
    info_dict = json.loads(info_json)

    # Create a new RunModel instance using the parsed data
    # If some fields are missing, they will remain as None or default values
    return RunModel(
        status=info_dict.get("status", "stop"),
        frequency=info_dict.get("frequency"),
        pulse_width=info_dict.get("pulseWidth"),
        duration=info_dict.get("duration"),
    )
