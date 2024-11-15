import hashlib
from assets.credential import Credentials
import os
import binascii


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
        """
        Validate the provided username and password against stored credentials.

        This method hashes the input username and password, then compares them
        with the stored hashed credentials. If they match, it generates a new
        authentication token.

        Parameters:
        username (str): The username to validate.
        password (str): The password to validate.

        Returns:
        tuple: A tuple containing four elements:
            - bool: True if credentials are valid, False otherwise.
            - str or None: Hashed username if valid, None otherwise.
            - str or None: Hashed password if valid, None otherwise.
            - str or None: New authentication token if valid, None otherwise.
        """
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
