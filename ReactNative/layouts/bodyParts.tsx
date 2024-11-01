import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Animated,
  FlatList,
  View,
} from "react-native";
import { Header } from "../components/header";
import { BorderBox } from "../components/borderBox";
import { FadeIn, FadeOut } from "../assets/thems/animations";
import { background_color } from "../assets/thems/colors";
import { BodyPartCard, fetchBodyParts } from "../components/bodyPartItem"; // ایمپورت تابع

interface BodyPartData {
  id: number;
  name: string;
  source: any;
}

export const BodyPartsScreen = ({ navigation }: any) => {
  const headerAnimation = new FadeIn(0);
  const listAnimation = new FadeIn(1);
  const containerFadeOut = new FadeOut();

  const [bodyPartList, setBodyPartList] = useState<BodyPartData[]>([]);

  useEffect(() => {
    setBodyPartList(fetchBodyParts());
  }, []);

  useEffect(() => {
    if (bodyPartList.length > 0) {
      Animated.parallel([
        headerAnimation.animate(),
        listAnimation.animate(),
      ]).start();
    }
  }, [bodyPartList]);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[styles.container, { opacity: containerFadeOut.fadeAnim }]}
      >
        <Header
          headerFadeIn={headerAnimation}
          fadeOut={containerFadeOut}
          backPage={"connect-to-device"}
          navigation={navigation}
        />
        <BorderBox fadeAnim={listAnimation}>
          <FlatList
            style={styles.list}
            data={bodyPartList}
            renderItem={({ item }) => (
              <BodyPartCard
                name={item.name}
                source={item.source}
                navigation={navigation}
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
