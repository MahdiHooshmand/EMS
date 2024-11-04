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
import { useEffect, useState } from "react";
import { FadeIn, FadeOut } from "../assets/thems/animations";
import { PeripheralModel } from "../models/peripheralCardModel";

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

interface Props {
  initialPeripheral: PeripheralModel;
  fadeOut: FadeOut;
  navigation: any;
}

export const PeripheralCard = ({
  initialPeripheral,
  fadeOut,
  navigation,
}: Props) => {
  const [peripheral, setPeripheral] = useState(initialPeripheral);
  const cardFadeIn = new FadeIn(0);

  useEffect(() => {
    cardFadeIn.animate().start();
  }, []);

  const connect = () => {
    setPeripheral((prev) => ({
      ...prev,
      connection: 2,
    }));
    setTimeout(() => {
      setPeripheral((prev) => ({
        ...prev,
        connection: 3,
      }));
      setTimeout(() => {
        fadeOut.animate().start(() => {
          navigation.navigate("body-parts");
        });
      }, 2000);
    }, 2000);
  };

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
