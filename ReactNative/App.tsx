// EMS/App.tsx
import { StatusBar } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { Login } from "./layouts/login";
import { background_color } from "./assets/thems/colors";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ConnectToDeviceScreen } from "./layouts/connectToDevice";
import { BodyPartsScreen } from "./layouts/bodyParts";

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    fontTitle: require("./assets/fonts/OpenSans-BoldItalic.ttf"),
    errorFont: require("./assets/fonts/OpenSans-Regular.ttf"),
    fontHeader: require("./assets/fonts/OpenSans-Italic.ttf"),
    fontText: require("./assets/fonts/OpenSans-Italic.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor={background_color} />
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="login"
      >
        <Stack.Screen name="login" component={Login} />
        <Stack.Screen
          name="connect-to-device"
          component={ConnectToDeviceScreen}
        />
        <Stack.Screen name="body-parts" component={BodyPartsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
