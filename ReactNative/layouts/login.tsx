import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Keyboard,
  Animated,
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

interface Props {
  navigation: any;
}

export function Login({ navigation }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [keyboardStatus, setKeyboardStatus] = useState(false);
  const [showError, setShowError] = useState(false);

  const fades = [new FadeIn(0), new FadeIn(1), new FadeIn(2), new FadeIn(3)];
  const fadeOut = new FadeOut();

  const handleInput = useCallback(
    (inputType: "username" | "password", inputText: string) => {
      inputType === "username"
        ? setUsername(inputText)
        : setPassword(inputText);
      setShowError(false);
    },
    [],
  );

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardStatus(true),
    );
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardStatus(false),
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    Animated.parallel(fades.map((fade) => fade.animate())).start();
  }, []);

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
      fadeOut.animate().start(() => navigation.replace("connect-to-device"));
    } else {
      setShowError(true);
      setUsername("");
      setPassword("");
    }
  }, [username, password]);

  const BigLogoContainer = () => {
    return (
      <>
        {!keyboardStatus && (
          <Animated.View
            style={[styles.big_logo_container, fades[0].getStyles()]}
          >
            <Image
              style={styles.big_logo}
              resizeMode="contain"
              source={require("../assets/images/big-logo.png")}
            />
          </Animated.View>
        )}
      </>
    );
  };

  const SubmitContainer = () => {
    return (
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
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.container, { opacity: fadeOut.fadeAnim }]}>
        <View style={styles.header_gap} />
        <BigLogoContainer />
        <View style={styles.error_container}>
          <Text style={styles.error_text}>
            {showError ? "Wrong username or password" : ""}
          </Text>
        </View>
        <SubmitContainer />
        <View style={styles.footer_gap} />
      </Animated.View>
    </SafeAreaView>
  );
}

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
