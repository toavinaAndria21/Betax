import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Button, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import * as Location from 'expo-location'; // Installer expo-location si tu utilises Expo
import DestinationPicker from './DestinationPicker';

const FIANARANTSOA_REGION = {
  latitude: -21.4527,
  longitude: 47.0857,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

const API_URL = 'http://192.168.43.145:3000/radarbus/chauffeur/getAllPositionInARadius';

export default function LiveMap() {
  const [region, setRegion] = useState<Region>(FIANARANTSOA_REGION);

  const [busData, setBusData] = useState<any[]>([]);
  const [arretData, setArretData] = useState<any[]>([]);

  const [pickerVisible, setPickerVisible] = useState(true);

  // Demande permission et récupère position actuelle pour centrer la carte
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Permission localisation refusée, centrage sur Fianarantsoa');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Limiter la position initiale à Fianarantsoa
      if (
        latitude > -21.50 &&
        latitude < -21.40 &&
        longitude > 47.04 &&
        longitude < 47.13
      ) {
        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      } else {
        setRegion(FIANARANTSOA_REGION);
      }
    })();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${API_URL}/latitude/${region.latitude}/longitude/${region.longitude}/radius/3`
      );
      const json = await response.json();
      console.log(JSON.stringify(json));
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
  }, [region]);

  // Fonction pour vérifier si la région est dans Fianarantsoa
  const isInsideFianarantsoa = (newRegion: Region) => {
    return (
      newRegion.latitude > -21.50 &&
      newRegion.latitude < -21.40 &&
      newRegion.longitude > 47.04 &&
      newRegion.longitude < 47.13
    );
  };

  // Limiter la navigation à Fianarantsoa
  const handleRegionChangeComplete = (newRegion: Region) => {
    if (isInsideFianarantsoa(newRegion)) {
      setRegion(newRegion);
    } else {
      setRegion(region); // Revenir à la région précédente si hors limites
    }
  };

  // Fonction appelée quand on touche la carte
  const handleMapPress = () => {
    if (pickerVisible) {
      setPickerVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={handleMapPress}>
        <View style={styles.mapContainer}>
          <MapView
            style={StyleSheet.absoluteFill}
            provider={PROVIDER_GOOGLE}
            region={region}
            onRegionChangeComplete={handleRegionChangeComplete}
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

      {!pickerVisible && (
        <View style={styles.buttonContainer}>
          <Button title="Afficher le formulaire" onPress={() => setPickerVisible(true)} />
        </View>
      )}

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
  container: { flex: 1 },
  mapContainer: { flex: 1 },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    zIndex: 20,
  },
});
