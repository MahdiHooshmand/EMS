// Muscle types as a union for better type safety
/**
 * Represents a muscle group for easy identification.
 */
export type MuscleName =
  | "ABDOMINALS"
  | "OBLIQUES"
  | "TRAPEZIUS"
  | "LATISSIMUS DORSI"
  | "BICEPS"
  | "TRICEPS"
  | "FRONT DELTOIDS"
  | "REAR DELTOIDS"
  | "VASTUS MEDIALIS"
  | "VASTUS LATERALIS"
  | "QUADRICEPS & GRACILIS"
  | "HAMSTRINGS"
  | "GLUTEUS MAXIMUS"
  | "CALVES"
  | "FOREARMS";

/**
 * Represents the type of electrical stimulation (EMS or TENS).
 */
export type StimulationType = "EMS" | "TENS";

/**
 * Represents an electrotherapy treatment with various parameters.
 */
export class Electrotherapy {
  private _muscle: MuscleName;
  private _frequency: number;
  private _pulseWidth: number;
  private readonly _stimulationType: StimulationType;
  private _onTime: number;
  private _offTime: number;
  private _duration: number;

  /**
   * Creates a new Electrotherapy instance.
   *
   * @param muscle - The targeted muscle for the electrotherapy.
   * @param frequency - The frequency of the electrical stimulation in Hz.
   * @param pulseWidth - The width of each electrical pulse in microseconds.
   * @param stimulationType - The type of stimulation (EMS or TENS).
   * @param onTime - The duration of active stimulation in seconds.
   * @param offTime - The duration of rest between stimulations in seconds.
   * @param duration - The total duration of the treatment in minutes.
   */
  constructor(
    muscle: MuscleName,
    frequency: number,
    pulseWidth: number,
    stimulationType: StimulationType,
    onTime: number,
    offTime: number,
    duration: number,
  ) {
    this._muscle = muscle;
    this._frequency = frequency;
    this._pulseWidth = pulseWidth;
    this._stimulationType = stimulationType;
    this._onTime = onTime;
    this._offTime = offTime;
    this._duration = duration;
  }

  /**
   * Gets the targeted muscle.
   *
   * @returns The name of the targeted muscle.
   */
  get muscle(): MuscleName {
    return this._muscle;
  }

  /**
   * Sets the targeted muscle.
   *
   * @param value - The name of the muscle to target.
   */
  set muscle(value: MuscleName) {
    this._muscle = value;
  }

  /**
   * Gets the stimulation type.
   *
   * @returns The type of stimulation (EMS or TENS).
   */
  get stimulationType(): StimulationType {
    return this._stimulationType;
  }

  /**
   * Sets the frequency of the electrical stimulation.
   *
   * @param value - The frequency in Hz.
   * @throws Will throw an error if the frequency is invalid.
   */
  set frequency(value: number) {
    if (this.isFrequencyValid(value)) {
      this._frequency = value;
    } else {
      throw new Error("Invalid frequency value.");
    }
  }

  /**
   * Gets the frequency of the electrical stimulation.
   *
   * @returns The frequency in Hz.
   */
  get frequency(): number {
    return this._frequency;
  }

  /**
   * Sets the pulse width of the electrical stimulation.
   *
   * @param value - The pulse width in microseconds.
   * @throws Will throw an error if the pulse width is invalid.
   */
  set pulseWidth(value: number) {
    if (this.isPulseWidthValid(value)) {
      this._pulseWidth = value;
    } else {
      throw new Error("Invalid pulse width value.");
    }
  }

  /**
   * Gets the pulse width of the electrical stimulation.
   *
   * @returns The pulse width in microseconds.
   */
  get pulseWidth(): number {
    return this._pulseWidth;
  }

  /**
   * Sets the duration of active stimulation.
   *
   * @param value - The on-time in seconds (between 0.1 and 10, with 0.1-second increments).
   * @throws Will throw an error if the value is out of range or not in 0.1-second increments.
   */
  set onTime(value: number) {
    if (value >= 0.1 && value <= 10 && Number.isInteger(value * 10)) {
      this._onTime = value;
    } else {
      throw new Error(
        "Invalid onTime value. Must be between 0.1 and 10 seconds with 0.1-second increments.",
      );
    }
  }

  /**
   * Gets the duration of active stimulation.
   *
   * @returns The on-time in seconds.
   */
  get onTime(): number {
    return this._onTime;
  }

  /**
   * Sets the duration of rest between stimulations.
   *
   * @param value - The off-time in seconds (between 0.1 and 10, with 0.1-second increments).
   * @throws Will throw an error if the value is out of range or not in 0.1-second increments.
   */
  set offTime(value: number) {
    if (value >= 0.1 && value <= 10 && Number.isInteger(value * 10)) {
      this._offTime = value;
    } else {
      throw new Error(
        "Invalid offTime value. Must be between 0.1 and 10 seconds with 0.1-second increments.",
      );
    }
  }

  /**
   * Gets the duration of rest between stimulations.
   *
   * @returns The off-time in seconds.
   */
  get offTime(): number {
    return this._offTime;
  }

