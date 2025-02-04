import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, FlatList, Alert, Switch } from "react-native";
import { supabase } from "../supabaseConfig";
import { useRouter } from "expo-router";
import { scheduleNotification, cancelNotification } from "../hooks/notifications"; // Importe a função de cancelamento também

type Medicine = {
  id: string;
  nome: string;
  dose: string;
  schedule: string;  // Hora programada para o medicamento
  user_id: string;
  notification_sent: boolean; // Adicionei essa propriedade para controlar se a notificação foi enviada
};

export default function MedicinesScreen() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchMedicines = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError || !userData?.user) {
        Alert.alert("Erro", "Usuário não autenticado.");
        return;
      }

      const { data, error } = await supabase
        .from("medicines")
        .select("*")
        .eq("user_id", userData.user.id);

      if (error) {
        Alert.alert("Erro", error.message);
      } else {
        setMedicines(data as Medicine[]);
      }
    };

    fetchMedicines();
  }, []);

  const handleDelete = async (id: string) => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir este medicamento?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase.from("medicines").delete().eq("id", id);

            if (error) {
              Alert.alert("Erro", error.message);
            } else {
              setMedicines((prevMedicines) =>
                prevMedicines.filter((medicine) => medicine.id !== id)
              );
              Alert.alert("Sucesso", "Remédio excluído com sucesso!");
            }
          },
        },
      ]
    );
  };

  const handleEdit = (id: string) => {
    router.push(`/edit-medicine?id=${id}`);
  };

  const handleOpenCalendar = (id: string) => {
    router.push({ pathname: "/MedicineCalendar", params: { medicineId: id } });
  };

  const handleToggleNotification = async (medicine: Medicine) => {
    setLoading(true);

    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData?.user) {
      Alert.alert("Erro", "Usuário não autenticado.");
      setLoading(false);
      return;
    }

    // Inverte o estado de `notification_sent`
    const updatedNotificationSent = !medicine.notification_sent;

    const { error } = await supabase
      .from("medicines")
      .update({ notification_sent: updatedNotificationSent })
      .eq("id", medicine.id);

    if (error) {
      Alert.alert("Erro", error.message);
    } else {
      if (updatedNotificationSent) {
        // Construir a data e hora com base no horário programado
        const [hours, minutes] = medicine.schedule.split(":").map(Number);
        const now = new Date();
        now.setHours(hours, minutes, 0, 0); // Define a hora, minuto, segundo e milissegundo

        if (isNaN(now.getTime())) {
          Alert.alert("Erro", `Horário inválido para ${medicine.nome}`);
        } else {
          // A notificação será agendada para todos os dias no mesmo horário
          scheduleNotification(medicine.nome, `Hora de tomar: ${medicine.dose}`, now);
          Alert.alert(
            "Notificação Agendada",
            `A notificação para ${medicine.nome} foi agendada para todos os dias às ${now.toLocaleTimeString()}`
          );
        }
      } else {
        // Cancelar a notificação se estiver desabilitada
        cancelNotification(medicine.id);
        Alert.alert("Notificação Desabilitada", `A notificação para ${medicine.nome} foi desabilitada.`);
      }
    }

    setLoading(false);
  };

  const renderMedicineItem = ({ item }: { item: Medicine }) => (
    <View style={styles.medicineCard}>
      <Text style={styles.medicineName}>{item.nome}</Text>
      <Text style={styles.medicineDetail}>Dosagem: {item.dose}</Text>
      <Text style={styles.medicineDetail}>Horário: {item.schedule}</Text>

      <View style={styles.buttonContainer}>
        <Button title="Editar" onPress={() => handleEdit(item.id)} color="#4A90E2" />
        <Button title="Excluir" onPress={() => handleDelete(item.id)} color="red" />
      </View>

      <View style={styles.calendarButton}>
        <Button title="Abrir Calendário" onPress={() => handleOpenCalendar(item.id)} color="#28a745" />
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Notificações</Text>
        <Switch
          value={item.notification_sent}
          onValueChange={() => handleToggleNotification(item)}
          disabled={loading}  // Mantém o switch desabilitado durante o processo de carregamento
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Medicamentos Cadastrados</Text>
      <FlatList
        data={medicines}
        renderItem={renderMedicineItem}
        keyExtractor={(item) => item.id}
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
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  medicineCard: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 5 },
  },
  medicineName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  medicineDetail: {
    fontSize: 16,
    color: "#666",
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  calendarButton: {
    marginTop: 10,
  },
  switchContainer: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  switchLabel: {
    fontSize: 16,
    color: "#666",
  },
});
