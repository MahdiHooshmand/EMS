import { Animated, StyleSheet, Text, TextInput } from "react-native";
import {
  button_background_color,
  input_text_color,
  placeholder_color,
  text_color,
} from "../assets/thems/colors";
import { PeripheralModel } from "../models/peripheralCardModel";
import { FadeIn, FadeOut } from "../assets/thems/animations";

interface Props {
  fadeIn: FadeIn;
  title: string;
  value: string;
  placeholder: string;
  handleInput: (value: string) => void;
  secureTextEntry: boolean;
}

export const InputAuth = ({
  fadeIn,
  title,
  value,
  placeholder,
  handleInput,
  secureTextEntry,
}: Props) => {
  return (
    <Animated.View
      style={{
        opacity: fadeIn.fadeAnim,
        translateY: fadeIn.translateY,
      }}
    >
      <Text style={styles.text}>{title}</Text>
      <TextInput
        style={styles.input}
        value={value}
        placeholder={placeholder}
        placeholderTextColor={placeholder_color}
        onChangeText={handleInput}
        secureTextEntry={secureTextEntry}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  text: {
    color: text_color,
    fontSize: 20,
    margin: 10,
    fontFamily: "fontHeader",
    fontStyle: "italic",
    alignSelf: "center",
  },
  input: {
    color: input_text_color,
    backgroundColor: button_background_color,
    borderRadius: 30,
    fontSize: 20,
    padding: 10,
    fontFamily: "fontHeader",
    textAlign: "center",
    marginBottom: 5,
    width: "75%",
    alignSelf: "center",
  },
});
