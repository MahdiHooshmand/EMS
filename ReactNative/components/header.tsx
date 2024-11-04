// Define the styles for the Header component
import { Animated, Image, Pressable, StyleSheet, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { button_background_color, text_color } from "../assets/thems/colors";
import { FadeIn, FadeOut } from "../assets/thems/animations";
import { useState } from "react";

interface Props {
  headerFadeIn: FadeIn;
  fadeOut: FadeOut;
  navigation: any;
  backPage: string;
}

/**
 * Header component is responsible for displaying the app's logo and a back button.'
 * @param headerFadeIn - An instance of the FadeIn animation for the header.
 * @param fadeOut - An instance of the FadeOut animation for the container.
 * @param navigation - The navigation object used to navigate between screens.
 * @param backPage - The page to navigate back to when the back button is pressed.
 * @constructor - Header component constructor.
 */
export const Header = ({
  headerFadeIn,
  fadeOut,
  navigation,
  backPage,
}: Props) => {
  /**
   * State variable to track if the back button is pressed.
   */
  const [isBackButtonPressed, setIsBackButtonPressed] = useState(false);

  const handleBackPress = () => {
    fadeOut.animate().start(() => {
      navigation.replace(backPage);
    });
  };

  /**
   * Header component render method.
   * @returns - The header component's UI.
   */
  return (
    <Animated.View
      style={[
        styles.header,
        {
          opacity: headerFadeIn.fadeAnim,
          translateY: headerFadeIn.translateY,
        },
      ]}
    >
      <Pressable
        style={styles.pressable}
        onPress={handleBackPress}
        onPressIn={() => setIsBackButtonPressed(true)}
        onPressOut={() => setIsBackButtonPressed(false)}
      >
        <Ionicons
          style={styles.icon}
          name="arrow-back-circle-outline"
          size={45}
          color={isBackButtonPressed ? button_background_color : text_color}
        />
      </Pressable>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Image
          style={styles.logo}
          resizeMode={"contain"}
          source={require("../assets/images/small-icon.png")}
        />
      </View>
      <View style={{ flex: 1 }} />
    </Animated.View>
  );
};

/**
 * Define the styles for the Header component.
 */
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    width: "100%",
    height: 70,
    padding: 10,
    alignItems: "center",
  },
  pressable: {
    borderRadius: 25,
    flex: 1,
  },
  icon: {
    alignSelf: "flex-start",
  },
  logo: {
    width: 150,
    maxHeight: 60,
  },
});
