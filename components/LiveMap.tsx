import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Button, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import DestinationPicker from './DestinationPicker';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { LogBox } from 'react-native';
import { useUser } from '@/context/UserContext';

LogBox.ignoreAllLogs();

const FIANARANTSOA_REGION = {
  latitude: -21.4527,
  longitude: 47.0857,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

const MAP_BOUNDARIES = {
  northEast: { latitude: -21.40, longitude: 47.13 },
  southWest: { latitude: -21.50, longitude: 47.04 },
};

const API_URL = 'http://192.168.43.145:3000/radarbus/chauffeur/getAllPositionInARadius';

export default function LiveMap() {
  const mapRef = useRef<MapView>(null);

  const intervalRef = useRef<any>(null);
  const [region, setRegion] = useState<Region>(FIANARANTSOA_REGION);
  const [busData, setBusData] = useState<any[]>([]);
  const [arretData, setArretData] = useState<any[]>([]);
  const [pickerVisible, setPickerVisible] = useState(true);
  const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  const [initialLocation, setInitialLocation] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const {user} = useUser();

  const zoomToMarker = (latitude: number, longitude: number) => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude,
          longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        500
      );
    }
  };

  // Utiliser useCallback pour éviter la redéfinition de fetchData à chaque render
 // Remplacez cette partie dans votre fonction fetchData :

