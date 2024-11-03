import { Animated } from "react-native";
import { useRef } from "react";

export class FadeIn {
  private readonly __duration: number;
  private readonly __course: number;
  private readonly __priority: number;
  fadeAnim: Animated.Value;
  translateY: Animated.Value;

  constructor(priority = 0, duration = 600, course = -40) {
    this.__duration = duration;
    this.__course = course;
    this.__priority = priority;
    this.fadeAnim = useRef(new Animated.Value(0)).current;
    this.translateY = useRef(new Animated.Value(this.__course)).current;
  }

  getStyles = () => {
    return {
      opacity: this.fadeAnim,
      translateY: this.translateY,
    };
  };

  animate = () => {
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

export class FadeOut {
  private readonly __duration: number;
  fadeAnim: Animated.Value;

  constructor(duration = 1000) {
    this.__duration = duration;
    this.fadeAnim = useRef(new Animated.Value(1)).current;
  }

  animate = () => {
    this.fadeAnim.setValue(1);

    return Animated.timing(this.fadeAnim, {
      toValue: 0,
      duration: this.__duration,
      useNativeDriver: true,
    });
  };
}
