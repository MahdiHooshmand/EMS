// Render the BodyPartsScreen component
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import {
  card_background_invalid_color,
  ble_connecting,
  ble_ready_to_connect,
  ble_verifying,
  ble_cant_connect,
  card_background_color,
  card_text_color,
  button_pressed_background_color,
  ble_connecting_background,
} from "../assets/thems/colors";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useEffect } from "react";
import { FadeIn, FadeOut } from "../assets/thems/animations";
import { PeripheralModel } from "../models/peripheralCardModel";
import { connectPeripheral } from "../utills/bluetooth";

/*
 * Type definition for CardStyle
 *
 * This type defines the style properties for the card component. It includes
 * background colors, border radii, margins, and heights. The opacity and transform
 * properties are used for animations.
 */
type CardStyle = {
  backgroundColor: string;
  alignItems: "center";
  borderBottomLeftRadius: number;
  borderTopLeftRadius: number;
  borderBottomRightRadius: number;
  borderTopRightRadius: number;
  margin: number;
  height: number;
  flexDirection: "row";
  opacity: Animated.Value;
  transform: { translateY: Animated.Value }[];
};

/*
 * Type definition for Props
 *
 * This type defines the props for the PeripheralCard component. It includes
 * initial peripheral card data, fadeOut animation instance, and navigation prop.
 *
 * Props:
 */
interface Props {
  initialPeripheral: PeripheralModel;
  fadeOut: FadeOut;
  navigation: any;
}

/**
 * Peripheral Card component
 *
 * This component represents a card for a peripheral device, displaying its status,
 * name, and connection options. It includes animations and handles user interactions
 * for connecting to the peripheral.
 *
 * Props:
 * - initialPeripheral: Initial peripheral card data
 * - fadeOut: FadeOut animation instance
 * - navigation: Navigation prop to navigate to the body parts screen
 */
export const PeripheralCard = ({
  initialPeripheral,
  fadeOut,
  navigation,
}: Props) => {
  // State to manage the peripheral data
  const peripheral = initialPeripheral;
  const cardFadeIn = new FadeIn(0);

  // Effect to start the fade-in animation when the component mounts
  useEffect(() => {
    cardFadeIn.animate().start();
  }, []);

  /**
   * Initiates the connection process to the peripheral.
   * Updates the peripheral's connection status and navigates to the body parts screen upon success.
   */
  const connect = () => {
    connectPeripheral(peripheral).then();
  };

  /**
   * Returns the style for the card based on its validity and connection status.
   *
   * @param isValid - Boolean indicating if the peripheral is valid
   * @param connection - Connection status of the peripheral
   * @returns CardStyle - The style object for the card
   */
  const getCardStyle = (isValid: boolean, connection: number): CardStyle => ({
    backgroundColor: isValid
      ? connection === 1
        ? card_background_color
        : ble_connecting_background
      : card_background_invalid_color,
    alignItems: "center",
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 40,
    borderTopRightRadius: 40,
    margin: 5,
    height: 80,
    flexDirection: "row",
    opacity: cardFadeIn.fadeAnim,
    transform: [{ translateY: cardFadeIn.translateY }],
  });

  /**
   * Returns the style for the status indicator based on the peripheral's validity and connection status.
   *
   * @param isValid - Boolean indicating if the peripheral is valid
   * @param connection - Connection status of the peripheral
   * @returns Object - The style object for the status indicator
   */
  const getStatusStyle = (isValid: boolean, connection: number) => ({
    width: 4,
    height: 60,
    margin: 20,
    borderRadius: 2,
    backgroundColor: isValid
      ? connection === 1
        ? ble_ready_to_connect
        : connection === 2
          ? ble_connecting
          : ble_verifying
      : ble_cant_connect,
  });

  /**
   * Component to display the name of the peripheral.
   * The style changes based on the validity of the peripheral.
   */
  const NameContainer = () => {
    return (
      <View style={styles.nameContainer}>
        <Text
          style={peripheral.isValid ? styles.validName : styles.inValidName}
        >
          {peripheral.isValid
            ? "Febina EMS\n" + peripheral.name.slice(10)
            : peripheral.name}
        </Text>
      </View>
    );
  };

  /**
   * Component to display the add icon or activity indicator based on the connection status.
   * Handles user interaction for initiating a connection.
   */
  const AddIconContainer = () => {
    return (
      <View style={styles.addIconContainer}>
        {peripheral.connection === 2 || peripheral.connection === 3 ? (
          <ActivityIndicator size="large" color={card_text_color} />
        ) : peripheral.isValid ? (
          <Pressable
            onPress={connect}
            style={({ pressed }) => [
              pressed ? styles.addIconPressed : styles.addIcon,
            ]}
          >
            <SimpleLineIcons name={"plus"} size={50} color={card_text_color} />
          </Pressable>
        ) : (
          <Pressable style={styles.inValidIcon}>
            <SimpleLineIcons
              name={"question"}
              size={50}
              color={card_text_color}
            />
          </Pressable>
        )}
      </View>
    );
  };

  // Render the peripheral card
  return (
    <Animated.View
      style={getCardStyle(peripheral.isValid, peripheral.connection)}
    >
      <View style={getStatusStyle(peripheral.isValid, peripheral.connection)} />
      <View style={styles.Container}>
        <NameContainer />
        <MaterialCommunityIcons
          style={styles.signalIcon}
          name={
            peripheral.quality > -50
              ? "signal-cellular-3"
              : peripheral.quality > -100
                ? "signal-cellular-2"
                : peripheral.quality > -150
                  ? "signal-cellular-1"
                  : "signal-cellular-outline"
          }
          size={24}
          color={card_text_color}
        />
        <AddIconContainer />
      </View>
    </Animated.View>
  );
};

/*
 * Style definitions for the PeripheralCard component
 */
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    marginRight: 15,
    height: 60,
    flexDirection: "row",
    alignItems: "center",
  },
  signalIcon: {
    marginRight: 12,
  },
  nameContainer: {
    flex: 1,
    alignItems: "flex-start",
  },
  validName: {
    fontFamily: "fontHeader",
    fontSize: 20,
    textAlign: "center",
    color: card_text_color,
  },
  inValidName: {
    fontFamily: "errorFont",
    fontSize: 16,
    textAlign: "center",
    color: card_text_color,
  },
  addIcon: {
    borderRadius: 25,
  },
  addIconPressed: {
    backgroundColor: button_pressed_background_color,
    borderRadius: 25,
  },
  addIconContainer: {
    width: 52,
    height: 52,
    justifyContent: "center",
  },
  inValidIcon: {
    borderRadius: 25,
  },
});
