// ConnectToDeviceScreenProps interface to define the props expected by the ConnectToDeviceScreen component.
import { PeripheralCard } from "../components/peripheralCard";
import { PeripheralModel } from "../models/peripheralCardModel";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  Animated,
  BackHandler,
} from "react-native";
import { background_color, placeholder_color } from "../assets/thems/colors";
import { useEffect, useRef, useState } from "react";
import { FadeIn, FadeOut } from "../assets/thems/animations";
import { Header } from "../components/header";
import { BorderBox } from "../components/borderBox";
import { OneButton } from "../components/footer";
import {
  disconnectAll,
  initAuth,
  scanForPeripherals,
  stopScanning,
} from "../utills/auth";
import { RootStackParamList } from "../App";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<RootStackParamList, "connect-to-device">;

/**
 * ConnectToDeviceScreenProps interface to define the props expected by the ConnectToDeviceScreen component.
 *
 * Props:
 * navigation: Object - The navigation object provided by React Navigation.
 * route: Object - The route object provided by React Navigation.
 *
 * State:
 */
export const ConnectToDeviceScreen = ({ navigation, route }: Props) => {
  /**
   * State variables to hold the fade animation values for the header, list, and button.
   * fadeAnim: Animated value to control the opacity of the header.
   * listAnim: Animated value to control the opacity of the list.
   * buttonAnim: Animated value to control the opacity of the button.
   *
   * Initialize the state variables for the peripheral devices and loading status.
   * peripheralDevices: Array of PeripheralModel objects representing the discovered devices.
   * isLoading: Boolean to indicate whether the device scan is in progress.
   *
   * Set the initial values for peripheralDevices and isLoading.
   */
  const { user, pass } = route.params;
  const headerFadeIn = new FadeIn(0);
  const listFadeIn = new FadeIn(1);
  const buttonFadeIn = new FadeIn(2);
  const fadeOut = new FadeOut();

  const [peripheralDevices, setPeripheralDevices] = useState<PeripheralModel[]>(
    [],
  );
  const peripheralDevicesRef = useRef(peripheralDevices);

  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handles the back action when the hardware back button is pressed.
   * Stops scanning for peripherals, disconnects all devices, and navigates back to the login screen.
   *
   * @returns {boolean} - Always returns true to indicate that the back action has been handled.
   */
  const backAction = (): boolean => {
    stopScanning().then(() => {
      disconnectAll().then(() => {
        fadeOut.animate().start(() => {
          navigation.replace("login");
        });
      });
    });
    return true;
  };

  /**
   * useEffect hook to handle the initialization and cleanup of the ConnectToDeviceScreen component.
   * It sets the loading state, starts animations, initializes authentication, and manages the back button handler.
   *
   * @returns {void} - This hook does not return a value.
   */
  useEffect(() => {
    setIsLoading(true);

    Animated.parallel([
      headerFadeIn.animate(),
      listFadeIn.animate(),
      buttonFadeIn.animate(),
    ]).start(() => {
      initAuth({
        peripheralsRef: peripheralDevicesRef,
        setPeripherals: setPeripheralDevices,
        isScanning: isLoading,
        setIsScanning: setIsLoading,
      }).then(() => {
        setIsLoading(false);
      });
    });

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );

    return () => {
      backHandler.remove();
    };
  }, []);

  /**
   * Render the ConnectToDeviceScreen component.
   * Display the header, list, and button with the appropriate fade animations.
   * If the isLoading state is true, display a loading indicator.
   */
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
        <Header headerFadeIn={headerFadeIn} handleBackPress={backAction} />
        <BorderBox fadeAnim={listFadeIn}>
          {peripheralDevices.length === 0 ? (
            <Text style={styles.emptyMessage}>
              No devices found. Please click "Scan Device" to search for
              devices.
            </Text>
          ) : (
            <FlatList
              style={styles.list}
              data={peripheralDevices}
              renderItem={({ item }) => {
                return (
                  <PeripheralCard
                    initialPeripheral={item}
                    fadeOut={fadeOut}
                    navigation={navigation}
                    user={user}
                    pass={pass}
                  />
                );
              }}
              keyExtractor={(item) => item.name}
            />
          )}
        </BorderBox>
        <OneButton
          buttonFadeIn={buttonFadeIn}
          onPress={scanForPeripherals}
          materialIconName={"bluetooth-searching"}
          text={"Scan Devices"}
          isWaiting={isLoading}
        />
      </Animated.View>
    </SafeAreaView>
  );
};

/**
 * Styles for the ConnectToDeviceScreen component.
 * Includes the container, list, and empty message styles.
 *
 * Styles:
 * - container: Sets the flex to 1, background color, and center alignment.
 * - list: Sets the width to 100%.
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: background_color,
    alignItems: "center",
    width: "100%",
  },
  list: {
    width: "100%",
  },
  emptyMessage: {
    fontFamily: "fontText",
    color: placeholder_color,
    fontSize: 16,
    textAlign: "center",
    marginVertical: 20,
  },
});