  /**
   * Sets the total duration of the treatment.
   *
   * @param value - The duration in minutes (between 1 and 60, with 1-minute increments).
   * @throws Will throw an error if the value is out of range or not in 1-minute increments.
   */
  set duration(value: number) {
    if (value >= 1 && value <= 60 && Number.isInteger(value)) {
      this._duration = value;
    } else {
      throw new Error(
        "Invalid duration value. Must be between 1 and 60 minutes with 1-minute increments.",
      );
    }
  }

  /**
   * Gets the total duration of the treatment.
   *
   * @returns The duration in minutes.
   */
  get duration(): number {
    return this._duration;
  }

  /**
   * Converts the Electrotherapy instance to a JSON string.
   *
   * @returns A JSON string representation of the Electrotherapy instance.
   */
  toJSON(): string {
    return JSON.stringify({
      muscle: this._muscle,
      frequency: this._frequency,
      pulseWidth: this._pulseWidth,
      stimulationType: this._stimulationType,
      onTime: this._onTime,
      offTime: this._offTime,
      duration: this._duration,
    });
  }

  /**
   * Checks if the given frequency is valid.
   *
   * @param frequency - The frequency to validate.
   * @returns True if the frequency is valid, false otherwise.
   */
  protected isFrequencyValid(frequency: number): boolean {
    return false;
  }

  /**
   * Checks if the given pulse width is valid.
   *
   * @param pulseWidth - The pulse width to validate.
   * @returns True if the pulse width is valid, false otherwise.
   */
  protected isPulseWidthValid(pulseWidth: number): boolean {
    return false;
  }
}

/**
 * Represents an Electrical Muscle Stimulation (EMS) therapy session.
 * Extends the base Electrotherapy class with EMS-specific parameters and validation.
 */
export class EMS extends Electrotherapy {
  /** Valid frequencies for EMS therapy in Hz. */
  public static readonly validFrequencies = [
    500, 600, 700, 800, 900, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000,
    9000, 10000,
  ];

  /** Valid pulse widths for EMS therapy in microseconds. */
  public static readonly validPulseWidths = [300, 500];

  /**
   * Creates a new EMS therapy session.
   *
   * @param muscle - The targeted muscle for the EMS therapy.
   * @param frequency - The frequency of the electrical stimulation in Hz.
   * @param pulseWidth - The width of each electrical pulse in microseconds.
   * @param onTime - The duration of active stimulation in seconds.
   * @param offTime - The duration of rest between stimulations in seconds.
   * @param duration - The total duration of the treatment in minutes.
   */
  constructor(
    muscle: MuscleName,
    frequency: number,
    pulseWidth: number,
    onTime: number,
    offTime: number,
    duration: number,
  ) {
    super(muscle, frequency, pulseWidth, "EMS", onTime, offTime, duration);
  }

  /**
   * Checks if the given frequency is valid for EMS therapy.
   *
   * @param frequency - The frequency to validate in Hz.
   * @returns True if the frequency is valid for EMS, false otherwise.
   */
  protected isFrequencyValid(frequency: number): boolean {
    return EMS.validFrequencies.includes(frequency);
  }

  /**
   * Checks if the given pulse width is valid for EMS therapy.
   *
   * @param pulseWidth - The pulse width to validate in microseconds.
   * @returns True if the pulse width is valid for EMS, false otherwise.
   */
  protected isPulseWidthValid(pulseWidth: number): boolean {
    return EMS.validPulseWidths.includes(pulseWidth);
  }
}

/**
 * Represents a Transcutaneous Electrical Nerve Stimulation (TENS) therapy session.
 * Extends the base Electrotherapy class with TENS-specific parameters and validation.
 */
export class TENS extends Electrotherapy {
  /** Valid frequencies for TENS therapy in Hz. */
  public static readonly validFrequencies = [
    2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90,
    100, 110, 120,
  ];

  /** Valid pulse widths for TENS therapy in microseconds. */
  public static readonly validPulseWidths = [50, 75, 100, 150, 200, 250, 300];

  /**
   * Creates a new TENS therapy session.
   *
   * @param muscle - The targeted muscle for the TENS therapy.
   * @param frequency - The frequency of the electrical stimulation in Hz.
   * @param pulseWidth - The width of each electrical pulse in microseconds.
   * @param onTime - The duration of active stimulation in seconds.
   * @param offTime - The duration of rest between stimulations in seconds.
   * @param duration - The total duration of the treatment in minutes.
   */
  constructor(
    muscle: MuscleName,
    frequency: number,
    pulseWidth: number,
    onTime: number,
    offTime: number,
    duration: number,
  ) {
    super(muscle, frequency, pulseWidth, "TENS", onTime, offTime, duration);
  }

  /**
   * Checks if the given frequency is valid for TENS therapy.
   *
   * @param frequency - The frequency to validate in Hz.
   * @returns True if the frequency is valid for TENS, false otherwise.
   */
  protected isFrequencyValid(frequency: number): boolean {
    return TENS.validFrequencies.includes(frequency);
  }

  /**
   * Checks if the given pulse width is valid for TENS therapy.
   *
   * @param pulseWidth - The pulse width to validate in microseconds.
   * @returns True if the pulse width is valid for TENS, false otherwise.
   */
  protected isPulseWidthValid(pulseWidth: number): boolean {
    return TENS.validPulseWidths.includes(pulseWidth);
  }
}
