// Muscle types as a union for better type safety
type MuscleName =
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

type StimulationType = "EMS" | "TENS";

class Electrotherapy {
  private _muscle: MuscleName;
  private _frequency: number;
  private _pulseWidth: number;
  private readonly _stimulationType: StimulationType;
  private _onTime: number;
  private _offTime: number;
  private _duration: number;

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

  get muscle(): MuscleName {
    return this._muscle;
  }

  set muscle(value: MuscleName) {
    this._muscle = value;
  }

  get stimulationType(): StimulationType {
    return this._stimulationType;
  }

  set frequency(value: number) {
    if (this.isFrequencyValid(value)) {
      this._frequency = value;
    } else {
      throw new Error("Invalid frequency value.");
    }
  }

  get frequency(): number {
    return this._frequency;
  }

  set pulseWidth(value: number) {
    if (this.isPulseWidthValid(value)) {
      this._pulseWidth = value;
    } else {
      throw new Error("Invalid pulse width value.");
    }
  }

  get pulseWidth(): number {
    return this._pulseWidth;
  }

  set onTime(value: number) {
    if (value >= 0.1 && value <= 10 && Number.isInteger(value * 10)) {
      this._onTime = value;
    } else {
      throw new Error(
        "Invalid onTime value. Must be between 0.1 and 10 seconds with 0.1-second increments.",
      );
    }
  }

  get onTime(): number {
    return this._onTime;
  }

  set offTime(value: number) {
    if (value >= 0.1 && value <= 10 && Number.isInteger(value * 10)) {
      this._offTime = value;
    } else {
      throw new Error(
        "Invalid offTime value. Must be between 0.1 and 10 seconds with 0.1-second increments.",
      );
    }
  }

  get offTime(): number {
    return this._offTime;
  }

  set duration(value: number) {
    if (value >= 1 && value <= 60 && Number.isInteger(value)) {
      this._duration = value;
    } else {
      throw new Error(
        "Invalid duration value. Must be between 1 and 60 minutes with 1-minute increments.",
      );
    }
  }

  get duration(): number {
    return this._duration;
  }

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

  protected isFrequencyValid(frequency: number): boolean {
    return false;
  }

  protected isPulseWidthValid(pulseWidth: number): boolean {
    return false;
  }
}

export class EMS extends Electrotherapy {
  public static readonly validFrequencies = [
    500, 600, 700, 800, 900, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000,
    9000, 10000,
  ];
  public static readonly validPulseWidths = [300, 500];

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

  protected isFrequencyValid(frequency: number): boolean {
    return EMS.validFrequencies.includes(frequency);
  }

  protected isPulseWidthValid(pulseWidth: number): boolean {
    return EMS.validPulseWidths.includes(pulseWidth);
  }
}

export class TENS extends Electrotherapy {
  public static readonly validFrequencies = [
    2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90,
    100, 110, 120,
  ];
  public static readonly validPulseWidths = [50, 75, 100, 150, 200, 250, 300];

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

  protected isFrequencyValid(frequency: number): boolean {
    return TENS.validFrequencies.includes(frequency);
  }

  protected isPulseWidthValid(pulseWidth: number): boolean {
    return TENS.validPulseWidths.includes(pulseWidth);
  }
}
