import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { Text, View, StyleSheet } from "react-native";
import Profile from "./Profile";
import Avatar from '../assets/images/Avatar-Profile-Vector.png';
import React from "react";
import { useUser } from "@/context/UserContext";

export default function CustomDrawerContent( props : DrawerContentComponentProps ) {

    const { user } = useUser();

    return(
        <DrawerContentScrollView 
            {...props}
            contentContainerStyle={{ padding: 0 , backgroundColor:'#393E46', height:'100%'}}
        >
            <View style={ styles.header }>
                <Profile imageSource={ Avatar } profileName={ user?.nom  ?? "Nom d'utilisateur" } profileEmail={ user?.email ?? "utilisateur@exemple.com" }/>
            </View>
            <DrawerItemList {...props}/>
        </DrawerContentScrollView>
    )
}


const styles = StyleSheet.create({
  header: {
    padding: 20,
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
});
