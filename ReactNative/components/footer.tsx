// OneButton component renders a button with a Material Icon and a text label.
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

/**
 * OneButton component renders a button with a Material Icon and a text label.
 * @param buttonFadeIn - animation object for the button's fade in animation'
 * @param onPress - function to be called when the button is pressed
 * @param materialIconName - name of the Material Icon to be used
 * @param text - text to be displayed on the button
 * @param isWaiting - whether the button is in a waiting state or not
 * @constructor - This component renders a button with a Material Icon and a text label.
 */
export const OneButton = ({
  buttonFadeIn,
  onPress,
  materialIconName,
  text,
  isWaiting,
}: Props) => {
  // Handle button press event
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

// Define styles for the component.
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
