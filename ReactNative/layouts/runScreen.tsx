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

interface RunScreenProps {
  navigation: any;
  route: any;
}

export const RunScreen = ({ navigation, route }: RunScreenProps) => {
  const { data, source } = route.params;
  const containerFadeOut = new FadeOut();
  const infoFadeIn = new FadeIn(0);
  const stopFadeIn = new FadeIn(1);

  const [state, setState] = useState({
    countdown: 5,
    isInitialCountdown: true,
    stopping: false,
  });

  const stop = () => {
    if (state.stopping) return;
    setState((prev) => ({ ...prev, stopping: true }));
    setTimeout(() => {
      containerFadeOut.animate().start(() => {
        navigation.replace("set-info", {
          bodyPartName: data.muscle,
          source,
          stimulationType: data.stimulationType,
        });
      });
    }, 500);
  };

  useEffect(() => {
    Animated.parallel([infoFadeIn.animate(), stopFadeIn.animate()]).start();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setState((prev) => {
        if (prev.countdown > 0) {
          return { ...prev, countdown: prev.countdown - 1 };
        }
        if (prev.isInitialCountdown) {
          return {
            ...prev,
            countdown: data.duration * 60,
            isInitialCountdown: false,
          };
        }
        stop();
        return prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [state]);

  const formatTime = (time: number) =>
    `${String(Math.floor(time / 60)).padStart(2, "0")}:${String(time % 60).padStart(2, "0")}`;

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[styles.container, { opacity: containerFadeOut.fadeAnim }]}
      >
        <CardView fadeInAnim={infoFadeIn}>
          <View style={styles.cardHeader}>
            <Image source={source} style={styles.image} resizeMode="contain" />
            <View style={styles.cardHeaderInfo}>
              <Text style={styles.title}>{data.stimulationType}</Text>
              <Text style={styles.title}>{data.muscle}</Text>
            </View>
          </View>
          <View style={styles.cardBody}>
            <Text style={styles.label}>
              on time: {data.onTime.toFixed(1)} seconds
            </Text>
            <Text style={styles.label}>
              off time: {data.offTime.toFixed(1)} seconds
            </Text>
            <Text style={styles.label}>Frequency: {data.frequency} Hz</Text>
            <Text style={styles.label}>Pulse Width: {data.pulseWidth} µs</Text>
          </View>
        </CardView>
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
            {state.stopping ? (
              <ActivityIndicator size="large" color={button_text_color} />
            ) : (
              <>
                <Text style={styles.stopLabel}>
                  {state.isInitialCountdown
                    ? state.countdown
                    : formatTime(state.countdown)}
                </Text>
                <Text style={styles.stopLabel}>STOP</Text>
              </>
            )}
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
  stopLabel: {
    fontFamily: "stopText",
    fontSize: 36,
    color: text_color,
    margin: 10,
  },
});
