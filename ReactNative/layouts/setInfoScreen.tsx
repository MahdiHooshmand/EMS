import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Pressable,
  Animated,
  Image,
  TouchableOpacity,
} from "react-native";
import {
  background_color,
  button_background_color,
  button_pressed_background_color,
  button_text_color,
  card_background_color,
  card_text_color,
  input_text_color,
} from "../assets/thems/colors";
import RNPickerSelect from "react-native-picker-select";
import Slider from "@react-native-community/slider";
import { FadeIn, FadeOut } from "../assets/thems/animations";
import { Header } from "../components/header";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { EMS, TENS } from "../models/stimulateInfoModel";
import { OneButton } from "../components/footer";

interface Props {
  navigation: any;
  route: {
    params: {
      bodyPartName: string;
      source: any;
      stimulationType: "EMS" | "TENS";
    };
  };
}

interface PickerItem {
  label: string;
  value: number;
}

export const SetInfoScreen = ({ navigation, route }: Props) => {
  const { bodyPartName, source, stimulationType } = route.params;
  const containerFadeOut = new FadeOut();
  const headerAnimation = new FadeIn(0);
  const listAnimation = new FadeIn(1);
  const buttonFadeIn = new FadeIn(2);

  const [frequencyItems, setFrequencyItems] = useState<PickerItem[]>([]);
  const [pulseWidthItems, setPulseWidthItems] = useState<PickerItem[]>([]);
  const [frequency, setFrequency] = useState<number>(
    stimulationType === "EMS" ? 500 : 80,
  );
  const [pulseWidth, setPulseWidth] = useState<number>(
    stimulationType === "EMS" ? 300 : 200,
  );
  const [onTime, setOnTime] = useState<number>(1.0);
  const [offTime, setOffTime] = useState<number>(4.0);
  const [duration, setDuration] = useState<number>(5);

  useEffect(() => {
    if (stimulationType === "EMS") {
      setFrequencyItems(
        EMS.validFrequencies.map((frequency) => ({
          label: `${frequency} Hz`,
          value: frequency,
        })),
      );
      setPulseWidthItems(
        EMS.validPulseWidths.map((pulseWidth) => ({
          label: `${pulseWidth} us`,
          value: pulseWidth,
        })),
      );
    } else {
      setFrequencyItems(
        TENS.validFrequencies.map((frequency) => ({
          label: `${frequency} Hz`,
          value: frequency,
        })),
      );
      setPulseWidthItems(
        TENS.validPulseWidths.map((pulseWidth) => ({
          label: `${pulseWidth} us`,
          value: pulseWidth,
        })),
      );
    }
    Animated.parallel([
      headerAnimation.animate(),
      listAnimation.animate(),
      buttonFadeIn.animate(),
    ]).start();
  }, []);

  const handleStartProgram = () => {
    //code
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[styles.container, { opacity: containerFadeOut.fadeAnim }]}
      >
        <Header
          headerFadeIn={headerAnimation}
          fadeOut={containerFadeOut}
          backPage={"body-parts"}
          navigation={navigation}
        />
        <Animated.View
          style={[
            styles.card,
            {
              opacity: listAnimation.fadeAnim,
              translateY: listAnimation.translateY,
            },
          ]}
        >
          <Animated.ScrollView>
            <View style={styles.image_container}>
              <Image
                source={source}
                style={styles.image}
                resizeMode={"contain"}
              />
            </View>
            <Text style={styles.title}>
              {stimulationType} : {bodyPartName}
            </Text>
            <View style={styles.select_item_view}>
              <Text style={styles.select_item_text}>Frequency : </Text>
              <View style={styles.input_view}>
                <RNPickerSelect
                  onValueChange={setFrequency}
                  items={frequencyItems}
                  value={frequency}
                  style={{
                    inputIOS: styles.input,
                    inputAndroid: styles.input,
                  }}
                />
              </View>
            </View>
            <View style={styles.select_item_view}>
              <Text style={styles.select_item_text}>Pulse Width : </Text>
              <View style={styles.input_view}>
                <RNPickerSelect
                  onValueChange={setPulseWidth}
                  items={pulseWidthItems}
                  value={pulseWidth}
                  style={{
                    inputIOS: styles.input,
                    inputAndroid: styles.input,
                  }}
                />
              </View>
            </View>
            <View style={styles.select_item_view}>
              <Text style={styles.select_item_text}>On Time : </Text>
              <Text style={styles.slider_text}>{onTime.toFixed(1)} sec</Text>
            </View>
            <View style={styles.select_item_view}>
              <TouchableOpacity
                style={styles.inc_dec_button}
                onPress={() => {
                  const newValue = Math.round((onTime - 0.1) * 10) / 10;
                  if (newValue >= 0.1) {
                    setOnTime(newValue);
                  }
                }}
              >
                <MaterialIcons
                  name="remove-circle"
                  size={40}
                  color={button_background_color}
                />
              </TouchableOpacity>
              <Slider
                style={styles.slider}
                minimumValue={0.1}
                maximumValue={10}
                step={0.1}
                value={onTime}
                onValueChange={(value) => {
                  const newValue = Math.round(value * 10) / 10;
                  setOnTime(newValue);
                }}
                minimumTrackTintColor={button_pressed_background_color}
                maximumTrackTintColor={button_pressed_background_color}
                thumbTintColor={button_pressed_background_color}
              />
              <TouchableOpacity
                style={styles.inc_dec_button}
                onPress={() => {
                  const newValue = Math.round((onTime + 0.1) * 10) / 10;
                  if (newValue <= 10.0) {
                    setOnTime(newValue);
                  }
                }}
              >
                <MaterialIcons
                  name="add-circle"
                  size={40}
                  color={button_background_color}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.select_item_view}>
              <Text style={styles.select_item_text}>Off Time : </Text>
              <Text style={styles.slider_text}>{offTime.toFixed(1)} sec</Text>
            </View>
            <View style={styles.select_item_view}>
              <TouchableOpacity
                style={styles.inc_dec_button}
                onPress={() => {
                  const newValue = Math.round((offTime - 0.1) * 10) / 10;
                  if (newValue >= 0.1) {
                    setOffTime(newValue);
                  }
                }}
              >
                <MaterialIcons
                  name="remove-circle"
                  size={40}
                  color={button_background_color}
                />
              </TouchableOpacity>
              <Slider
                style={styles.slider}
                minimumValue={0.1}
                maximumValue={10}
                step={0.1}
                value={offTime}
                onValueChange={(value) => {
                  const newValue = Math.round(value * 10) / 10;
                  setOffTime(newValue);
                }}
                minimumTrackTintColor={button_pressed_background_color}
                maximumTrackTintColor={button_pressed_background_color}
                thumbTintColor={button_pressed_background_color}
              />
              <TouchableOpacity
                style={styles.inc_dec_button}
                onPress={() => {
                  const newValue = Math.round((offTime + 0.1) * 10) / 10;
                  if (newValue <= 10.0) {
                    setOffTime(newValue);
                  }
                }}
              >
                <MaterialIcons
                  name="add-circle"
                  size={40}
                  color={button_background_color}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.select_item_view}>
              <Text style={styles.select_item_text}>Duration : </Text>
              <Text style={styles.slider_text}>{duration.toFixed(0)} min</Text>
            </View>
            <View style={styles.select_item_view}>
              <TouchableOpacity
                style={styles.inc_dec_button}
                onPress={() => {
                  const newValue = Math.round(duration - 1);
                  if (newValue >= 1) {
                    setDuration(newValue);
                  }
                }}
              >
                <MaterialIcons
                  name="remove-circle"
                  size={40}
                  color={button_background_color}
                />
              </TouchableOpacity>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={60}
                step={1}
                value={duration}
                onValueChange={(value) => {
                  const newValue = Math.round(value);
                  setDuration(newValue);
                }}
                minimumTrackTintColor={button_pressed_background_color}
                maximumTrackTintColor={button_pressed_background_color}
                thumbTintColor={button_pressed_background_color}
              />
              <TouchableOpacity
                style={styles.inc_dec_button}
                onPress={() => {
                  const newValue = Math.round(duration + 1);
                  if (newValue <= 60) {
                    setDuration(newValue);
                  }
                }}
              >
                <MaterialIcons
                  name="add-circle"
                  size={40}
                  color={button_background_color}
                />
              </TouchableOpacity>
            </View>
          </Animated.ScrollView>
        </Animated.View>
        <OneButton
          buttonFadeIn={buttonFadeIn}
          onPress={handleStartProgram}
          materialIconName={"play-arrow"}
          text={"START"}
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
  startButton: {
    marginTop: 20,
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: button_background_color,
    borderRadius: 30,
    flexDirection: "row",
  },
  startButtonPressed: {
    backgroundColor: button_pressed_background_color,
  },
  startButtonText: {
    fontFamily: "fontText",
    color: button_text_color,
    fontSize: 16,
  },
  startIcon: {
    marginLeft: 5,
  },
  image: {
    marginTop: 10,
    flex: 1,
  },
  image_container: {
    aspectRatio: 1.0,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: card_background_color,
    borderRadius: 10,
    padding: 15,
    width: "90%",
    flex: 1,
  },
  title: {
    fontFamily: "fontHeader",
    fontSize: 20,
    textAlign: "center",
    color: card_text_color,
    margin: 10,
  },
  select_item_view: {
    flexDirection: "row",
    alignItems: "center",
    margin: 5,
  },
  select_item_text: {
    fontFamily: "fontText",
    fontSize: 15,
    color: card_text_color,
    flex: 1,
  },
  input_view: {
    flex: 1.5,
    backgroundColor: button_background_color,
    borderRadius: 10,
  },
  input: {
    color: input_text_color,
  },
  slider: {
    flex: 1.5,
  },
  slider_text: {
    fontFamily: "errorFont",
    fontSize: 15,
    color: card_text_color,
    flex: 1.5,
    marginTop: 10,
    marginLeft: 15,
  },
  inc_dec_button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
