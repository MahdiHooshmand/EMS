// The Login component is responsible for handling user authentication.
import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Keyboard,
  Animated,
  BackHandler,
} from "react-native";
import {
  background_color,
  button_background_color,
  button_text_color,
  error_text_color,
  button_pressed_background_color,
} from "../assets/thems/colors";
import { useEffect, useState, useCallback } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { FadeIn, FadeOut } from "../assets/thems/animations";
import { sha256 } from "js-sha256";
import { credential } from "../assets/strings/accounts";
import { InputAuth } from "../components/inputAuth";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";

type Props = NativeStackScreenProps<RootStackParamList, "login">;

/**
 * The Login component is responsible for handling user authentication.
 * It displays a login form with username and password fields, and a login button.
 * The component also includes error handling and animations.
 *
 * @param navigation - The navigation object used to navigate to other screens.
 */
export function Login({ navigation }: Props) {
  // State variables
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [keyboardStatus, setKeyboardStatus] = useState(false);
  const [showError, setShowError] = useState(false);

  // Animation instances
  const fades = [new FadeIn(0), new FadeIn(1), new FadeIn(2), new FadeIn(3)];
  const fadeOut = new FadeOut();

  // Function to handle input changes
  const handleInput = useCallback(
    (inputType: "username" | "password", inputText: string) => {
      inputType === "username"
        ? setUsername(inputText)
        : setPassword(inputText);
      setShowError(false);
    },
    [],
  );

  /**
   * useEffect hook to manage keyboard visibility, back button handling, and animations.
   *
   * This effect sets up listeners for keyboard show/hide events to update the keyboard status.
   * It also handles the hardware back button press to exit the app and starts animations in parallel.
   *
   * @returns A cleanup function that removes the keyboard listeners and back button handler.
   */
  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardStatus(true),
    );
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardStatus(false),
    );

    const backAction = () => {
      BackHandler.exitApp();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );

    Animated.parallel(fades.map((fade) => fade.animate())).start();

    // Cleanup function
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
      backHandler.remove();
    };
  }, []);

  /**
   * Handles the login process by validating the username and password.
   * If the credentials are correct, it navigates to the "connect-to-device" screen.
   * If the credentials are incorrect, it displays an error message.
   *
   * @returns {void} This function does not return a value.
   */
  const login = useCallback(() => {
    Keyboard.dismiss();
    if (!username || !password) {
      setShowError(true);
      return;
    }

    const hashUsername = sha256(username);
    const hashPassword = sha256(password);

    if (
      hashUsername === credential.username &&
      hashPassword === credential.password
    ) {
      fadeOut.animate().start(() =>
        navigation.replace("connect-to-device", {
          user: username,
          pass: password,
        }),
      );
    } else {
      setShowError(true);
      setUsername("");
      setPassword("");
    }
  }, [username, password]);

  // Component for the big logo
  const BigLogoContainer = () => {
    return (
      <Animated.View style={[styles.big_logo_container, fades[0].getStyles()]}>
        <Image
          style={styles.big_logo}
          resizeMode="contain"
          source={require("../assets/images/big-logo.png")}
        />
      </Animated.View>
    );
  };

  // Component for the login button
  const LoginButton = () => {
    return (
      <Animated.View style={fades[3].getStyles()}>
        <Pressable
          onPress={login}
          style={({ pressed }) => [
            styles.login_button,
            pressed && styles.login_button_pressed,
          ]}
        >
          <Text style={styles.login_text}>Login</Text>
          <MaterialIcons name="login" size={24} color={button_text_color} />
        </Pressable>
      </Animated.View>
    );
  };

  // Render the login screen
  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.container, { opacity: fadeOut.fadeAnim }]}>
        <View style={styles.header_gap} />
        {!keyboardStatus && <BigLogoContainer />}
        <View style={styles.error_container}>
          <Text style={styles.error_text}>
            {showError ? "Wrong username or password" : ""}
          </Text>
        </View>
        <View style={styles.submit_container}>
          <InputAuth
            fadeIn={fades[1]}
            title="UserName"
            value={username}
            placeholder="Enter Username..."
            handleInput={(text) => handleInput("username", text)}
            secureTextEntry={false}
          />
          <InputAuth
            fadeIn={fades[2]}
            title="Password"
            value={password}
            placeholder="Enter Password"
            handleInput={(text) => handleInput("password", text)}
            secureTextEntry={true}
          />
          <LoginButton />
        </View>
        <View style={styles.footer_gap} />
      </Animated.View>
    </SafeAreaView>
  );
}

/**
 * Replace the background_color, button_background_color, button_text_color, error_text_color, and button_pressed_background_color with the actual colors for the background, button background, button text, error text, and pressed button background.
 *
 * Example usage:
 * const background_color = "#f8f9fa";
 * const button_background_color = "#007bff";
 * const button_text_color = "#fff";
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: background_color,
    alignItems: "center",
    width: "100%",
  },
  header_gap: {
    flex: 2,
    width: "100%",
  },
  footer_gap: {
    flex: 3,
    width: "100%",
  },
  error_container: {
    alignItems: "center",
    width: "100%",
  },
  big_logo_container: {
    alignItems: "center",
    justifyContent: "center",
    width: "50%",
    aspectRatio: 1 / 1.2,
    flex: 12,
  },
  submit_container: {
    width: "80%",
  },
  big_logo: {
    width: "100%",
  },
  error_text: {
    color: error_text_color,
    fontSize: 12,
    margin: 6,
    fontFamily: "errorFont",
    textAlign: "center",
  },
  login_button: {
    backgroundColor: button_background_color,
    margin: 15,
    marginTop: 30,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 26,
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "flex-end",
  },
  login_button_pressed: {
    backgroundColor: button_pressed_background_color,
  },
  login_text: {
    color: button_text_color,
    fontSize: 25,
    fontFamily: "fontHeader",
    fontStyle: "italic",
    textAlign: "center",
    paddingRight: 3,
  },
});
