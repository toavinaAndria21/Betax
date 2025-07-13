import { Pressable, View, StyleSheet, Text } from "react-native";
import { Image } from "expo-image";
import React from "react";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

type Props = {
    imageSource: string | number;
    profileName: string;
};

export default function Profile({ imageSource, profileName }: Props) {
    const size = wp('30%');

    return (
        <View style={styles.container}>
            <View style={[styles.CircleButtonContainer, { width: size, height: size, borderRadius: size / 2 }]}>
                <Pressable style={[styles.circleButton, { borderRadius: size / 2 }]}>
                    <Image
                        source={imageSource}
                        style={{ width: '100%', height: '100%', borderRadius: size / 2 }}
                        contentFit="cover"
                    />
                </Pressable>
            </View>
            <Text style={styles.profileName}>{profileName}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    CircleButtonContainer: {
        borderWidth: 1,
        borderColor: '#fff',
        padding: wp('2%'),
    },
    circleButton: {
        backgroundColor: '#fff',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileName: {
        color: '#fff',
        fontSize: wp('4%'),
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: hp('1%'),
    },
});
