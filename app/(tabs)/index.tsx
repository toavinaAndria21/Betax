import { Text, View, StyleSheet, Pressable } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import DestinationPicker from "@/components/DestinationPicker";
import { useState } from "react";

// type RootDrawerParamList = {
//   index: undefined;
//   history: undefined;
// };
export default function Index() {

  // const Navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
  const [isDestinationPickerVisible, setIsDestinationPickerVisible] = useState<boolean>(false)

  return (
    <Pressable
      // onPressIn={()=> setIsDestinationPickerVisible(false)}
      // onPressOut={()=> setIsDestinationPickerVisible(true)}
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#fff'
      }}
    >

   {/* <DestinationPicker
        visible={isDestinationPickerVisible}
        onClose={() => setIsDestinationPickerVisible(false)}
    /> */}

    </Pressable>
  );
}

const styles = StyleSheet.create({
  burgerMenu: {
    width: 35,
    height: 35,
    backgroundColor: '#fff',
    borderRadius: 15,
    position: 'absolute',
    top: 20,
    left: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});