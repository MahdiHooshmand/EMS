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

// export const Seekbar = () => {
//   <>
//     <View style={styles.select_item_view}>
//       <Text style={styles.select_item_text}>On Time : </Text>
//       <Text style={styles.slider_text}>{onTime.toFixed(1)} sec</Text>
//     </View>
//     <View style={styles.select_item_view}>
//       <TouchableOpacity
//         style={styles.inc_dec_button}
//         onPress={() => {
//           const newValue = Math.round((onTime - 0.1) * 10) / 10;
//           if (newValue >= 0.1) {
//             setOnTime(newValue);
//           }
//         }}
//       >
//         <MaterialIcons
//           name="remove-circle"
//           size={40}
//           color={button_background_color}
//         />
//       </TouchableOpacity>
//       <Slider
//         style={styles.slider}
//         minimumValue={0.1}
//         maximumValue={10}
//         step={0.1}
//         value={onTime}
//         onValueChange={(value) => {
//           const newValue = Math.round(value * 10) / 10;
//           setOnTime(newValue);
//         }}
//         minimumTrackTintColor={button_pressed_background_color}
//         maximumTrackTintColor={button_pressed_background_color}
//         thumbTintColor={button_pressed_background_color}
//       />
//       <TouchableOpacity
//         style={styles.inc_dec_button}
//         onPress={() => {
//           const newValue = Math.round((onTime + 0.1) * 10) / 10;
//           if (newValue <= 10.0) {
//             setOnTime(newValue);
//           }
//         }}
//       >
//         <MaterialIcons
//           name="add-circle"
//           size={40}
//           color={button_background_color}
//         />
//       </TouchableOpacity>
//     </View>
//   </>;
// };

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
});
