import React, { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';
import { Platform } from 'react-native';
import * as Location from 'expo-location';
import { LocationSubscription } from 'expo-location';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const Driver: React.FC = () => {
  type BusData = {
    matriculation: string;
    primus: string;
    terminus: string;
    type: number;
  };

  const [locationSubscription, setLocationSubscription] = useState<LocationSubscription | null>(null);
  const [isWorkingDay, setIsWorkingDay] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [buttonScale] = useState<Animated.Value>(new Animated.Value(1));
  const [busInfo, setBusInfo] = useState<BusData | null>(null);
  const { user } = useUser();
  const bottomPadding = Platform.OS === 'android' ? 20 : 0;

  const handlePressIn = (): void => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (): void => {
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleWorkDayToggle = (): void => {
    if (!isWorkingDay) {
      setIsWorkingDay(true);
      setStartTime(new Date());
      startLocationTracking();
    } else {
      setIsWorkingDay(false);
      setStartTime(null);
      stopLocationTracking();
    }
  };

  const getCurrentDate = (): string => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return today.toLocaleDateString('fr-FR', options);
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const startLocationTracking = async () => {
    alert('helll')
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.warn('Permission de localisation refusée');
      return;
    }

    const subscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000, // toutes les 5s
        distanceInterval: 30, // ou toutes les 30 mètres
      },
      (location) => {
        console.log('Position actuelle:', location.coords);

        fetch(`http://192.168.43.145:3000/radarbus/chauffeur/${ user?.id }`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }),
        })
          .then((res) => res.json())
          .then((data) => alert(data))
          .catch((err) => console.error('Erreur envoi position', err));
      }
    );

    setLocationSubscription(subscription);
  };

  const stopLocationTracking = () => {
    if (locationSubscription) {
      locationSubscription.remove();
      setLocationSubscription(null);
      console.log('Tracking GPS stoppé.');
    }
  };


  const fetchDriverBusInfo = async (idChauffeur: number): Promise<BusData | null> => {
    try {
      const response = await fetch(`http://192.168.43.145:3000/radarbus/bus/idChauffeur/${idChauffeur}`);
      const result = await response.json();

      if (response.ok && result.status === 200 && result.data.length > 0) {
        const bus = result.data[0];
        const busInfo: BusData = {
          matriculation: bus.matriculation,
          primus: bus.primus,
          terminus: bus.terminus,
          type: bus.type,
        };
        return busInfo;
      } else {
        console.warn("Aucun bus trouvé pour ce chauffeur.");
        return null;
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du bus :", error);
      return null;
    }
  };

 useEffect(() => {
    const getBusInfo = async () => {
      if (user?.id) {
        const busInfo = await fetchDriverBusInfo(user.id);
        setBusInfo(busInfo);
      } else {
        console.warn("Pas d'utilisateur connecté.");
      }
    };

    getBusInfo();
  }, [user]);

  useEffect(() => {
    return () => {
      stopLocationTracking();
    };
  }, []);


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2E86AB" />

      <View style={styles.header}>
        <Text style={styles.title}>Conducteur</Text>
        <Text style={styles.date}>{getCurrentDate()}</Text>
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>Bonjour, {user?.nom}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>

      <View style={[ styles.content, { paddingBottom: bottomPadding }]}>
        <View style={[
          styles.statusCard,
          { backgroundColor: isWorkingDay ? '#4CAF50' : '#FF9800' }
        ]}>
          <Text style={styles.statusTitle}>
            {isWorkingDay ? 'Journée en cours' : 'Journée non démarrée'}
          </Text>
          {isWorkingDay && startTime && (
            <Text style={styles.statusTime}>
              Démarrée à {formatTime(startTime)}
            </Text>
          )}
        </View>

        <Animated.View style={[
          styles.buttonContainer,
          { transform: [{ scale: buttonScale }] }
        ]}>
          <TouchableOpacity
            style={[
              styles.mainButton,
              { backgroundColor: isWorkingDay ? '#f44336' : '#4CAF50' }
            ]}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handleWorkDayToggle}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              {isWorkingDay ? ' Terminer ma journée' : ' Démarrer ma journée'}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Statut actuel</Text>
            <Text style={styles.infoValue}>
              {isWorkingDay ? 'En service' : 'Hors service'}
            </Text>
          </View>

          {isWorkingDay && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Temps de service</Text>
              <Text style={styles.infoValue}>
                Depuis {startTime ? formatTime(startTime) : '--:--'}
              </Text>
            </View>
          )}
        </View>
        {busInfo && (
          <View style={styles.busInfoContainer}>
            <Text style={styles.busInfoTitle}>Informations Bus</Text>

            <View style={styles.busInfoItem}>
              <Text style={styles.infoLabel}>Matriculation</Text>
              <Text style={styles.infoValue}>{busInfo.matriculation}</Text>
            </View>

            <View style={styles.busInfoItem}>
              <Text style={styles.infoLabel}>Type</Text>
              <Text style={styles.infoValue}>{busInfo.type}</Text>
            </View>

            <View style={styles.busInfoItem}>
              <Text style={styles.infoLabel}>Primus</Text>
              <Text style={styles.infoValue}>{busInfo.primus}</Text>
            </View>

            <View style={styles.busInfoItem}>
              <Text style={styles.infoLabel}>Terminus</Text>
              <Text style={styles.infoValue}>{busInfo.terminus}</Text>
            </View>
          </View>
        )}

      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Bonne journée et conduite sécuritaire ! 🚦
        </Text>
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2E86AB',
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  date: {
    fontSize: 16,
    color: '#E6F3FF',
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  statusCard: {
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  statusTime: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  buttonContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  mainButton: {
    width: width * 0.8,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#2E86AB',
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  userInfo: {
  marginTop: 20,
  marginBottom: 10,
  paddingHorizontal: 20,
  alignItems: 'center'
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2E86AB',
    marginBottom: 4,
  },

  userEmail: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center'
  },
    busInfoContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  busInfoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E86AB',
    marginBottom: 10,
    textAlign: 'center',
  },
  busInfoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },


});

export default Driver;