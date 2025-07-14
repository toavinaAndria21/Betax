import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

type Props = {
  label: string;
  bgColor?: string;
  onPress?: () => void;
};

export default function Button({ label, bgColor = 'green', onPress }: Props) {
  return (
    <Pressable 
      style={[styles.button, { backgroundColor: bgColor }]} 
      onPress={onPress}
    >
      <Text style={styles.buttonLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 5,
    paddingRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10    
  },
  buttonLabel: {
    color:'#fff',
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: 'bold'
  }
});
