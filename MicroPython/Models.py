import hashlib
from assets.credential import Credentials
import os


class AndroidDevice:
    """
    A class representing an Android device with authentication capabilities.
    """

    def __init__(self):
        """
        Initialize an AndroidDevice instance.

        Sets up initial values for username, password, IP address, authentication status, and token.
        """
        self._username = None
        self._password = None
        self._ip_address = None
        self._is_authenticated = False
        self._token = None

    @property
    def is_authenticated(self):
        """
        Check if the device is authenticated.

        Returns:
            bool: True if the device is authenticated, False otherwise.
        """
        return self._is_authenticated

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
        token = hash_object.hexdigest()
        return token

    def authenticate(self, username, password, ip_address):
        """
        Authenticate the device with the provided credentials.

        Args:
            username (str): The username to authenticate with.
            password (str): The password to authenticate with.
            ip_address (str): The IP address of the device.

        If authentication is successful, updates the device's attributes and generates a token.
        If authentication fails, no action is taken.
        """
        hash_user = hashlib.sha256(username.encode("utf-8"))
        hash_pass = hashlib.sha256(password.encode("utf-8"))
        if hash_user.hexdigest() == Credentials.get(
            "username"
        ) and hash_pass.hexdigest() == Credentials.get("password"):
            self._username = hash_user.hexdigest()
            self._password = hash_pass.hexdigest()
            self._ip_address = ip_address
            self._is_authenticated = True
            self._token = self.__generate_random_token()
        else:
            pass

    def deauthenticate(self):
        """
        Deauthenticate the device.

        Resets all authentication-related attributes to their initial state.
        """
        self._username = None
        self._password = None
        self._ip_address = None
        self._is_authenticated = False
        self._token = None
