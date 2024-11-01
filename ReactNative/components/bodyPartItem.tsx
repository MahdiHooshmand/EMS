// BodyPartItem.tsx
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

interface BodyPartCardProps {
  id: number;
  name: string;
  source: any;
}

export const BodyPartCard: React.FC<BodyPartCardProps> = ({
  id,
  name,
  source,
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{name}</Text>
      <Image source={source} style={styles.image} />
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
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  image: {
    width: 100,
    height: 100,
    marginTop: 10,
  },
});