const fetchData = useCallback(async () => {
  if (isLoading) return;
  
  const center = userCoords || { latitude: region.latitude, longitude: region.longitude };
  setIsLoading(true);
  
  try {
    console.log('Fetching data at:', new Date().toLocaleTimeString());
    const response = await fetch(
      `${API_URL}/latitude/${center.latitude}/longitude/${center.longitude}/radius/3`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const json = await response.json();
    // console.log('Données reçues:', JSON.stringify(json));
    
    // CORRECTION : Vérifier le status global et traiter les bus directement
    if (json.status === 200 && json.data?.bus) {
      const rawBusData = json.data.bus || [];
      const cleanedBusData = rawBusData.map((bus: any) => ({
        latitude: bus.driver.latitude,
        longitude: bus.driver.longitude,
        nom: bus.driver.nom,
        type: bus.type,
        matriculation: bus.matriculation,
        frais: bus.frais,
        distance: bus.distance,
      }));
      setBusData(cleanedBusData);
      // console.log('Bus traités:', cleanedBusData);
    } else {
      setBusData([]);
    }

    // Pour les arrêts, vérifiez aussi la structure
    const rawArretData = Array.isArray(json.data?.arret) ? json.data.arret : [];
    const cleanedArretData = rawArretData.map((arret: any) => ({
      latitude: arret.latitude,
      longitude: arret.longitude,
      nom: arret.nom,
      type: arret.type,
      distance: Number(arret.distance.toFixed(2)),
    }));
    setArretData(cleanedArretData);
    
  } catch (error) {
    console.error('Erreur API :', error);
    setBusData([]);
    setArretData([]);
  } finally {
    setIsLoading(false);
  }
}, [userCoords, region.latitude, region.longitude, isLoading]);
  // Effet pour la géolocalisation - s'exécute une seule fois
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Permission localisation refusée');
        return;
      }
      
      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      if (
        latitude > MAP_BOUNDARIES.southWest.latitude &&
        latitude < MAP_BOUNDARIES.northEast.latitude &&
        longitude > MAP_BOUNDARIES.southWest.longitude &&
        longitude < MAP_BOUNDARIES.northEast.longitude
      ) {
        setRegion((r) => ({ ...r, latitude, longitude }));
        setUserCoords({ latitude, longitude });
      } else {
        setUserCoords({ latitude: FIANARANTSOA_REGION.latitude, longitude: FIANARANTSOA_REGION.longitude });
      }
    })();
  }, []);

  // Effet pour les boundaries de la map
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setMapBoundaries(MAP_BOUNDARIES.northEast, MAP_BOUNDARIES.southWest);
    }
  }, []);

  // Effet pour l'intervalle d'API - séparé et plus stable
  useEffect(() => {
    // Première exécution immédiate
    fetchData();
    
    // Nettoyer l'ancien intervalle s'il existe
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Créer le nouveau intervalle
    intervalRef.current = setInterval(() => {
      fetchData();
    }, 5000);
    
    // Nettoyage à la destruction du composant
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchData]);

  // Effet pour calculer la localisation initiale
  useEffect(() => {
    if (userCoords && arretData.length > 0) {
      const nearestArret = arretData.reduce((prev, curr) =>
        prev.distance < curr.distance ? prev : curr
      );

      if (nearestArret.distance) {
        setInitialLocation(nearestArret.nom);
      } else {
        setInitialLocation(`Lat: ${userCoords.latitude.toFixed(5)}, Lon: ${userCoords.longitude.toFixed(5)}`);
      }
    } else if (userCoords) {
      setInitialLocation(`Lat: ${userCoords.latitude.toFixed(5)}, Lon: ${userCoords.longitude.toFixed(5)}`);
    }
  }, [userCoords, arretData]);

  const handleRegionChangeComplete = (newRegion: Region) => {
    if (
      newRegion.latitude > MAP_BOUNDARIES.northEast.latitude ||
      newRegion.latitude < MAP_BOUNDARIES.southWest.latitude ||
      newRegion.longitude > MAP_BOUNDARIES.northEast.longitude ||
      newRegion.longitude < MAP_BOUNDARIES.southWest.longitude
    ) {
      if (mapRef.current) {
        mapRef.current.animateToRegion(region, 100);
      }
    } else {
      setRegion(newRegion);
    }
  };

  const handleMapPress = () => {
    if (pickerVisible) {
      setPickerVisible(false);
    }
    if (selectedMarker) {
      setSelectedMarker(null);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={handleMapPress}>
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
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
                pinColor="green"
                onPress={() => {
                  setSelectedMarker({ type: 'bus', data: bus, index: i });
                  zoomToMarker(bus.latitude, bus.longitude);
                }}
              />
            ))}

            {arretData.map((arret, i) => (
              <Marker
                key={`arret-${i}`}
                coordinate={{ latitude: arret.latitude, longitude: arret.longitude }}
                pinColor="blue"
                onPress={() => {
                  setSelectedMarker({ type: 'arret', data: arret, index: i });
                  zoomToMarker(arret.latitude, arret.longitude);
                }}
              />
            ))}
          </MapView>
        </View>
      </TouchableWithoutFeedback>

      {selectedMarker && (
        <View style={styles.infoOverlay}>
          <View style={styles.infoCard}>
            {selectedMarker.type === 'bus' ? (
              <>
                <Text style={styles.infoTitle}>🚌 Bus - {selectedMarker.data.matriculation}</Text>
                <Text style={styles.infoText}>👤 Chauffeur : {selectedMarker.data.nom}</Text>
                <Text style={styles.infoText}>🚐 Ligne : {selectedMarker.data.type}</Text>
                <Text style={styles.infoText}>💰 Frais : {selectedMarker.data.frais} Ar</Text>
                <Text style={styles.infoText}>📍 Distance : {selectedMarker.data.distance?.toFixed(2)} km</Text>
              </>
            ) : (
              <>
                <Text style={styles.infoTitle}>🚏 Arrêt - {selectedMarker.data.nom}</Text>
                <Text style={styles.infoText}>📍 Distance : {selectedMarker.data.distance?.toFixed(2)} km</Text>
              </>
            )}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedMarker(null)}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {!pickerVisible && (
        <View style={styles.buttonContainer}>
          <Button title="Planifier un itinéraire" onPress={() => setPickerVisible(true)} />
        </View>
      )}

      {pickerVisible && (
        <DestinationPicker
          visible={pickerVisible}
          onRequestClose={() => setPickerVisible(false)}
          initialLocation={initialLocation}
          idVoyageur={user?.id}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  mapContainer: { flex: 1 },
  buttonContainer: {
    position: 'absolute',
    bottom: hp('2.5%'),
    left: wp('43%'),         
    transform: [{ translateX: -wp('20%') }],
    zIndex: 20,
  },  
  infoOverlay: {
    position: 'absolute',
    top: hp('8%'),
    left: wp('5%'),
    right: wp('5%'),
    zIndex: 1000,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: wp('3%'),
    padding: hp('3%'),
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: hp('0.3%') },
    shadowOpacity: 0.25,
    shadowRadius: hp('0.5%'),
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  infoTitle: {
    fontWeight: 'bold',
    fontSize: hp('2.5%'),
    marginBottom: hp('1.5%'),
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: hp('1%'),
  },
  infoText: {
    fontSize: hp('2%'),
    marginBottom: hp('1%'),
    color: '#666',
    lineHeight: hp('2.7%'),
  },
  closeButton: {
    position: 'absolute',
    top: hp('1.5%'),
    right: hp('1.5%'),
    width: hp('4%'),
    height: hp('4%'),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: hp('2%'),
  },
  closeButtonText: {
    fontSize: hp('2.7%'),
    color: '#666',
    fontWeight: 'bold',
  },
  loadingIndicator: {
    position: 'absolute',
    top: hp('5%'),
    right: wp('5%'),
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: hp('1%'),
    borderRadius: wp('2%'),
    zIndex: 999,
  },
  loadingText: {
    color: 'white',
    fontSize: hp('1.5%'),
  },
});