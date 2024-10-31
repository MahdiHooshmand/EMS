import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Keyboard,
  Animated,
} from "react-native";
import {
  background_color,
  text_color,
  button_background_color,
  button_text_color,
  placeholder_color,
  error_text_color,
  button_pressed_background_color,
  input_text_color,
  button_pressed_text_color,
} from "../assets/thems/colors";
import { useFonts } from "expo-font";
import { useEffect, useState, useCallback } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { FadeIn, FadeOut } from "../assets/thems/animations";
import { sha256 } from "js-sha256";
import { credential } from "../assets/strings/accounts";

interface Props {
  navigation: any;
}

export function Login({ navigation }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const logoFadeIn = new FadeIn(0);
  const userFadeIn = new FadeIn(1);
  const passFadeIn = new FadeIn(2);
  const loginFadeIn = new FadeIn(3);
  const fadeOut = new FadeOut();
  const [keyboardStatus, setKeyboardStatus] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleInput = useCallback(
    (inputType: "username" | "password", inputText: string) => {
      if (inputType === "username") {
        setUsername(inputText);
      } else {
        setPassword(inputText);
      }
      setShowError(false);
    },
    [],
  );

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardStatus(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardStatus(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    Animated.parallel([
      logoFadeIn.animate(),
      userFadeIn.animate(),
      passFadeIn.animate(),
      loginFadeIn.animate(),
    ]).start();
  }, []);

  const login = useCallback(() => {
    Keyboard.dismiss();
    if (!username || !password) {
      setShowError(true);
      return;
    }

    const hashUsername = sha256.create();
    hashUsername.update(username);
    const hashPassword = sha256.create();
    hashPassword.update(password);

    if (
      hashUsername.hex() === credential.username &&
      hashPassword.hex() === credential.password
    ) {
      fadeOut.animate().start(() => {
        navigation.replace("connect-to-device");
      });
    } else {
      setShowError(true);
      setUsername("");
      setPassword("");
    }
  }, [username, password]);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[
          styles.container,
          {
            opacity: fadeOut.fadeAnim,
          },
        ]}
      >
        <View style={styles.header_gap}></View>
        {!keyboardStatus && (
          <Animated.View
            style={[
              styles.big_logo_container,
              {
                opacity: logoFadeIn.fadeAnim,
                translateY: logoFadeIn.translateY,
              },
            ]}
          >
            <Image
              style={styles.big_logo}
              resizeMode={"contain"}
              source={require("../assets/images/big-logo.png")}
            />
          </Animated.View>
        )}
        <View style={styles.error_container}>
          <Text style={styles.error_text}>
            {showError ? "Wrong username or password" : ""}
          </Text>
        </View>
        <View style={styles.submit_container}>
          <Animated.View
            style={{
              opacity: userFadeIn.fadeAnim,
              translateY: userFadeIn.translateY,
            }}
          >
            <Text style={styles.text}>Username</Text>
            <TextInput
              style={styles.input_user}
              value={username}
              placeholder="Enter Username..."
              placeholderTextColor={placeholder_color}
              onChangeText={(text) => handleInput("username", text)}
            />
          </Animated.View>
          <Animated.View
            style={{
              opacity: passFadeIn.fadeAnim,
              translateY: passFadeIn.translateY,
            }}
          >
            <Text style={styles.text}>Password</Text>
            <TextInput
              style={styles.input_pass}
              value={password}
              secureTextEntry={true}
              placeholder="Enter Password..."
              placeholderTextColor={placeholder_color}
              onChangeText={(text) => handleInput("password", text)}
            />
          </Animated.View>
          <Animated.View
            style={{
              opacity: loginFadeIn.fadeAnim,
              translateY: loginFadeIn.translateY,
            }}
          >
            <Pressable
              onPress={login}
              style={({ pressed }) => [
                pressed ? styles.login_button_pressed : styles.login_button,
              ]}
            >
              {({ pressed }) => (
                <>
                  <Text
                    style={
                      pressed ? styles.login_text_pressed : styles.login_text
                    }
                  >
                    Login
                  </Text>
                  <MaterialIcons
                    name="login"
                    size={24}
                    color={
                      pressed ? button_pressed_text_color : button_text_color
                    }
                  />
                </>
              )}
            </Pressable>
          </Animated.View>
        </View>
        <View style={styles.footer_gap}></View>
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
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  footer_gap: {
    flex: 3,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  error_container: {
    alignItems: "center",
    justifyContent: "center",
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
  input_user: {
    color: input_text_color,
    backgroundColor: button_background_color,
    borderRadius: 30,
    fontSize: 20,
    padding: 10,
    fontFamily: "fontHeader",
    textAlign: "center",
    marginBottom: 5,
    width: "75%",
    alignSelf: "center",
  },
  input_pass: {
    color: input_text_color,
    backgroundColor: button_background_color,
    borderRadius: 30,
    fontSize: 20,
    padding: 10,
    fontFamily: "fontHeader",
    textAlign: "center",
    marginBottom: 5,
    width: "75%",
    alignSelf: "center",
  },
  text: {
    color: text_color,
    fontSize: 20,
    margin: 10,
    fontFamily: "fontHeader",
    fontStyle: "italic",
    alignSelf: "center",
  },
  error_text: {
    color: error_text_color,
    fontSize: 12,
    margin: 6,
    fontFamily: "errorFont",
    alignSelf: "center",
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
    borderWidth: 1,
    borderColor: button_background_color,
  },
  login_text: {
    color: button_text_color,
    fontSize: 25,
    fontFamily: "fontHeader",
    fontStyle: "italic",
    textAlign: "center",
    paddingRight: 3,
  },
  login_button_pressed: {
    backgroundColor: button_pressed_background_color,
    margin: 15,
    marginTop: 30,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 26,
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "flex-end",
    borderWidth: 1,
    borderColor: button_text_color,
  },
  login_text_pressed: {
    color: button_pressed_text_color,
    fontSize: 25,
    fontFamily: "fontHeader",
    fontStyle: "italic",
    textAlign: "center",
    paddingRight: 3,
  },
});
