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
import { FadeIn } from "../assets/thems/animations";
import { PeripheralModel } from "../models/peripheralCardModel";

interface Props {
  initialPeripheral: PeripheralModel;
  navigation: any;
}

export const PeripheralCard = ({ initialPeripheral, navigation }: Props) => {
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
        navigation.replace("connect-to-device");
      }, 2000);
    }, 2000);
  };

  return (
    <Animated.View
      style={[
        peripheral.isValid
          ? peripheral.connection === 1
            ? styles.validCard
            : [styles.validCard, { backgroundColor: ble_connecting_background }]
          : styles.inValidCard,
        {
          opacity: cardFadeIn.fadeAnim,
          translateY: cardFadeIn.translateY,
        },
      ]}
    >
      <View
        style={
          peripheral.isValid
            ? peripheral.connection === 1
              ? styles.status_ready
              : peripheral.connection === 2
                ? styles.status_connecting
                : styles.status_verifying
            : styles.inValidStatus
        }
      ></View>
      <View style={styles.Container}>
        <View style={styles.nameContainer}>
          {peripheral.isValid ? (
            <Text style={styles.validName}>
              {"Febina EMS\n" + peripheral.name.slice(10)}
            </Text>
          ) : (
            <Text style={styles.inValidName}>{peripheral.name}</Text>
          )}
        </View>
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
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  validCard: {
    backgroundColor: card_background_color,
    alignItems: "center",
    alignSelf: "center",
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 40,
    borderTopRightRadius: 40,
    margin: 5,
    height: 80,
    flexDirection: "row",
  },
  inValidCard: {
    backgroundColor: card_background_invalid_color,
    alignItems: "center",
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 40,
    borderTopRightRadius: 40,
    margin: 5,
    height: 80,
    flexDirection: "row",
    alignSelf: "center",
  },
  status_ready: {
    backgroundColor: ble_ready_to_connect,
    width: 4,
    height: 60,
    margin: 20,
    borderRadius: 2,
    alignContent: "flex-start",
  },
  status_connecting: {
    backgroundColor: ble_connecting,
    width: 4,
    height: 60,
    margin: 20,
    borderRadius: 2,
    alignContent: "flex-start",
  },
  status_verifying: {
    backgroundColor: ble_verifying,
    width: 4,
    height: 60,
    margin: 20,
    borderRadius: 2,
    alignContent: "flex-start",
  },
  inValidStatus: {
    backgroundColor: ble_cant_connect,
    width: 4,
    height: 60,
    margin: 20,
    borderRadius: 2,
    alignContent: "flex-start",
  },
  Container: {
    alignSelf: "center",
    flex: 1,
    marginRight: 15,
    height: 60,
    flexDirection: "row",
    justifyContent: "flex-end",
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
  inValidIcon: {
    borderRadius: 25,
  },
});
