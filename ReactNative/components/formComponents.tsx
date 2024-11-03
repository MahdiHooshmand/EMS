import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import React from "react";
import {
  button_background_color,
  button_pressed_background_color,
  card_text_color,
  input_text_color,
} from "../assets/thems/colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Slider from "@react-native-community/slider";

interface PickerItem {
  label: string;
  value: number;
}

interface ComboProps {
  text: string;
  onValueChange: (value: number) => void;
  items: PickerItem[];
  value: number;
}

export const Combo = ({ text, onValueChange, items, value }: ComboProps) => {
  return (
    <View style={styles.select_item_view}>
      <Text style={styles.select_item_text}>{text}</Text>
      <View style={styles.input_view}>
        <RNPickerSelect
          onValueChange={onValueChange}
          items={items}
          value={value}
          style={{
            inputIOS: styles.input,
            inputAndroid: styles.input,
          }}
        />
      </View>
    </View>
  );
};

interface SeekbarProps {
  title: string;
  valueText: string;
  value: number;
  setValue: (value: number) => void;
  step: number;
  min: number;
  max: number;
}

export const Seekbar = ({
  title,
  valueText,
  value,
  setValue,
  step,
  min,
  max,
}: SeekbarProps) => {
  const mul = 1 / step;
  return (
    <>
      <View style={styles.select_item_view}>
        <Text style={styles.select_item_text}>{title}</Text>
        <Text style={styles.slider_text}>{valueText}</Text>
      </View>
      <View style={styles.select_item_view}>
        <TouchableOpacity
          style={styles.inc_dec_button}
          onPress={() => {
            const newValue = Math.round((value - step) * mul) / mul;
            if (newValue >= min) {
              setValue(newValue);
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
          minimumValue={min}
          maximumValue={max}
          step={step}
          value={value}
          onValueChange={(value) => {
            const newValue = Math.round(value * mul) / mul;
            setValue(newValue);
          }}
          minimumTrackTintColor={button_pressed_background_color}
          maximumTrackTintColor={button_pressed_background_color}
          thumbTintColor={button_pressed_background_color}
        />
        <TouchableOpacity
          style={styles.inc_dec_button}
          onPress={() => {
            const newValue = Math.round((value + step) * mul) / mul;
            if (newValue <= max) {
              setValue(newValue);
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
    </>
  );
};

const styles = StyleSheet.create({
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
  },
});
