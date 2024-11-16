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
import { Electrotherapy } from "./models/stimulateInfoModel";
import { PeripheralModel } from "./models/peripheralCardModel";

/**
 * Prevents the splash screen from automatically hiding after it is shown.
 * This function is useful when you want to control when the splash screen is hidden manually.
 *
 * @returns {Promise<void>} - A promise that resolves when the splash screen is prevented from auto-hiding.
 *
 */
SplashScreen.preventAutoHideAsync().then();

/**
 * Type definition for the root stack navigator parameters.
 * Defines the screens and their associated parameters in the app.
 */
export type RootStackParamList = {
  /**
   * Login screen.
   * No parameters are required for this screen.
   */
  login: undefined;

  /**
   * Connect to device screen.
   * Requires a user name and password as parameters.
   */
  "connect-to-device": {
    user: string;
    pass: string;
  };

  /**
   * Body parts screen.
   * Requires a peripheral model as a parameter.
   */
  "body-parts": {
    peripheral: PeripheralModel;
  };

  /**
   * Set info screen.
   * Requires a source, peripheral model, and electrotherapy data as parameters.
   */
  "set-info": {
    source: any;
    peripheral: PeripheralModel;
    data: Electrotherapy;
  };

  /**
   * Run screen.
   * Requires electrotherapy data, a source, and a peripheral model as parameters.
   */
  run: {
    data: Electrotherapy;
    source: any;
    peripheral: PeripheralModel;
  };
};

/**
 * Creates a native stack navigator component with the specified root stack parameter list.
 *
 * @template TParamList - The type definition for the root stack navigator parameters.
 *
 * A React component representing the native stack navigator.
 *
 *
 * @remarks
 * This function is used to create a stack navigator component for the app,
 * allowing navigation between different screens. The `RootStackParamList` type
 * defines the screens and their associated parameters in the app.
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  /**
   * A custom hook that loads specified fonts from the Expo Google Fonts package.
   *
   * @returns {boolean[]} - An array containing a single boolean value indicating whether all fonts have been loaded.
   *
   *
   * @remarks
   * This hook is used to load custom fonts from the Expo Google Fonts package.
   * The `useFonts` hook takes an object of font names and their corresponding font families as parameters.
   * It returns an array containing a single boolean value indicating whether all fonts have been loaded.
   * In the example above, the `useFonts` hook is used to load five custom fonts and store the result in the `fontsLoaded` variable.
   * The `fontsLoaded` variable can then be used to conditionally render components or perform other actions based on the font loading status.
   */
  const [fontsLoaded] = useFonts({
    fontTitle: OpenSans.OpenSans_700Bold_Italic,
    errorFont: OpenSans.OpenSans_300Light,
    fontHeader: OpenSans.OpenSans_500Medium_Italic,
    fontText: OpenSans.OpenSans_400Regular_Italic,
    stopText: OpenSans.OpenSans_700Bold,
  });

  /**
   * A custom hook that handles the hiding of the splash screen when fonts are loaded.
   *
   * @returns {null | JSX.Element} - Returns null if fonts are not loaded, otherwise renders the navigation container.
   *
   * @remarks
   * This hook is used to conditionally hide the splash screen when all custom fonts have been loaded.
   * It listens to the `fontsLoaded` state and calls the `SplashScreen.hideAsync()` method when fonts are loaded.
   * If fonts are not loaded, it returns null, preventing any components from rendering until fonts are ready.
   * If fonts are loaded, it renders the navigation container with the specified stack navigator.
   *
   */
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().then();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  /**
   * The main application component that renders the navigation container and screens.
   *
   * @returns {JSX.Element} - A React component representing the navigation container and screens.
   *
   * @remarks
   * This component is responsible for rendering the navigation container and screens in the app.
   * It uses the `NavigationContainer` component from `@react-navigation/native` to manage the navigation state.
   * The component also includes a `StatusBar` component to customize the status bar appearance.
   * The navigation stack is defined using the `createNativeStackNavigator` function from `@react-navigation/native-stack`.
   * The stack navigator is configured with screen options, such as hiding the header and disabling animations.
   * Each screen in the stack navigator is defined using the `Stack.Screen` component, specifying the screen name and component.
   */
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
