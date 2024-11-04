// InputAuth component for rendering an animated input field with a title.
import { Animated, StyleSheet, Text, TextInput } from "react-native";
import {
  button_background_color,
  input_text_color,
  placeholder_color,
  text_color,
} from "../assets/thems/colors";
import { FadeIn } from "../assets/thems/animations";

/**
 * Props interface for the InputAuth component.
 *
 * Props:
 * - fadeIn: FadeIn - An instance of the FadeIn animation class to control the input's fade animation.
 * - title: string - The title or label for the input field.
 * - value: string - The current value of the input field.
 * - placeholder: string - The placeholder text for the input field.
 * - handleInput: (value: string) => void - A function to handle changes to the input field's value.
 * - secureTextEntry: boolean - A boolean indicating whether the input field should hide the text (e.g., for passwords).
 */
interface Props {
  fadeIn: FadeIn;
  title: string;
  value: string;
  placeholder: string;
  handleInput: (value: string) => void;
  secureTextEntry: boolean;
}

/**
 * InputAuth component for rendering an animated input field with a title.
 *
 * @param fadeIn - An instance of the FadeIn animation class to control the input's fade animation.
 * @param title - The title or label for the input field.
 * @param value - The current value of the input field.
 * @param placeholder - The placeholder text for the input field.
 * @param handleInput - A function to handle changes to the input field's value.
 * @param secureTextEntry - A boolean indicating whether the input field should hide the text (e.g., for passwords).
 *
 * @returns A JSX element representing the animated input field with a title.
 */
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

/**
 * Styles for the InputAuth component.
 *
 * Styles:
 * - text: Styles for the title text, including color, font size, margin, font family, font style, and alignment.
 * - input: Styles for the input field, including color, background color, border radius, font size, padding, font family, text alignment, margin, width, and alignment.
 */
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
