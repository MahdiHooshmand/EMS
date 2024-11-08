// ConnectToDeviceScreenProps interface to define the props expected by the ConnectToDeviceScreen component.
import { PeripheralCard } from "../components/peripheralCard";
import { PeripheralModel } from "../models/peripheralCardModel";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  Animated,
} from "react-native";
import { background_color, placeholder_color } from "../assets/thems/colors";
import { useEffect, useRef, useState } from "react";
import { FadeIn, FadeOut } from "../assets/thems/animations";
import { Header } from "../components/header";
import { BorderBox } from "../components/borderBox";
import { OneButton } from "../components/footer";
import { initBle, scanForPeripherals } from "../utills/bluetooth";

/**
 * ConnectToDeviceScreenProps interface to define the props expected by the ConnectToDeviceScreen component.
 *
 * Props:
 * navigation: Object - The navigation object provided by React Navigation.
 *
 * State:
 */
export const ConnectToDeviceScreen = ({ navigation }: any) => {
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
  const headerFadeIn = new FadeIn(0);
  const listFadeIn = new FadeIn(1);
  const buttonFadeIn = new FadeIn(2);
  const fadeOut = new FadeOut();

  const peripheralDevicesRef = useRef<PeripheralModel[]>([]);

  const [peripheralDevices, setPeripheralDevices] = useState(
    peripheralDevicesRef.current,
  );

  useEffect(() => {
    console.log("peripheralDevicesRef.current updating.");
    setPeripheralDevices(peripheralDevicesRef.current);
    console.log("peripheralDevices updated");
  }, [peripheralDevicesRef.current]);

  const [isLoading, setIsLoading] = useState(false);

  /**
   * Effect hook to start the fade animation for the header, list, and button when the component mounts.
   * Use Animated. parallel to run the fade animations concurrently.
   */
  useEffect(() => {
    setIsLoading(true);
    Animated.parallel([
      headerFadeIn.animate(),
      listFadeIn.animate(),
      buttonFadeIn.animate(),
    ]).start(() => {
      initBle({
        peripheralsRef: peripheralDevicesRef,
        isScanning: isLoading,
        setIsScanning: setIsLoading,
      }).then(() => {
        setIsLoading(false);
      });
    });
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
        <Header
          headerFadeIn={headerFadeIn}
          fadeOut={fadeOut}
          backPage={"login"}
          navigation={navigation}
        />
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
                console.log("Rendering peripheral card: ", item.name);
                return (
                  <PeripheralCard
                    initialPeripheral={item}
                    fadeOut={fadeOut}
                    navigation={navigation}
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
