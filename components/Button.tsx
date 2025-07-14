import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

type Props = {
  label: string;
  bgColor?: string;
  onPress?: () => void;
  disabled?: boolean;
};

export default function Button({ label, bgColor = 'green', onPress, disabled = false }: Props) {
  return (
    <Pressable
      style={[
        styles.button, 
        { backgroundColor: disabled ? '#666' : bgColor },
        disabled && styles.disabledButton
      ]}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
    >
      <Text style={[styles.buttonLabel, disabled && styles.disabledLabel]}>
        {label}
      </Text>
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
  },
  disabledButton: {
    opacity: 0.6,
    borderColor: '#999',
  },
  disabledLabel: {
    color: '#ccc',
  }
});