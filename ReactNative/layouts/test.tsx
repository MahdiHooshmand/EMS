import React from "react";
import { View, Text } from "react-native";

interface Props {
  navigation: any;
  route: any;
}

export const Test = ({ navigation, route }: Props) => {
  const { bodyPartName, source, stimulationType } = route.params;

  return (
    <View>
      <Text>Body Part: {bodyPartName}</Text>
      <Text>{source}</Text>
      <Text>Stimulation Type: {stimulationType}</Text>
    </View>
  );
};
