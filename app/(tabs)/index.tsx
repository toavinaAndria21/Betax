import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import LiveMap from "@/components/LiveMap";

export default function Index() {
  const [isDestinationPickerVisible, setIsDestinationPickerVisible] = useState(true); // Formulaire visible au début

  const handleMapTouch = () => {
    setIsDestinationPickerVisible(false);
  };

  return (
    <View style={styles.container}>
      <LiveMap/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
