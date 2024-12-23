// Export the BodyPartCard component
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import {
  button_background_color,
  button_pressed_background_color,
  button_text_color,
  card_text_color,
} from "../assets/thems/colors";
import { FadeOut } from "../assets/thems/animations";
import { CardList } from "./card";
import { PeripheralModel } from "../models/peripheralCardModel";
import { Electrotherapy, MuscleName } from "../models/stimulateInfoModel";
import { BodyPartData } from "../layouts/bodyParts";

interface BodyPartCardProps {
  name: MuscleName;
  source: any;
  navigation: any;
  fadeOut: FadeOut;
  peripheral: PeripheralModel;
}

/**
 * BodyPartCard component displays a card with a body part name, image, and buttons for E
 * @param name of the body part
 * @param source of the image
 * @param fadeOut animation
 * @param navigation for navigation
 * @param peripheral object containing information about the body part
 * @constructor - BodyPartCard
 */
export const BodyPartCard: React.FC<BodyPartCardProps> = ({
  name,
  source,
  fadeOut,
  navigation,
  peripheral,
}) => {
  /**
   * Handle EMS button press
   */
  const handleEMSPress = () => {
    fadeOut.animate().start(() => {
      navigation.replace("set-info", {
        source: source,
        peripheral: peripheral,
        data: new Electrotherapy(name, 500, 300, "EMS", 1.0, 4.0, 5),
      });
    });
  };
  /**
   * Handle TENS button press
   */
  const handleTENSPress = () => {
    fadeOut.animate().start(() => {
      navigation.replace("set-info", {
        source: source,
        peripheral: peripheral,
        data: new Electrotherapy(name, 80, 200, "TENS", 1.0, 4.0, 5),
      });
    });
  };

  /**
   * Render the BodyPartCard component
   */
  return (
    <CardList>
      <Text style={styles.title}>{name}</Text>
      <View style={styles.image_container}>
        <Image source={source} style={styles.image} resizeMode={"contain"} />
      </View>
      <View style={styles.buttonContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleEMSPress}
        >
          <Text style={styles.buttonText}>EMS</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleTENSPress}
        >
          <Text style={styles.buttonText}>TENS</Text>
        </Pressable>
      </View>
    </CardList>
  );
};

export const fetchBodyParts: () => BodyPartData[] = () => {
  /**
   * Fetch body parts data from API
   */
  return [
    {
      id: 1,
      name: "ABDOMINALS",
      source: require("../assets/electrode_placements/ABDOMINALS.png"),
    },
    {
      id: 2,
      name: "OBLIQUES",
      source: require("../assets/electrode_placements/OBLIQUES.png"),
    },
    {
      id: 3,
      name: "TRAPEZIUS",
      source: require("../assets/electrode_placements/TRAPEZIUS.png"),
    },
    {
      id: 4,
      name: "LATISSIMUS DORSI",
      source: require("../assets/electrode_placements/LATISSIMUS DORSI.png"),
    },
    {
      id: 5,
      name: "BICEPS",
      source: require("../assets/electrode_placements/BICEPS.png"),
    },
    {
      id: 6,
      name: "TRICEPS",
      source: require("../assets/electrode_placements/TRICEPS.png"),
    },
    {
      id: 7,
      name: "FRONT DELTOIDS",
      source: require("../assets/electrode_placements/FRONT DELTOIDS.png"),
    },
    {
      id: 8,
      name: "REAR DELTOIDS",
      source: require("../assets/electrode_placements/REAR DELTOIDS.png"),
    },
    {
      id: 9,
      name: "VASTUS MEDIALIS",
      source: require("../assets/electrode_placements/VASTUS MEDIALIS.png"),
    },
    {
      id: 10,
      name: "VASTUS LATERALIS",
      source: require("../assets/electrode_placements/VASTUS LATERALIS.png"),
    },
    {
      id: 11,
      name: "QUADRICEPS & GRACILIS",
      source: require("../assets/electrode_placements/QUADRICEPS & GRACILIS.png"),
    },
    {
      id: 12,
      name: "HAMSTRINGS",
      source: require("../assets/electrode_placements/HAMSTRINGS.png"),
    },
    {
      id: 13,
      name: "GLUTEUS MAXIMUS",
      source: require("../assets/electrode_placements/GLUTEUS MAXIMUS.png"),
    },
    {
      id: 14,
      name: "CALVES",
      source: require("../assets/electrode_placements/CALVES.png"),
    },
    {
      id: 15,
      name: "FOREARMS",
      source: require("../assets/electrode_placements/FOREARMS.png"),
    },
  ];
};

/**
 * Styles for the BodyPartCard component
 */
const styles = StyleSheet.create({
  title: {
    fontFamily: "fontHeader",
    fontSize: 20,
    color: card_text_color,
  },
  image: {
    marginTop: 10,
    flex: 1,
  },
  image_container: {
    aspectRatio: 1.0,
    width: "80%",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 10,
  },
  button: {
    paddingVertical: 10,
    backgroundColor: button_background_color,
    borderRadius: 30,
    width: "40%",
    alignItems: "center",
  },
  buttonPressed: {
    backgroundColor: button_pressed_background_color,
  },
  buttonText: {
    fontFamily: "fontText",
    color: button_text_color,
    fontSize: 16,
  },
});
