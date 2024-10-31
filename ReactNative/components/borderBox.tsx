import React, { ReactNode } from "react";
import { Animated, StyleSheet } from "react-native";
import { card_border_color } from "../assets/thems/colors";
import { FadeIn } from "../assets/thems/animations";

interface BorderBoxProps {
  children: ReactNode;
  fadeAnim: FadeIn;
}

export const BorderBox: React.FC<BorderBoxProps> = ({ children, fadeAnim }) => {
  return (
    <Animated.View
      style={[
        styles.card,
        {
          opacity: fadeAnim.fadeAnim,
          translateY: fadeAnim.translateY,
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "90%",
    flex: 1,
    borderWidth: 3,
    borderColor: card_border_color,
    borderRadius: 15,
    padding: 10,
    alignItems: "center",
  },
});
