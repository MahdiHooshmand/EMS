import { PeripheralCard } from "../components/peripheralCard";
import {
  PeripheralModel,
  FakePeripheralModel,
} from "../models/peripheralCardModel";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  Animated,
  ActivityIndicator,
  View,
} from "react-native";
import {
  background_color,
  button_text_color,
  placeholder_color,
} from "../assets/thems/colors";
import { useEffect, useState } from "react";
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
    setTimeout(() => {
      const newDevices = FakePeripheralModel();
      setPeripheralDevices(newDevices);
      setIsLoading(false);
    }, 2000);
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
        {isLoading ? (
          <View style={styles.indicatorView}>
            <ActivityIndicator size="large" color={button_text_color} />
          </View>
        ) : (
          <OneButton
            buttonFadeIn={buttonFadeIn}
            onPress={handleScanDevice}
            materialIconName={"bluetooth-searching"}
            text={"Scan Devices"}
          />
        )}
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
  emptyMessage: {
    fontFamily: "fontText",
    color: placeholder_color,
    fontSize: 16,
    textAlign: "center",
    marginVertical: 20,
  },
  indicatorView: {
    margin: 24,
    justifyContent: "center",
  },
});
