// BorderBox component to display children with fade-in animation and border
import React, { ReactNode } from "react";
import { Animated, StyleSheet } from "react-native";
import { card_border_color } from "../assets/thems/colors";
import { FadeIn } from "../assets/thems/animations";

interface BorderBoxProps {
  children: ReactNode;
  fadeAnim: FadeIn;
}

/**
 * A bordered box with fade-in animation.
 * @param children Children to be rendered inside the box.
 * @param fadeAnim Fade-in animation state.
 * @constructor = BorderBox
 */
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

/**
 * Default styles for the bordered box.
 */
const styles = StyleSheet.create({
  card: {
    width: "90%",
    flex: 1,
    borderWidth: 3,
    borderColor: card_border_color,
    borderRadius: 15,
    padding: 10,
  },
});
