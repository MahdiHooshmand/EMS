// A component that displays a list of cards.
// A component that displays a single card.
import React, { ReactNode } from "react";
import { StyleSheet, View, Animated } from "react-native";
import { card_background_color } from "../assets/thems/colors";
import { FadeIn } from "../assets/thems/animations";

interface CardListProps {
  children: ReactNode;
}

/**
 * A component that displays a list of cards.
 * @param children - The children to be displayed in the card list.
 * @constructor CardList - A component that displays a list of cards.
 */
export const CardList = ({ children }: CardListProps) => {
  return <View style={styles.cardList}>{children}</View>;
};

interface CardViewProps {
  children: ReactNode;
  fadeInAnim: FadeIn;
}

/**
 * A component that displays a single card.
 * @param children - The children to be displayed in the card.
 * @param fadeInAnim - The animation for the card view.
 * @constructor CardView - A component that displays a single card.
 */
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

/**
 * Styles for the CardList and CardView components.
 */
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
