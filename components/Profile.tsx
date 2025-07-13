import { Pressable, View, StyleSheet, Text } from "react-native";
import { Image } from "expo-image";

type Props = {
    imageSource: string;
    profileName: string
}
export default function Profile({ imageSource, profileName }: Props) {

    return(
        <View>
            <View style={ styles.CircleButtonContainer }>
                <Pressable style={ styles.circleButton }>
                    <Image source={imageSource}></Image>
                </Pressable>
            </View>
            <Text style={ styles.profileName }>{ profileName }</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    CircleButtonContainer: {
        width: 120,
        height: 120,
        marginHorizontal: 60,
        borderWidth: 1,
        borderRadius: '50%',
        borderColor: '#fff',
        padding: 10
    },
    circleButton: {
        backgroundColor: '#fff',
        flex: 1,
        borderRadius: '50%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 10,
    }
});