import {
  ActivityIndicator,
  Animated,
  Pressable,
  StyleSheet,
  Text,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  button_background_color,
  button_pressed_background_color,
  button_text_color,
} from "../assets/thems/colors";
import React from "react";
import { FadeIn } from "../assets/thems/animations";

interface Props {
  buttonFadeIn: FadeIn;
  onPress: () => void;
  materialIconName: "play-arrow" | "bluetooth-searching";
  text: string;
  isWaiting: boolean;
}

export const OneButton = ({
  buttonFadeIn,
  onPress,
  materialIconName,
  text,
  isWaiting,
}: Props) => {
  const styledPressed = () => {
    if (isWaiting) return;
    onPress();
  };
  return (
    <Animated.View
      style={[
        styles.footer,
        {
          opacity: buttonFadeIn.fadeAnim,
          translateY: buttonFadeIn.translateY,
        },
      ]}
    >
      {isWaiting ? (
        <ActivityIndicator size="large" color={button_text_color} />
      ) : (
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={styledPressed}
        >
          <Text style={styles.buttonText}>{text}</Text>
          <MaterialIcons
            name={materialIconName}
            size={24}
            color={button_text_color}
            style={styles.icon}
          />
        </Pressable>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  footer: {
    height: 90,
    justifyContent: "center",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: button_background_color,
    borderRadius: 30,
    flexDirection: "row",
  },
  buttonPressed: {
    backgroundColor: button_pressed_background_color,
  },
  buttonText: {
    fontFamily: "fontText",
    color: button_text_color,
    fontSize: 16,
  },
  icon: {
    marginLeft: 5,
  },
});
