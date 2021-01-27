import React from "react";
import { View, StyleSheet, Image, Dimensions } from "react-native";

export default function LoadingScreen(props) {
  return (
    <View>
      <Image
        style={styles.loadingPicture}
        source={require("./assets/splash.png")}
      />
    </View>
  );
}

var widthPhone = Dimensions.get("window").width; //full width
var heightPhone = Dimensions.get("window").height; //full height

const styles = StyleSheet.create({
  loadingPicture: { width: widthPhone, height: heightPhone },
});
