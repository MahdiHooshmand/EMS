import { PeripheralCard } from "../components/peripheralCard";
import {
  PeripheralModel,
  FakePeripheralModel,
} from "../models/peripheralCardModel";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  Animated,
} from "react-native";
import {
  background_color,
  button_background_color,
  button_text_color,
  placeholder_color,
  button_pressed_background_color,
} from "../assets/thems/colors";
import { useEffect, useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { FadeIn, FadeOut } from "../assets/thems/animations";
import { Header } from "../components/header";
import { BorderBox } from "../components/borderBox";
import { OneButton } from "../components/footer";

export const ConnectToDeviceScreen = ({ navigation }: any) => {
  const headerFadeIn = new FadeIn(0);
  const listFadeIn = new FadeIn(1);
  const buttonFadeIn = new FadeIn(2);
  const fadeOut = new FadeOut();

  const [peripheralDevices, setPeripheralDevices] = useState<PeripheralModel[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    Animated.parallel([
      headerFadeIn.animate(),
      listFadeIn.animate(),
      buttonFadeIn.animate(),
    ]).start();
  }, []);

  const handleScanDevice = () => {
    setIsLoading(true);
    const newDevices = FakePeripheralModel();
    setPeripheralDevices(newDevices);
    setIsLoading(false);
  };

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
              renderItem={({ item }) => (
                <PeripheralCard
                  initialPeripheral={item}
                  navigation={navigation}
                />
              )}
              keyExtractor={(item) => item.name}
            />
          )}
        </BorderBox>
        <OneButton
          buttonFadeIn={buttonFadeIn}
          onPress={handleScanDevice}
          materialIconName={"bluetooth-searching"}
          text={"Scan Devices"}
        />
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
