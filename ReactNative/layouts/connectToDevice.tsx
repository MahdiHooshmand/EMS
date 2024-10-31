import { PeripheralCard, PeripheralModel } from "../components/peripheralCard";
import {
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Animated,
} from "react-native";
import {
  background_color,
  button_background_color,
  button_text_color,
  placeholder_color,
  card_border_color,
  button_pressed_background_color,
  text_color,
  button_pressed_text_color,
} from "../assets/thems/colors";
import { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useFonts } from "expo-font";
import { FadeIn, FadeOut } from "../assets/thems/animations";

export const ConnectToDeviceScreen = ({ navigation }: any) => {
  const [loaded] = useFonts({
    fontText: require("../assets/fonts/OpenSans-Italic.ttf"),
  });

  const headerFadeIn = new FadeIn(0);
  const listFadeIn = new FadeIn(1);
  const buttonFadeIn = new FadeIn(2);
  const fadeOut = new FadeOut();

  const [isScanButtonPressed, setIsScanButtonPressed] = useState(false);
  const [isBackButtonPressed, setIsBackButtonPressed] = useState(false);
  const [peripheralDevices, setPeripheralDevices] = useState<PeripheralModel[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);
  const connections = [1, 2, 3, 0, 1, 2, 3, 1, 2, 3];

  useEffect(() => {
    if (loaded) {
      Animated.parallel([
        headerFadeIn.animate(),
        listFadeIn.animate(),
        buttonFadeIn.animate(),
      ]).start();
    }
  }, [loaded]);

  const handleScanDevice = () => {
    setIsLoading(true);
    const newDevices: PeripheralModel[] = connections.map(
      (connection, index) => {
        return new PeripheralModel(
          `Febina EMS 2502${index + 4}`,
          -50 + index * 10,
          connection,
        );
      },
    );

    newDevices.push(new PeripheralModel("hands free", -153, 0));
    setPeripheralDevices(newDevices);
    setIsLoading(false);
  };

  const handleBackPress = () => {
    fadeOut.animate().start(() => {
      navigation.replace("login");
    });
  };

  if (!loaded) {
    return <ActivityIndicator size="large" color={background_color} />;
  }

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
        <Animated.View
          style={[
            styles.header,
            {
              opacity: headerFadeIn.fadeAnim,
              translateY: headerFadeIn.translateY,
            },
          ]}
        >
          <Pressable
            style={styles.pressable}
            onPress={handleBackPress}
            onPressIn={() => setIsBackButtonPressed(true)}
            onPressOut={() => setIsBackButtonPressed(false)}
          >
            <Ionicons
              style={styles.icon}
              name="arrow-back-circle-outline"
              size={45}
              color={isBackButtonPressed ? button_background_color : text_color}
            />
          </Pressable>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Image
              style={styles.logo}
              resizeMode={"contain"}
              source={require("../assets/images/small-icon.png")}
            />
          </View>
          <View style={{ flex: 1 }} />
        </Animated.View>
        <Animated.View
          style={[
            styles.card,
            {
              opacity: listFadeIn.fadeAnim,
              translateY: listFadeIn.translateY,
            },
          ]}
        >
          {peripheralDevices.length === 0 ? (
            <Text style={styles.emptyMessage}>
              No devices found. Please click "Scan Device" to search for
              devices.
            </Text>
          ) : (
            <FlatList
              style={styles.list}
              data={peripheralDevices}
              renderItem={({ item }) => <PeripheralCard {...item} />}
              keyExtractor={(item) => item.name}
            />
          )}
        </Animated.View>
        <Animated.View
          style={[
            {
              opacity: buttonFadeIn.fadeAnim,
              translateY: buttonFadeIn.translateY,
            },
          ]}
        >
          <Pressable
            style={({ pressed }) => [
              styles.scanButton,
              pressed && styles.scanButtonPressed,
            ]}
            onPress={handleScanDevice}
          >
            <Text
              style={
                isScanButtonPressed
                  ? [styles.scanButtonText, styles.scanButtonTextPressed]
                  : styles.scanButtonText
              }
            >
              {isLoading ? "Scanning..." : "Scan Device"}
            </Text>
            <MaterialIcons
              name="bluetooth-searching"
              size={24}
              color={
                isScanButtonPressed
                  ? button_pressed_text_color
                  : button_text_color
              }
              style={styles.scanIcon}
            />
          </Pressable>
        </Animated.View>
      </Animated.View>
    </SafeAreaView>
  );
};

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
  header: {
    flexDirection: "row",
    width: "100%",
    height: 70,
    padding: 10,
    alignItems: "center",
  },
  logo: {
    width: 150,
    maxHeight: 60,
  },
  pressable: {
    borderRadius: 25,
    flex: 1,
  },
  icon: {
    alignSelf: "flex-start",
  },
  card: {
    width: "90%",
    flex: 1,
    borderWidth: 3,
    borderColor: card_border_color,
    borderRadius: 15,
    padding: 10,
    alignItems: "center",
  },
  scanButton: {
    marginTop: 20,
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: button_background_color,
    borderRadius: 30,
    flexDirection: "row",
  },
  scanButtonPressed: {
    backgroundColor: button_pressed_background_color,
  },
  scanButtonText: {
    fontFamily: "fontText",
    color: button_text_color,
    fontSize: 16,
  },
  scanButtonTextPressed: {
    color: button_pressed_text_color,
  },
  scanIcon: {
    marginLeft: 5,
  },
  emptyMessage: {
    fontFamily: "fontText",
    color: placeholder_color,
    fontSize: 16,
    textAlign: "center",
    marginVertical: 20,
  },
});
