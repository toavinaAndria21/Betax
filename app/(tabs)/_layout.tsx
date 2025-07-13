import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawerContent from "@/components/CustomDrawerContent";
import Index from ".";
import History from "./history";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const Drawer = createDrawerNavigator();
export default function TabLayout() {
  return (
    <Drawer.Navigator
        drawerContent={ (props) => <CustomDrawerContent {...props}/> }
        screenOptions={{
        headerShown: true,
        headerStyle:{
            backgroundColor: '#fff',
        },
        drawerStyle: {
          width: 260
        },
        drawerActiveTintColor: '#fff',
        drawerInactiveTintColor: '#fff',
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: 'bold',
          color:'#fff'
        },
        drawerItemStyle: {
          borderWidth: 1,
          borderBottomColor: '#ccc',
          borderTopColor: '#ccc',
          borderLeftWidth: 0,
          borderRightWidth: 0,
          borderRadius: 0,
        }
        }}
    >
        <Drawer.Screen name="index"
                     component={ Index }
                     options={{ 
                        title: "Carte",
                        drawerIcon: ({ color, size }) => (
                            <MaterialIcons name="map" size={size} color={color} />
                        ),
                     }} 
                     
        />
        <Drawer.Screen name="history" 
                    component={ History }
                    options={{ 
                        title: "Historique",
                        drawerIcon: ({ color, size }) => (
                            <MaterialIcons name="history" size={size} color={color} />
                        ),
                     }} 
        />
    </Drawer.Navigator>
  );
}
