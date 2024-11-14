// Fetch the frequency and pulse width items based on the stimulation type.
import React, { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { FadeIn, FadeOut } from "../assets/thems/animations";
import {
  background_color,
  button_text_color,
  card_text_color,
  stop_color,
  text_color,
} from "../assets/thems/colors";
import { CardView } from "../components/card";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { RUN, STOP } from "../utills/BluetoothAPI";

/**
 * RunScreenProps interface to define the props expected by the RunScreen component.
 *
 * Props:
 * - navigation: The navigation object for navigation.
 * - route: The route object containing the data and source.
 */
type Props = NativeStackScreenProps<RootStackParamList, "run">;

/**
 * RunScreen component that displays the run screen.
 *
 * Props:
 * - navigation: The navigation object for navigation.
 * - route: The route object containing the data and source.
 */
export const RunScreen = ({ navigation, route }: Props) => {
  /**
   * State variables to store the data and source received from the previous screen.
   * data: Object containing muscle name, stimulation type, and duration.
   * source: Image source for the muscle.
   * countdown: Number representing the remaining time in seconds.
   * isInitialCountdown: Boolean indicating whether the countdown is initially set to the duration.
   * stopping: Boolean indicating whether the run is currently stopping.
   * stopFadeIn: FadeIn animation for the stop button.
   * infoFadeIn: FadeIn animation for the information view.
   * containerFadeOut: FadeOut animation for the container view.
   * stop: Function to handle the stop button press.
   * useEffect hook to handle animations and countdown.
   *
   * Note: Replace the data and source with the actual data received from the previous screen.
   *
   * Example usage:
   */
  const { data, source, peripheral } = route.params;
  const containerFadeOut = new FadeOut();
  const infoFadeIn = new FadeIn(0);
  const stopFadeIn = new FadeIn(1);

  const [countdown, setCountdown] = useState(5);
  const [isInitialCountdown, setIsInitialCountdown] = useState(true);
  const [stopping, setStopping] = useState(false);

  /**
   * Function to handle the stop button press.
   * If the run is currently stopping, it will reset the countdown and fade out the container view.
   * Otherwise, it will stop the run and navigate to the set-info screen with the muscle name, source, and stimulation type.
   */
  const stop = () => {
    if (stopping) {
      return;
    }
    setStopping(true);
    STOP(peripheral).then(() => {
      containerFadeOut.animate().start(() => {
        navigation.replace("set-info", {
          bodyPartName: data.muscle,
          source: source,
          stimulationType: data.stimulationType,
          peripheral: peripheral,
        });
      });
    });
  };

  /**
   * useEffect hook to handle animations and countdown.
   * Animates the info and stop buttons and sets the initial countdown if necessary.
   */
  useEffect(() => {
    Animated.parallel([infoFadeIn.animate(), stopFadeIn.animate()]).start();
  }, []);

  /**
   * useEffect hook to handle the countdown.
   * Sets the countdown to the duration if it's the initial countdown, otherwise updates the countdown every second.
   * If the countdown reaches zero, it stops the run and navigates to the set-info screen.
   */
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (isInitialCountdown) {
      RUN(peripheral).then();
      setCountdown(data.duration * 60);
      setIsInitialCountdown(false);
    } else {
      stop();
    }

    return () => clearInterval(interval);
  }, [countdown, isInitialCountdown]);

  /**
   * Function to format the countdown time into minutes and seconds.
   *
   * @param time - The countdown time in seconds.
   * @returns The formatted countdown time as a string in the format "MM:SS".
   *
   * Example usage:
   * formatTime(61) => "01:01"
   * formatTime(3661) => "06:01"
   * formatTime(123456) => "20:34"
   * formatTime(0) => "00:00"
   * formatTime(-1) => "00:00"
   * formatTime(null) => "00:00"
   * formatTime(undefined) => "00:00"
   * formatTime(NaN) => "00:00"
   */
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  /**
   * Render function to display the run screen.
   *
   * @returns The JSX elements for the run screen.
   */
  const CardContainer = () => {
    return (
      <CardView fadeInAnim={infoFadeIn}>
        <View style={styles.cardHeader}>
          <Image source={source} style={styles.image} resizeMode={"contain"} />
          <View style={styles.cardHeaderInfo}>
            <Text style={styles.title}>{data.stimulationType}</Text>
            <Text style={styles.title}>{data.muscle}</Text>
          </View>
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.label}>
            on time : {data.onTime.toFixed(1)} second
          </Text>
          <Text style={styles.label}>
            off time : {data.offTime.toFixed(1)} second
          </Text>
          <Text style={styles.label}>Frequency: {data.frequency} Hz</Text>
          <Text style={styles.label}>Pulse Width: {data.pulseWidth} µs</Text>
        </View>
      </CardView>
    );
  };

  /**
   * Render function to display the stop container.
   *
   * @returns The JSX elements for the stop container.
   *
   * Note: Replace the button_text_color with the actual color for the button text.
   *
   * Example usage:
   * const button_text_color = "#007bff";
   */
  const StopContainer = () => {
    return (
      <Animated.View
        style={[
          styles.stopView,
          {
            opacity: stopFadeIn.fadeAnim,
            transform: [{ translateY: stopFadeIn.translateY }],
          },
        ]}
      >
        <TouchableOpacity style={styles.stopButton} onPress={stop}>
          {stopping ? (
            <ActivityIndicator size="large" color={button_text_color} />
          ) : (
            <>
              {isInitialCountdown ? (
                <Text style={styles.stopLabel}>{countdown}</Text>
              ) : (
                <Text style={styles.countdownText}>
                  {formatTime(countdown)}
                </Text>
              )}
              <Text style={styles.stopLabel}>STOP</Text>
            </>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  /**
   * Render function to display the run screen.
   *
   * @returns The JSX elements for the run screen.
   */
  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[styles.container, { opacity: containerFadeOut.fadeAnim }]}
      >
        <CardContainer />
        <StopContainer />
      </Animated.View>
    </SafeAreaView>
  );
};

/**
 * Replace the background_color, card_text_color, and button_text_color with the actual colors for the background, card text, and button text.
 *
 * Example usage:
 * const background_color = "#f8f9fa";
 * const card_text_color = "#343a40";
 * const button_text_color = "#007bff";
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: background_color,
    alignItems: "center",
    width: "100%",
  },
  cardHeader: {
    aspectRatio: 2,
    flexDirection: "row",
    margin: 5,
  },
  cardHeaderInfo: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    marginTop: 10,
    flex: 1,
    aspectRatio: 1,
    width: "50%",
  },
  cardBody: {
    margin: 5,
  },
  title: {
    fontFamily: "fontHeader",
    fontSize: 20,
    textAlign: "center",
    color: card_text_color,
    margin: 5,
  },
  label: {
    fontFamily: "fontHeader",
    fontSize: 15,
    textAlign: "center",
    color: card_text_color,
    margin: 5,
  },
  stopView: {
    height: "50%",
    justifyContent: "center",
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
    margin: 10,
  },
  stopLabel: {
    fontFamily: "stopText",
    fontSize: 36,
    color: stop_color,
    margin: 10,
  },
});
