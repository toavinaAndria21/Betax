import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Button } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import DestinationPicker from './DestinationPicker'; // Assure-toi que le chemin est correct

const CENTER_COORDINATES = {
  latitude: -21.45803,
  longitude: 47.10305,
};

const API_URL = 'http://192.168.43.145:3000/radarbus/chauffeur/getAllPositionInARadius';

export default function LiveMap() {
  const [region, setRegion] = useState<Region>({
    ...CENTER_COORDINATES,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const [busData, setBusData] = useState<any[]>([]);
  const [arretData, setArretData] = useState<any[]>([]);

  // État pour afficher/cacher le DestinationPicker
  const [pickerVisible, setPickerVisible] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_URL}/latitude/${CENTER_COORDINATES.latitude}/longitude/${CENTER_COORDINATES.longitude}/radius/3`);
      const json = await response.json();

      if (json.status === 200) {
        const rawBusData = json.data?.bus?.data || [];
        const cleanedBusData = rawBusData.map((bus: any) => ({
          latitude: bus.driver.latitude,
          longitude: bus.driver.longitude,
          nom: bus.driver.nom,
        }));

        const rawArretData = json.data?.arret || [];

        setBusData(cleanedBusData);
        setArretData(rawArretData);
      }
    } catch (error) {
      console.error('Erreur API :', error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fonction appelée quand on touche la carte
  const handleMapPress = () => {
    if (pickerVisible) {
      setPickerVisible(false);
    }
  };

  return (
    <View style={styles.container}>

      {/* Wrapper tactile autour de la carte pour détecter le toucher */}
      <TouchableWithoutFeedback onPress={handleMapPress}>
        <View style={styles.mapContainer}>
          <MapView
            style={StyleSheet.absoluteFill}
            provider={PROVIDER_GOOGLE}
            region={region}
            showsUserLocation
            showsMyLocationButton
          >
            {busData.map((bus, i) => (
              <Marker
                key={`bus-${i}`}
                coordinate={{ latitude: bus.latitude, longitude: bus.longitude }}
                title={`Bus: ${bus.nom}`}
                pinColor="green"
              />
            ))}

            {arretData.map((arret, i) => (
              <Marker
                key={`arret-${i}`}
                coordinate={{ latitude: arret.latitude, longitude: arret.longitude }}
                title={`Arrêt: ${arret.nom}`}
                pinColor="blue"
              />
            ))}
          </MapView>
        </View>
      </TouchableWithoutFeedback>

      {/* Bouton flottant pour réafficher le formulaire */}
      {!pickerVisible && (
        <View style={styles.buttonContainer}>
          <Button title="Afficher le formulaire" onPress={() => setPickerVisible(true)} />
        </View>
      )}

      {/* DestinationPicker affiché par-dessus la carte */}
      {pickerVisible && (
        <DestinationPicker
          visible={pickerVisible}
          onRequestClose={() => setPickerVisible(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    zIndex: 20,
  },
});
