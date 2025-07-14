import React from "react";
import { View, Text, StyleSheet } from "react-native";
import dayjs from 'dayjs';

export default function HistoryCard({ 
    busType = "40", 
    trajet = "Antanifotsy - Ankofafa", 
    matriculation = "3456 TBA", 
    frais = "1500", 
    date = "2025-07-13T18:53:33.639Z",
    distance = "0"
    }) {

    const getBusTypeColor = (type: string) => {
        switch(type.toUpperCase()) {
            case '40': return '#FFD63A';
            case '21': return '#2196F3'; 
            case '33': return '#FF9800';
            default: return '#9C27B0';
        }
    };

    const formattedDate = dayjs(date).format('DD/MM/YYYY HH:mm');

    return(
        <View style={styles.cardContainer}>
            <View style={styles.busTypeContainer}>
                <View style={[styles.busTypeLogo, { backgroundColor: getBusTypeColor(busType) }]}>
                    <Text style={styles.busTypeText}>{busType.toUpperCase()}</Text>
                </View>
            </View>

            <View style={styles.cardInfoSection}>
                <View style={ styles.leftSection }>
                    <Text style={ styles.textBold } numberOfLines={1}>{ trajet }</Text>
                    <Text style={ styles.textSuperLight }>{ distance } km</Text>
                    <Text style={ styles.textLight }>{ matriculation }</Text>
                </View>
                <View style={ styles.rightSection }>
                    <Text style={ styles.textBold }>{ frais } Ar</Text>
                    <Text style={ [styles.textSuperLight] }>{ formattedDate }</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: "#fff",
        borderRadius: 12,
        marginVertical: 6,
        marginHorizontal: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        flexDirection: 'row',
        padding: 10,

    },
    busTypeContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10
    },
    busTypeLogo: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    busTypeText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    cardInfoSection: {
        flex: 1,
        flexDirection: 'row'        
    },
    leftSection: {
        flex: 2,
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 5
    },
    rightSection: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
    },
    textBold: {
        fontWeight: 'bold',
        fontSize: 14,
        color: '#36454F'
    },
    textLight: {
        fontWeight: 'light',
        fontSize: 12,
        color: '#36454F',
        textAlign: 'center'
    },
    textSuperLight: {
        fontSize: 10,
        color: '#36454F'
    }
});