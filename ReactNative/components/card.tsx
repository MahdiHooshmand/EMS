import React, { ReactNode } from "react";
import { StyleSheet, View, Animated } from "react-native";
import { card_background_color } from "../assets/thems/colors";
import { FadeIn } from "../assets/thems/animations";

interface CardListProps {
  children: ReactNode;
}

export const CardList = ({ children }: CardListProps) => {
  return <View style={styles.cardList}>{children}</View>;
};

interface CardViewProps {
  children: ReactNode;
  fadeInAnim: FadeIn;
}

export const CardView = ({ children, fadeInAnim }: CardViewProps) => {
  return (
    <Animated.View
      style={[
        styles.cardView,
        {
          opacity: fadeInAnim.fadeAnim,
          translateY: fadeInAnim.translateY,
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardList: {
    backgroundColor: card_background_color,
    alignItems: "center",
    borderRadius: 10,
    margin: 10,
    padding: 15,
  },
  cardView: {
    backgroundColor: card_background_color,
    borderRadius: 10,
    padding: 15,
    width: "90%",
    flex: 1,
  },
});
