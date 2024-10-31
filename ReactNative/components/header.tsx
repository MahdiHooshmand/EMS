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

export const Header = ({
  headerFadeIn,
  fadeOut,
  navigation,
  backPage,
}: Props) => {
  const [isBackButtonPressed, setIsBackButtonPressed] = useState(false);

  const handleBackPress = () => {
    fadeOut.animate().start(() => {
      navigation.replace(backPage);
    });
  };

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
