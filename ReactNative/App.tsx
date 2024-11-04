import { StatusBar } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import * as OpenSans from "@expo-google-fonts/open-sans";
import { useEffect } from "react";
import { Login } from "./layouts/login";
import { background_color } from "./assets/thems/colors";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ConnectToDeviceScreen } from "./layouts/connectToDevice";
import { BodyPartsScreen } from "./layouts/bodyParts";
import { SetInfoScreen } from "./layouts/setInfoScreen";
import { RunScreen } from "./layouts/runScreen";

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    fontTitle: OpenSans.OpenSans_700Bold_Italic,
    errorFont: OpenSans.OpenSans_300Light,
    fontHeader: OpenSans.OpenSans_500Medium_Italic,
    fontText: OpenSans.OpenSans_400Regular_Italic,
    stopText: OpenSans.OpenSans_700Bold,
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
        screenOptions={{ headerShown: false, animation: "none" }}
        initialRouteName="login"
      >
        <Stack.Screen name="login" component={Login} />
        <Stack.Screen
          name="connect-to-device"
          component={ConnectToDeviceScreen}
        />
        <Stack.Screen name="body-parts" component={BodyPartsScreen} />
        <Stack.Screen name="set-info" component={SetInfoScreen} />
        <Stack.Screen name="run" component={RunScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
