import React, { useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import LiveMap from "@/components/LiveMap";
import DestinationPicker from "@/components/DestinationPicker";
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function Index() {
  const [isDestinationPickerVisible, setIsDestinationPickerVisible] = useState(true);

  return (
    <View style={styles.container}>
      <LiveMap />

      <Pressable
        style={styles.fabButton}
        
        onPress={() => setIsDestinationPickerVisible(!isDestinationPickerVisible)}
      >
        <Ionicons name="navigate" size={wp('6%')} color="white" />
      </Pressable>

      <DestinationPicker
        visible={isDestinationPickerVisible}
        onClose={() => setIsDestinationPickerVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  fabButton: {
    position: "absolute",
    bottom: hp('3%'),
    right: wp('5%'),
    width: wp('14%'),
    height: wp('14%'),
    backgroundColor: "#2196F3",
    borderRadius: wp('7%'),
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    zIndex: 20,
  },
});
