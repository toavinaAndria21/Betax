import React, { useRef, useEffect, useState } from 'react';
import { Animated, View, StyleSheet, Text } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Input from './Input';
import Button from './Button';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function DestinationPicker({ visible, onClose }: Props) {
  const [actualLocation, setActualLocation] = useState<string>('');
  const [destination, setDestination] = useState<string>('');

  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : 300, 
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  return (
    <View style={styles.overlay}>
      <Animated.View
        style={[
          styles.modalContent,
          { transform: [{ translateY: slideAnim }] },
        ]}
       >
        <Text style={ styles.title }>Trouvez votre itinéraire</Text>
        <View style={ styles.inputContainer}>
            <Input 
                value={ actualLocation }
                onChange={ setActualLocation }
                icon={ <MaterialIcons name='location-on' color={'#fff'} size={24}/> }
            />
             <Input 
                value={ destination }
                onChange={ setDestination }
                icon={ <MaterialIcons name='my-location' color={'#fff'} size={24}/> }
            />
            <Button label='Trouver un bus'/>
        </View>
       </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 10,
  },
  modalContent: {
    height: '40%',
    width: '98%',
    backgroundColor: '#393E46',
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    padding: 10,
  },
  title: { 
    color: '#fff', 
    textAlign:'center', 
    textTransform: 'uppercase',
    fontSize: 16,
    fontWeight: 'bold'
  },
  inputContainer: {
    width: '100%',
    height: '100%'
  }
});
