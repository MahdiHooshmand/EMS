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

interface Props {
  navigation: any;
  route: any;
}

export const SetInfoScreen = ({ navigation, route }: Props) => {
  const { bodyPartName, source, stimulationType } = route.params;
  const containerFadeOut = new FadeOut();
  const headerAnimation = new FadeIn(0);
  const listAnimation = new FadeIn(1);
  const buttonFadeIn = new FadeIn(2);

  const [frequency, setFrequency] = useState(500);
  const [pulseWidth, setPulseWidth] = useState(300);
  const [onTime, setOnTime] = useState(1.0);
  const [offTime, setOffTime] = useState(4.0);
  const [duration, setDuration] = useState(5);

  let data;
  if (stimulationType === "EMS") {
    setFrequency(500);
    setPulseWidth(300);
    data = new EMS(bodyPartName, frequency, pulseWidth, 1.0, 4.0, 5);
  } else {
    setFrequency(80);
    setPulseWidth(200);
    data = new TENS(bodyPartName, frequency, pulseWidth, 1.0, 4.0, 5);
  }

  useEffect(() => {
    Animated.parallel([
      headerAnimation.animate(),
      listAnimation.animate(),
      buttonFadeIn.animate(),
    ]).start();
  }, []);

  const handleStartProgram = () => {};

  const frequencyItems = data.validFrequencies.map((frequency) => ({
    label: `${frequency} Hz`,
    value: frequency,
  }));

  const pulseWidthItems = data.validPulseWidths.map((frequency) => ({
    label: `${frequency} us`,
    value: frequency,
  }));

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
                  onValueChange={(value) => (data.frequency = value)}
                  items={frequencyItems}
                  value={data.frequency}
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
                  onValueChange={(value) => (data.pulseWidth = value)}
                  items={pulseWidthItems}
                  value={data.pulseWidth}
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
                    data.onTime = newValue;
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
                  data.onTime = newValue;
                  setOnTime(newValue);
                }}
              />
              <TouchableOpacity
                style={styles.inc_dec_button}
                onPress={() => {
                  const newValue = Math.round((onTime + 0.1) * 10) / 10;
                  if (newValue <= 10.0) {
                    setOnTime(newValue);
                    data.onTime = newValue;
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
                    data.offTime = newValue;
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
                  data.offTime = newValue;
                  setOffTime(newValue);
                }}
              />
              <TouchableOpacity
                style={styles.inc_dec_button}
                onPress={() => {
                  const newValue = Math.round((offTime + 0.1) * 10) / 10;
                  if (newValue <= 10.0) {
                    setOffTime(newValue);
                    data.offTime = newValue;
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
                    data.duration = newValue;
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
                  data.duration = newValue;
                  setDuration(newValue);
                }}
              />
              <TouchableOpacity
                style={styles.inc_dec_button}
                onPress={() => {
                  const newValue = Math.round(duration + 1);
                  if (newValue <= 60) {
                    setDuration(newValue);
                    data.duration = newValue;
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
              styles.startButton,
              pressed && styles.startButtonPressed,
            ]}
            onPress={handleStartProgram}
          >
            <Text style={styles.startButtonText}>START</Text>
            <MaterialIcons
              name="play-arrow"
              size={24}
              color={button_text_color}
              style={styles.startIcon}
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
