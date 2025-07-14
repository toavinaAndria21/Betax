import DateFilterButton from "@/components/DateFilterButton";
import HistoryCard from "@/components/HistoryCard";
import Input from "@/components/Input";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";
import dayjs from "dayjs";
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { useUser } from "@/context/UserContext";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export default function History() {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedFilter, setSelectedFilter] = useState<string>('Tous');
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<Array<any>>([]);
    const { user } = useUser();


    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://192.168.43.145:3000/radarbus/prendre/voyageur/${user.id}`); 
            const json = await response.json();

            if (json.status === 200 && json.result && Array.isArray(json.data)) {
            const mappedData = json.data.map((item: any, index: number) => ({
                id: index + 1,
                busType: item.bus?.type?.toString() || "Inconnu",
                trajet: `${item.bus?.primus ?? "Inconnu"} - ${item.bus?.terminus ?? "Inconnu"}`,
                matriculation: item.bus?.matriculation ?? "Inconnu",
                frais: item.bus?.frais?.toString() ?? "0",
                date: item.date,
                distance: item?.bus?.distance.toFixed(2)
            }));

            setData(mappedData);
            } else {
            console.error("Réponse API inattendue :", json);
            setData([]);
            }

        } catch (error) {
            console.error("Erreur fetch :", error);
            setData([]);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchData();
    }, []);

    const filteredData = data.filter(item => {
        const trajet = item.trajet?.toLowerCase() || "";
        const matriculation = item.matriculation?.toLowerCase() || "";
        const search = searchTerm.toLowerCase();

        const matchSearch = trajet.includes(search) || matriculation.includes(search);

        const dateItem = dayjs(item.date);
        const now = dayjs();

        let matchDate = true;

        if (selectedFilter === "Cette semaine") {
            matchDate = dateItem.isSameOrAfter(now.startOf("week")) && dateItem.isSameOrBefore(now.endOf("week"));
        } else if (selectedFilter === "Ce mois") {
            matchDate = dateItem.isSameOrAfter(now.startOf("month")) && dateItem.isSameOrBefore(now.endOf("month"));
        }

        return matchSearch && matchDate;
    });

    return (
        <View style={styles.container}>
        <View style={styles.header}>
            <View style={{ flex: 1 }}>
            <Input
                value={searchTerm}
                onChange={setSearchTerm}
                placeHolder="Recherche"
                bgColor="#fff"
                icon={<MaterialIcons name="search" size={32} color={'gray'} />}
            />
            </View>
            <DateFilterButton
            onFilterSelected={(selected) => {
                setSelectedFilter(selected);
            }}
            />
        </View>

        <View style={styles.mainContent}>
            {loading ? (
            <Text style={styles.textBold}>Chargement...</Text>
            ) : filteredData.length === 0 ? (
            <Text style={styles.textBold}>Aucun historique trouvé</Text>
            ) : (
            <FlatList
                data={filteredData}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                <HistoryCard
                    busType={item.busType}
                    trajet={item.trajet}
                    matriculation={item.matriculation}
                    frais={item.frais}
                    date={item.date}
                    distance={item.distance}
                />
                )}
            />
            )}
        </View>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EEEEEE',
    height: '100%',
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 5,
  },
  mainContent: {
    flex: 1,
    padding: 5,
  },
  textBold: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    color: '#36454F',
  },
});
