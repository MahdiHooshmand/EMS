# runModel.py
import json


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


def json_to_model(info_json: str):
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
