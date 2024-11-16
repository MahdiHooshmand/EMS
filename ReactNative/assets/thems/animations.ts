import { Animated } from "react-native";
import { useRef } from "react";

/**
 * Represents a fade-in animation with translation effect.
 */
export class FadeIn {
  private readonly __duration: number;
  private readonly __course: number;
  private readonly __priority: number;
  fadeAnim: Animated.Value;
  translateY: Animated.Value;

  /**
   * Constructs a new instance of the FadeIn class.
   *
   * @param priority - The priority level of the animation, affecting the delay before it starts.
   * @param duration - The duration of the animation in milliseconds.
   * @param course - The initial translation value on the Y-axis.
   */
  constructor(priority = 0, duration = 600, course = -40) {
    this.__duration = duration;
    this.__course = course;
    this.__priority = priority;
    this.fadeAnim = useRef(new Animated.Value(0)).current;
    this.translateY = useRef(new Animated.Value(this.__course)).current;
  }

  /**
   * Returns the animation styles for opacity and translation.
   *
   * @returns An object containing the animated values for opacity and translateY.
   */
  getStyles = () => {
    return {
      opacity: this.fadeAnim,
      translateY: this.translateY,
    };
  };

  /**
   * Triggers the fade-in animation sequence.
   *
   * Resets the animation values and starts a sequence of animations
   * that includes a delay based on priority and parallel animations
   * for opacity and translation.
   *
   * @returns {Animated.CompositeAnimation} The animation sequence to be executed.
   */
  animate = (): Animated.CompositeAnimation => {
    this.fadeAnim.setValue(0);
    this.translateY.setValue(this.__course);

    return Animated.sequence([
      Animated.delay(300 * this.__priority),
      Animated.parallel([
        Animated.timing(this.fadeAnim, {
          toValue: 1,
          duration: this.__duration,
          useNativeDriver: true,
        }),
        Animated.timing(this.translateY, {
          toValue: 0,
          duration: this.__duration,
          useNativeDriver: true,
        }),
      ]),
    ]);
  };
}

/**
 * Represents a fade-out animation.
 */
export class FadeOut {
  private readonly __duration: number;
  fadeAnim: Animated.Value;

  /**
   * Constructs a new instance of the FadeOut class.
   *
   * @param duration - The duration of the animation in milliseconds. Defaults to 1000ms.
   */
  constructor(duration = 1000) {
    this.__duration = duration;
    this.fadeAnim = useRef(new Animated.Value(1)).current;
  }

  /**
   * Triggers the fade-out animation sequence.
   *
   * Resets the animation value to 1 (fully visible) and then animates it to 0 (fully transparent).
   *
   * @returns {Animated.CompositeAnimation} The animation to be executed.
   */
  animate = (): Animated.CompositeAnimation => {
    this.fadeAnim.setValue(1);

    return Animated.timing(this.fadeAnim, {
      toValue: 0,
      duration: this.__duration,
      useNativeDriver: true,
    });
  };
}
