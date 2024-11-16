// Define the styles for the Login component
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Animated,
  FlatList,
  View,
  BackHandler,
} from "react-native";
import { Header } from "../components/header";
import { BorderBox } from "../components/borderBox";
import { FadeIn, FadeOut } from "../assets/thems/animations";
import { background_color } from "../assets/thems/colors";
import { BodyPartCard, fetchBodyParts } from "../components/bodyPartItem";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { MuscleName } from "../models/stimulateInfoModel";
import { disconnectAll } from "../utills/auth";

/**
 * Fetch body parts data from a remote API or local storage.
 *
 * Returns:
 * - An array of body part data.
 */
export interface BodyPartData {
  id: number;
  name: MuscleName;
  source: any;
}

type Props = NativeStackScreenProps<RootStackParamList, "body-parts">;

/**
 * BodyPartsScreen component is responsible for displaying a list of body parts and allowing the user to select one.
 * It includes a header with a back button, a body with a list of body parts, and a footer with a start button.
 *
 * Props:
 * - navigation: The navigation object used to navigate between screens.
 */
export const BodyPartsScreen = ({ navigation, route }: Props) => {
  const { peripheral } = route.params;
  const headerAnimation = new FadeIn(0);
  const listAnimation = new FadeIn(1);
  const containerFadeOut = new FadeOut();

  const [bodyPartList, setBodyPartList] = useState<BodyPartData[]>([]);

  /**
   * Handles the back action when the user attempts to navigate back from the BodyPartsScreen.
   * This function disconnects all peripherals, animates the container fade out,
   * and then navigates back to the login screen.
   *
   * @returns {boolean} Always returns true to indicate that the back action has been handled.
   */
  const backAction = (): boolean => {
    disconnectAll().then(() => {
      containerFadeOut.animate().start(() => {
        navigation.replace("login");
      });
    });
    return true;
  };

  /**
   * Sets up the body part list and handles hardware back button press.
   *
   * This effect runs once when the component mounts. It performs two main tasks:
   * 1. Fetches and sets the list of body parts.
   * 2. Adds a listener for the hardware back button press.
   *
   * @effect
   * @param {Function} setBodyPartList - Function to update the body part list state.
   * @param {Function} fetchBodyParts - Function to fetch the list of body parts.
   * @param {Function} backAction - Function to handle the back button press.
   * @param {Object} BackHandler - React Native's BackHandler API.
   *
   * @returns {Function} Cleanup function that removes the back button event listener.
   */
  useEffect(() => {
    setBodyPartList(fetchBodyParts());

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );

    return () => {
      backHandler.remove();
    };
  }, []);

  // Apply the animations when the body part list changes or when the component mounts
  useEffect(() => {
    if (bodyPartList.length > 0) {
      Animated.parallel([
        headerAnimation.animate(),
        listAnimation.animate(),
      ]).start();
    }
  }, [bodyPartList]);

  /**
   * Render the BodyPartsScreen component with the fetched body part list.
   *
   * Returns:
   * - A SafeAreaView containing the Header, BorderBox, and FlatList components.
   * - The Header component includes a back button.
   * - The BorderBox component includes a fade-in animation.
   * - The FlatList component displays a list of body parts with BodyPartCard components.
   * - The View component at the bottom of the screen is used as a footer.
   *
   * Props:
   * - navigation: The navigation object used to navigate between screens.
   * - headerAnimation: An instance of the FadeIn animation for the header.
   * - listAnimation: An instance of the FadeIn animation for the list.
   * - containerFadeOut: An instance of the FadeOut animation for the container.
   * - bodyPartList: An array of body part data.
   */
  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[styles.container, { opacity: containerFadeOut.fadeAnim }]}
      >
        <Header headerFadeIn={headerAnimation} handleBackPress={backAction} />
        <BorderBox fadeAnim={listAnimation}>
          <FlatList
            style={styles.list}
            data={bodyPartList}
            renderItem={({ item }) => (
              <BodyPartCard
                name={item.name}
                source={item.source}
                fadeOut={containerFadeOut}
                navigation={navigation}
                peripheral={peripheral}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
          />
        </BorderBox>
        <View style={styles.footer}></View>
      </Animated.View>
    </SafeAreaView>
  );
};

/**
 * Define the styles for the BodyPartsScreen component.
 *
 * Returns:
 * - An object containing the styles for the component.
 * - The container styles apply to the SafeAreaView.
 * - The list styles apply to the FlatList component.
 */
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
  footer: {
    padding: 10,
  },
});
