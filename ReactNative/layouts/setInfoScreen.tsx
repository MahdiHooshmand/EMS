// SetInfoScreen component is responsible for displaying the stimulation settings for a specific body part.
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Animated,
  Image,
} from "react-native";
import { background_color, card_text_color } from "../assets/thems/colors";
import { FadeIn, FadeOut } from "../assets/thems/animations";
import { Header } from "../components/header";
import { Electrotherapy, EMS, TENS } from "../models/stimulateInfoModel";
import { OneButton } from "../components/footer";
import { Combo, Seekbar } from "../components/formComponents";
import { CardView } from "../components/card";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";

type Props = NativeStackScreenProps<RootStackParamList, "set-info">;

/**
 * Frequency and pulse width items for the EMS and TENS stimulation types.
 */
interface PickerItem {
  label: string;
  value: number;
}

/**
 * SetInfoScreen component is responsible for displaying the stimulation settings for a specific body part.
 * It includes a header, form components for frequency, pulse width, on time, off time, and duration,
 * a card view for the selected body part, and a footer with a start button.
 *
 * Props:
 * - navigation: The navigation object used to navigate between screens.
 */
export const SetInfoScreen = ({ navigation, route }: Props) => {
  /**
   * Get the body part name, source, and stimulation type from the route params.
   * Set up the necessary state variables for frequency, pulse width, on time, off time, and duration.
   * Set up the animation objects for container fade out, header animation, and list animation.
   * Initialize the state variables for isStarting.
   * Fetch the frequency and pulse width items based on the stimulation type.
   * Apply the necessary animations when the component mounts.
   *
   * Props:
   * - navigation: The navigation object used to navigate between screens.
   * - route: The route object containing the body part name, source, and stimulation type.
   * - stimulationType: The type of stimulation (EMS or TENS).
   *
   * Return:
   * - None.
   *
   * Note: This component uses the Animated API for animations.
   */
  const { bodyPartName, source, stimulationType, peripheral } = route.params;
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
  const [isStarting, setIsStarting] = useState(false);

  // Apply the necessary animations when the component mounts.
  useEffect(() => {
    setFrequencyItems(
      (stimulationType === "EMS" ? EMS : TENS).validFrequencies.map(
        (frequency) => ({ label: `${frequency} Hz`, value: frequency }),
      ),
    );
    setPulseWidthItems(
      (stimulationType === "EMS" ? EMS : TENS).validPulseWidths.map(
        (pulseWidth) => ({ label: `${pulseWidth} µs`, value: pulseWidth }),
      ),
    );

    Animated.parallel([
      headerAnimation.animate(),
      listAnimation.animate(),
      buttonFadeIn.animate(),
    ]).start();
  }, []);

  /**
   * Handle the frequency and pulse width selection.
   * Initiates the start of the electrotherapy program.
   */
  const handleStartProgram = () => {
    if (isStarting) return;
    const data = new Electrotherapy(
      bodyPartName,
      frequency,
      pulseWidth,
      stimulationType,
      onTime,
      offTime,
      duration,
    );
    setIsStarting(true);
    setTimeout(() => {
      containerFadeOut.animate().start(() => {
        navigation.replace("run", {
          data: data,
          source: source,
          peripheral: peripheral,
        });
      });
    }, 1000);
  };

  // Render the SetInfoScreen component.
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
          isWaiting={isStarting}
        />
      </Animated.View>
    </SafeAreaView>
  );
};

/**
 * Styles for the SetInfoScreen component.
 * Includes the container, image, title, and form components.
 *
 * Styles:
 * - container: Sets the flex to 1, background color, and center alignment.
 * - image: Sets the aspect ratio, width, and center alignment.
 */
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
  title: {
    fontFamily: "fontHeader",
    fontSize: 20,
    textAlign: "center",
    color: card_text_color,
    margin: 10,
  },
});
