import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { Calendar, CalendarProps } from "react-native-calendars";
import { supabase } from "../supabaseConfig";
import { useRoute } from "@react-navigation/native";

interface MedicineCalendarRouteParams {
  medicineId?: string;
}

export default function MedicineCalendarScreen() {
  const [markedDates, setMarkedDates] = useState<{
    [key: string]: { selected: boolean; marked: boolean; dotColor: string; medicineId?: string };
  }>({});
  const [medicineId, setMedicineId] = useState<string | null>(null);

  const route = useRoute();
  const { medicineId: queryMedicineId } = route.params as MedicineCalendarRouteParams;

  useEffect(() => {
    if (queryMedicineId) {
      setMedicineId(queryMedicineId);
      fetchMedicineUsage(queryMedicineId); // Passar o medicineId como argumento
    } else {
      Alert.alert("Erro", "Medicamento não encontrado.");
    }
  }, [queryMedicineId]);

  const fetchMedicineUsage = async (medicineId: string) => {
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData?.user) {
      Alert.alert("Erro", "Usuário não autenticado.");
      return;
    }

    const { data, error } = await supabase
      .from("medicine_usage")
      .select("*")
      .eq("user_id", userData.user.id)
      .eq("medicine_id", medicineId);

    if (error) {
      Alert.alert("Erro", error.message);
    } else {
      const dates = data.reduce((acc: any, item: any) => {
        acc[item.date] = { selected: true, marked: true, dotColor: "green", medicineId: item.medicine_id };
        return acc;
      }, {});
      setMarkedDates(dates);
    }
  };

  const handleDayPress: CalendarProps["onDayPress"] = async (day) => {
    const date = day.dateString;

    if (markedDates[date]) {
      Alert.alert("Info", "Este dia já foi marcado como tomado.");
      return;
    }

    if (!medicineId) {
      Alert.alert("Erro", "Medicamento não encontrado.");
      return;
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData?.user) {
      Alert.alert("Erro", "Usuário não autenticado.");
      return;
    }

    const { error } = await supabase.from("medicine_usage").insert([
      {
        user_id: userData.user.id,
        date, // Data do uso do medicamento
        medicine_id: medicineId, // Usa o medicine_id definido
      },
    ]);

    if (error) {
      Alert.alert("Erro", error.message);
    } else {
      setMarkedDates((prevState) => ({
        ...prevState,
        [date]: { selected: true, marked: true, dotColor: "green", medicineId },
      }));
      Alert.alert("Sucesso", "Medicamento marcado como tomado!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calendário de Uso do Medicamento</Text>
      <Calendar
        markedDates={markedDates}
        onDayPress={handleDayPress}
        theme={{
          selectedDayBackgroundColor: "#4CAF50",
          todayTextColor: "#FF5722",
          arrowColor: "#4CAF50",
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
});
