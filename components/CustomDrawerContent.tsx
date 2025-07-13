import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { Text, View, StyleSheet } from "react-native";
import Profile from "./Profile";
import test from '../assets/images/favicon.png'
export default function CustomDrawerContent( props : DrawerContentComponentProps ) {
    
    return(
        <DrawerContentScrollView 
            {...props}
            contentContainerStyle={{ padding: 0 , backgroundColor:'#393E46', height:'100%'}}
        >
            <View style={ styles.header }>
                <Profile imageSource={test} profileName="Princio"/>
            </View>
            <DrawerItemList {...props}/>
        </DrawerContentScrollView>
    )
}


const styles = StyleSheet.create({
  header: {
    padding: 20,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
});
