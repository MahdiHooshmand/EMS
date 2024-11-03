import React, { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
  View,
  TouchableOpacity,
} from "react-native";
import { Electrotherapy } from "../models/stimulateInfoModel";
import { FadeIn, FadeOut } from "../assets/thems/animations";
import {
  background_color,
  stop_color,
  text_color,
} from "../assets/thems/colors";
import { BorderBox } from "../components/borderBox";

interface RunScreenProps {
  navigation: any;
  route: {
    params: {
      data: Electrotherapy;
    };
  };
}

export const RunScreen = ({ navigation, route }: RunScreenProps) => {
  const { data } = route.params;
  const containerFadeOut = new FadeOut();
  const infoFadeIn = new FadeIn(0);
  const stopFadeIn = new FadeIn(1);

  const [countdown, setCountdown] = useState(5);
  const [isInitialCountdown, setIsInitialCountdown] = useState(true);

  useEffect(() => {
    Animated.parallel([infoFadeIn.animate(), stopFadeIn.animate()]).start();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (isInitialCountdown) {
      setCountdown(data.duration * 60); // تبدیل دقیقه به ثانیه
      setIsInitialCountdown(false);
    }

    return () => clearInterval(interval);
  }, [countdown, isInitialCountdown]);

  // تبدیل ثانیه به قالب MM:SS
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[styles.container, { opacity: containerFadeOut.fadeAnim }]}
      >
        <BorderBox fadeAnim={infoFadeIn}>
          <Text style={styles.title}>
            {data.stimulationType} : {data.muscle}
          </Text>
          <Text style={styles.label}>
            on time : {data.onTime} second , off time : {data.offTime} second
          </Text>
          <Text style={styles.label}>
            Frequency: {data.frequency} Hz , Pulse Width: {data.pulseWidth} µs
          </Text>
        </BorderBox>

        <Animated.View
          style={[
            styles.stopView,
            {
              opacity: stopFadeIn.fadeAnim,
              transform: [{ translateY: stopFadeIn.translateY }],
            },
          ]}
        >
          <TouchableOpacity style={styles.stopButton} onPress={() => {}}>
            {isInitialCountdown ? (
              <Text style={styles.stopLabel}>{countdown}</Text>
            ) : (
              <Text style={styles.countdownText}>{formatTime(countdown)}</Text>
            )}
            <Text style={styles.stopLabel}>STOP</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: background_color,
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontFamily: "fontHeader",
    fontSize: 24,
    textAlign: "center",
    color: text_color,
    margin: 10,
  },
  label: {
    fontFamily: "fontHeader",
    fontSize: 18,
    textAlign: "center",
    color: text_color,
    margin: 5,
  },
  stopView: {
    height: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  stopButton: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 999,
    borderWidth: 15,
    borderColor: stop_color,
    justifyContent: "center",
    alignItems: "center",
    maxHeight: "80%",
    maxWidth: "80%",
  },
  countdownText: {
    fontFamily: "stopText",
    fontSize: 36,
    color: text_color,
    fontWeight: "bold",
    margin: 10,
  },
  stopLabel: {
    fontFamily: "stopText",
    fontSize: 36,
    color: stop_color,
    textAlign: "center",
    margin: 10,
  },
});
