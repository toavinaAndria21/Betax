import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Animated, View, StyleSheet, Text, Alert } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Input from './Input';
import Button from './Button';

type Props = {
  visible: boolean;
  onRequestClose: () => void;
  onPress?: () => void;
};

const mockBusData = [
  { id: 1, name: 'Bus 101', route: 'A - B' },
  { id: 2, name: 'Bus 202', route: 'B - C' },
  { id: 3, name: 'Bus 303', route: 'A - C' },
];

export default function DestinationPicker({ visible, onRequestClose }: Props) {
  const [displayed, setDisplayed] = useState(visible);
  const [actualLocation, setActualLocation] = useState<string>('');
  const [destination, setDestination] = useState<string>('');

  const slideDistance = useMemo(() => hp('50%'), []);
  const slideAnim = useRef(new Animated.Value(slideDistance)).current;

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
    // Simuler une recherche dans les mock data
    const foundBuses = mockBusData.filter(bus =>
      bus.route.toLowerCase().includes(actualLocation.toLowerCase()) &&
      bus.route.toLowerCase().includes(destination.toLowerCase())
    );

    if (foundBuses.length === 0) {
      Alert.alert('Aucun bus trouvé', `Aucun bus ne correspond à l'itinéraire ${actualLocation} → ${destination}.`);
    } else {
      Alert.alert('Bus trouvés', `Bus disponibles:\n${foundBuses.map(b => b.name).join('\n')}`);
    }

    // Fermer le modal après la recherche
    onRequestClose();
  };

  return (
    <View style={styles.overlay} pointerEvents={visible ? 'auto' : 'none'}>
      <Animated.View
        style={[
          styles.modalContent,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        <Text style={styles.title}>Trouvez votre itinéraire</Text>
        <View style={styles.inputContainer}>
          <Input
            value={actualLocation}
            onChange={setActualLocation}
            icon={<MaterialIcons name="location-on" color={'#fff'} size={wp('6%')} />}
            placeHolder="Votre position actuelle"
          />
          <Input
            value={destination}
            onChange={setDestination}
            icon={<MaterialIcons name="my-location" color={'#fff'} size={wp('6%')} />}
            placeHolder="Votre destination"
          />
          <Button label="Trouver un bus" onPress={handleFindBus} />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "relative",
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 10,
    backgroundColor: 'transparent',
  },
  modalContent: {
    marginTop: hp('5%'),
    height: hp('45%'),
    width: wp('98%'),
    backgroundColor: '#393E46',
    borderTopRightRadius: wp('5%'),
    borderTopLeftRadius: wp('5%'),
    bottom: 0,
    alignSelf: 'center',
    padding: wp('4%'),
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
    width: '100%',
    height: '100%',
    gap: hp('2%'),
  },
});
