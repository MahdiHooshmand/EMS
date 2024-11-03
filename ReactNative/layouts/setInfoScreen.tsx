import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Animated,
  Image,
} from "react-native";
import {
  background_color,
  card_background_color,
  card_text_color,
} from "../assets/thems/colors";
import { FadeIn, FadeOut } from "../assets/thems/animations";
import { Header } from "../components/header";
import { EMS, TENS } from "../models/stimulateInfoModel";
import { OneButton } from "../components/footer";
import { Combo, Seekbar } from "../components/formComponents";
import { CardView } from "../components/card";

interface Props {
  navigation: any;
  route: any;
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
    let data;
    if (stimulationType === "EMS") {
      data = new EMS(
        bodyPartName,
        frequency,
        pulseWidth,
        onTime,
        offTime,
        duration,
      );
    } else {
      data = new TENS(
        bodyPartName,
        frequency,
        pulseWidth,
        onTime,
        offTime,
        duration,
      );
    }
    containerFadeOut.animate().start(() => {
      navigation.replace("run", { data: data, source: source });
    });
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
        <CardView fadeInAnim={listAnimation}>
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
            <Combo
              text={"Frequency : "}
              onValueChange={setFrequency}
              items={frequencyItems}
              value={frequency}
            />
            <Combo
              text={"Pulse Width : "}
              onValueChange={setPulseWidth}
              items={pulseWidthItems}
              value={pulseWidth}
            />
            <Seekbar
              title={"On Time : "}
              valueText={`${onTime.toFixed(1)} sec`}
              value={onTime}
              setValue={setOnTime}
              step={0.1}
              min={0.1}
              max={10}
            />
            <Seekbar
              title={"Off Time : "}
              valueText={`${offTime.toFixed(1)} sec`}
              value={offTime}
              setValue={setOffTime}
              step={0.1}
              min={0.1}
              max={10}
            />
            <Seekbar
              title={"Duration : "}
              valueText={`${duration.toFixed(0)} min`}
              value={duration}
              setValue={setDuration}
              step={1}
              min={1}
              max={60}
            />
          </Animated.ScrollView>
        </CardView>
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
});
