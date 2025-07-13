import React from "react";
import { TextInput, StyleSheet, KeyboardTypeOptions, View } from "react-native";

type Props = {
    type?: KeyboardTypeOptions,
    onChange: (value: string) => void,
    placeHolder?: string,
    value: string,
    editable?: boolean,
    secure?: boolean,
    multiline?: boolean,
    bgColor?: string,
    icon?: React.ReactNode
}
export default function Input({ 
        type, 
        onChange, 
        placeHolder, 
        value, 
        editable = true, 
        secure = false, 
        multiline = false,
        bgColor = '#4F5962',
        icon
    }:Props ) {

    return(
        <View style={styles.container}>
            {icon && <View style={styles.icon}>{icon}</View>}
            <TextInput
                style={[
                styles.input,
                { backgroundColor: bgColor, paddingLeft: icon ? 40 : 10 }, // décaler le texte si icône
                ]}
                onChangeText={(value) => onChange(value)}
                value={value}
                placeholder={placeHolder}
                keyboardType={type}
                editable={editable}
                secureTextEntry={secure}
                multiline={multiline}
            />
        </View>

    );
}

const styles = StyleSheet.create({
  container: {
    margin: 12,
  },
  icon: {
    position: "absolute",
    left: 10,
    top: '50%',
    transform: [{ translateY: -12 }],
    zIndex: 10,
  },
  input: {
    position: "relative",
    height: 50,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    paddingRight: 10,
  },
});