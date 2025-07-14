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
  ActivityIndicator,
} from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Input from './Input';
import Button from './Button';

type Props = {
  visible: boolean;
  onRequestClose: () => void;
  initialLocation?: string;
  idVoyageur?: number; // ID du voyageur pour l'historique
};

type Bus = {
  frais: number;
  matriculation: string;
  nbPlace: number;
  primus: string;
  terminus: string;
  type: number;
};

type BusStop = {
  latitude: number;
  longitude: number;
  nom: string;
};

type BusData = {
  bus: Bus;
  busStop: BusStop;
  id: number;
  idArret: number;
  idBus: number;
};

type ApiResponse = {
  status: number;
  description: string;
  data: BusData[];
};

// Service API pour récupérer les bus
const BusService = {
  async findBuses(fromStop: string, toStop: string): Promise<BusData[]> {
    try {
      // Remplacez cette URL par votre endpoint API réel
      const response = await fetch(`http://192.168.43.145:3000/radarbus/sarreter/bus/dest1/${fromStop}/dest2/${toStop}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Ajoutez vos headers d'authentification si nécessaire
          // 'Authorization': 'Bearer your-token',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiData: ApiResponse = await response.json();
      console.log('API Response:', JSON.stringify(apiData, null, 2));
      
      if (apiData.status !== 200) {
        throw new Error('API returned error status');
      }

      return apiData.data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des bus:', error);
      throw error;
    }
  },

  async startTrip(idBus: number, idVoyageur: number): Promise<boolean> {
    try {

      console.log(idBus, idVoyageur, " etooooooooooooooooooooo")
      const response = await fetch('http://192.168.43.145:3000/radarbus/prendre', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idBus: idBus,
          idVoyageur: idVoyageur
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Trip started:', result);
      return true;
    } catch (error) {
      console.error('Erreur lors du démarrage du trajet:', error);
      throw error;
    }
  }
};

export default function DestinationPicker({ visible, onRequestClose, initialLocation, idVoyageur = 0 }: Props) {
  const [displayed, setDisplayed] = useState(visible);
  const [actualLocation, setActualLocation] = useState<string>(initialLocation || '');
  const [destination, setDestination] = useState<string>('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [loading, setLoading] = useState(false);
  
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

  const handleStartTrip = async (busData: BusData) => {
    if (idVoyageur === 0) {
      Alert.alert('Erreur', 'Identifiant voyageur non disponible.');
      return;
    }

    setLoading(true);
    try {
      await BusService.startTrip(busData.idBus, idVoyageur);
      
      Alert.alert(
        'Trajet commencé',
        `Vous avez commencé votre trajet avec le bus ${busData.bus.matriculation} (${busData.bus.primus} → ${busData.bus.terminus}). Bon voyage !`,
        [
          {
            text: 'OK',
            onPress: () => onRequestClose(),
          }
        ]
      );
    } catch (error) {
      Alert.alert(
        'Erreur',
        'Impossible de commencer le trajet. Veuillez réessayer.',
        [
          {
            text: 'Réessayer',
            onPress: () => handleStartTrip(busData),
          },
          {
            text: 'Annuler',
            style: 'cancel',
          }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFindBus = async () => {
    if (!actualLocation.trim() || !destination.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir les deux champs.');
      return;
    }

    setLoading(true);

    try {
      const busData = await BusService.findBuses(actualLocation, destination);
      
      if (!busData || busData.length === 0) {
        Alert.alert(
          'Aucun bus trouvé', 
          `Aucun bus ne correspond à l'itinéraire ${actualLocation} → ${destination}.`,
          [
            {
              text: 'OK',
              style: 'default',
            }
          ]
        );
        return;
      }

      const busButtons = busData.map((item, index) => ({
        text: `🚌 ${item.bus.matriculation} (${item.bus.frais} Ar)`,
        onPress: () => handleStartTrip(item),  // async function, ok
      }));
      
      busButtons.push({
        text: 'Annuler',
        onPress: async () => {},  // async function vide, ok
      });
      

      // Formatage des informations pour l'affichage
      const busInfo = busData.map(item => {
        const bus = item.bus;
        const busStop = item.busStop;
        const route = `${bus.primus} → ${bus.terminus}`;
        const places = `${bus.nbPlace} places`;
        const frais = `${bus.frais} Ar`;
        const arret = busStop.nom;
        const type = `Type ${bus.type}`;
        
        return `🚌 ${bus.matriculation}\n📍 ${route}\n🚏 Arrêt: ${arret}\n💺 ${places} • 🚐 ${type}\n💰 ${frais}`;
      }).join('\n\n');

      Alert.alert(
        `${busData.length} bus trouvé${busData.length > 1 ? 's' : ''}`,
        `Bus disponibles pour ${actualLocation} → ${destination}:\n\n${busInfo}\n\nChoisissez un bus pour commencer votre trajet:`,
        busButtons
      );
    } catch (error) {
      console.error('Erreur complète:', error);
      Alert.alert(
        'Erreur de connexion',
        'Impossible de récupérer les informations des bus. Vérifiez votre connexion internet et réessayez.',
        [
          {
            text: 'Réessayer',
            onPress: () => handleFindBus(),
          },
          {
            text: 'Annuler',
            style: 'cancel',
          }
        ]
      );
    } finally {
      setLoading(false);
    }
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
              placeHolder="Arrêt bus le plus proche"
              textColor='#fff'
              editable={!loading}
            />
            <Input
              value={destination}
              onChange={setDestination}
              icon={<MaterialIcons name="my-location" color={'#fff'} size={wp('6%')} />}
              placeHolder="Votre destination"
              textColor='#fff'
              editable={!loading}
            />
            <Button 
              label={loading ? "Recherche..." : "Trouver un bus"} 
              onPress={handleFindBus}
              disabled={loading}
            />
            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={styles.loadingText}>Recherche des bus...</Text>
              </View>
            )}
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
  loadingContainer: {
    alignItems: 'center',
    marginTop: hp('2%'),
  },
  loadingText: {
    color: '#fff',
    marginTop: hp('1%'),
    fontSize: hp('1.8%'),
  },
});