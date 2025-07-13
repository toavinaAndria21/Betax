import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';

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

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_URL}/latitude/${CENTER_COORDINATES.latitude}/longitude/${CENTER_COORDINATES.longitude}/radius/3`);
      const json = await response.json();
      console.log(JSON.stringify(json))
      if (json.status === 200) {
        setBusData(json.data.bus || []);
        setArretData(json.data.arret || []);
      }
    } catch (error) {
      console.error('Erreur API :', error);
    }
  };

  useEffect(() => {
    fetchData(); // initial
    const interval = setInterval(fetchData, 5000); // toutes les 5 sec
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
