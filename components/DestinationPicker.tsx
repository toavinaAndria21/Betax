import React, { useRef, useEffect, useState, useMemo } from 'react';
import {
  Animated,
  View,
  StyleSheet,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Input from './Input';
import Button from './Button';

type Props = {
  visible: boolean;
  onRequestClose: () => void;
  initialLocation?: string; 
};

const mockBusData = [
  { id: 1, name: 'Bus 101', route: 'A - B' },
  { id: 2, name: 'Bus 202', route: 'B - C' },
  { id: 3, name: 'Bus 303', route: 'A - C' },
];

export default function DestinationPicker({ visible, onRequestClose, initialLocation }: Props) {
  const [displayed, setDisplayed] = useState(visible);
  const [actualLocation, setActualLocation] = useState<string>(initialLocation || '');
  const [destination, setDestination] = useState<string>('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  
  const slideDistance = useMemo(() => hp('50%'), []);
  const slideAnim = useRef(new Animated.Value(slideDistance)).current;

  // Met à jour actualLocation si initialLocation change
  useEffect(() => {
    if (initialLocation) {
      setActualLocation(initialLocation);
    }
  }, [initialLocation]);

  // Gestion du clavier
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (event) => {
      setKeyboardHeight(event.endCoordinates.height);
    });
    
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  useEffect(() => {
    if (visible) {
      setDisplayed(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: slideDistance,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setDisplayed(false));
    }
  }, [visible, slideDistance]);

  if (!displayed) return null;

  const handleFindBus = () => {
    if (!actualLocation.trim() || !destination.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir les deux champs.');
      return;
    }
    const foundBuses = mockBusData.filter(bus =>
      bus.route.toLowerCase().includes(actualLocation.toLowerCase()) &&
      bus.route.toLowerCase().includes(destination.toLowerCase())
    );

    if (foundBuses.length === 0) {
      Alert.alert('Aucun bus trouvé', `Aucun bus ne correspond à l'itinéraire ${actualLocation} → ${destination}.`);
    } else {
      Alert.alert('Bus trouvés', `Bus disponibles:\n${foundBuses.map(b => b.name).join('\n')}`);
    }

    onRequestClose();
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 100}
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard} accessible={false}>
        <Animated.View
          style={[
            styles.modalContent,
            { 
              transform: [{ translateY: slideAnim }],
              bottom: keyboardHeight > 0 ? keyboardHeight : 0
            },
          ]}
        >
          <ScrollView
            contentContainerStyle={styles.inputContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.title}>Trouvez votre itinéraire</Text>
            <Input
              value={actualLocation}
              onChange={setActualLocation}
              icon={<MaterialIcons name="location-on" color={'#fff'} size={wp('6%')} />}
              placeHolder="Votre position actuelle"
              textColor='#fff'
            />
            <Input
              value={destination}
              onChange={setDestination}
              icon={<MaterialIcons name="my-location" color={'#fff'} size={wp('6%')} />}
              placeHolder="Votre destination"
              textColor='#fff'
            />
            <Button label="Trouver un bus" onPress={handleFindBus} />
          </ScrollView>
        </Animated.View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
  },
  modalContent: {
    position: 'absolute',
    bottom: 0,
    height: hp('45%'),
    width: wp('98%'),
    backgroundColor: '#393E46',
    borderTopRightRadius: wp('5%'),
    borderTopLeftRadius: wp('5%'),
    alignSelf: 'center',
    padding: wp('4%'),
    zIndex: 10,
  },
  title: {
    color: '#fff',
    textAlign: 'center',
    textTransform: 'uppercase',
    fontSize: hp('2.4%'),
    fontWeight: 'bold',
    marginBottom: hp('1.5%'),
  },
  inputContainer: {
    flexGrow: 1,
    gap: hp('2%'),
  },
});