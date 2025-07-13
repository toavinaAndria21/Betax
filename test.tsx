import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { markers } from '@/assets/markers';

export default function App() {
  const fianarRegion = {
    latitude: -21.4527,
    longitude: 47.0857,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  const [region, setRegion] = useState(fianarRegion);

  const isInsideFianarantsoa = (region: Region) => {
    return (
      region.latitude > -21.50 &&
      region.latitude < -21.40 &&
      region.longitude > 47.04 &&
      region.longitude < 47.13
    );
  };

  const handleRegionChangeComplete = (newRegion: Region) => {
    if (isInsideFianarantsoa(newRegion)) {
      setRegion(newRegion); // On accepte la région
    } else {
      setRegion(fianarRegion); // On revient à Fianarantsoa
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_GOOGLE}
        region={region}
        onRegionChangeComplete={handleRegionChangeComplete}
        zoomEnabled={true}
        scrollEnabled={true}
        rotateEnabled={false}
        pitchEnabled={false}
        showsUserLocation
        showsMyLocationButton
      >
        {markers.map((marker, index) => (
          <Marker key={index} coordinate={marker} />
        ))}
      </MapView>
    </View>
  );
}
