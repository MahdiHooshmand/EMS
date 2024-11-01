// BodyPartItem.tsx
import React, { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import {
  button_background_color,
  button_pressed_background_color,
  button_text_color,
  card_background_color,
  card_text_color,
} from "../assets/thems/colors";

interface BodyPartCardProps {
  name: string;
  source: any;
  navigation: any;
}

export const BodyPartCard: React.FC<BodyPartCardProps> = ({
  name,
  source,
  navigation,
}) => {
  const handleEMSPress = () => {
    navigation.replace("set-info", {
      bodyPartName: name,
      source: source,
      stimulationType: "EMS",
    });
  };

  const handleTENSPress = () => {
    navigation.replace("set-info", {
      bodyPartName: name,
      source: source,
      stimulationType: "TENS",
    });
  };

  return (
    <View style={styles.card}>
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
    </View>
  );
};

export const fetchBodyParts = () => {
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

const styles = StyleSheet.create({
  card: {
    backgroundColor: card_background_color,
    alignItems: "center",
    borderRadius: 10,
    margin: 10,
    padding: 15,
  },
  title: {
    fontFamily: "fontHeader",
    fontSize: 20,
    textAlign: "center",
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
    justifyContent: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: button_background_color,
    borderRadius: 30,
    width: "40%", // عرض دکمه‌ها
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
