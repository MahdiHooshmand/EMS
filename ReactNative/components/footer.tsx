import { Animated, Pressable, StyleSheet, Text } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  button_background_color,
  button_pressed_background_color,
  button_text_color,
} from "../assets/thems/colors";
import React from "react";
import { FadeIn, FadeOut } from "../assets/thems/animations";

interface Props {
  buttonFadeIn: FadeIn;
  onPress: () => void;
  materialIconName: "play-arrow" | "bluetooth-searching";
  text: string;
}

export const OneButton = ({
  buttonFadeIn,
  onPress,
  materialIconName,
  text,
}: Props) => {
  return (
    <Animated.View
      style={[
        {
          opacity: buttonFadeIn.fadeAnim,
          translateY: buttonFadeIn.translateY,
        },
      ]}
    >
      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
        onPress={onPress}
      >
        <Text style={styles.buttonText}>{text}</Text>
        <MaterialIcons
          name={materialIconName}
          size={24}
          color={button_text_color}
          style={styles.icon}
        />
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
    marginBottom: 20,
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
