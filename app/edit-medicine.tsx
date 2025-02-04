import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { supabase } from "../supabaseConfig";
import { useRouter, useLocalSearchParams } from "expo-router"; // Importação correta

export default function EditMedicineScreen() {
  const [medicineName, setMedicineName] = useState("");
  const [dose, setDose] = useState("");
  const [schedule, setSchedule] = useState("");
  const [observations, setObservations] = useState("");
  const router = useRouter();
  const { id } = useLocalSearchParams(); // Correção aqui

  useEffect(() => {
    if (id) {
      fetchMedicineDetails(id as string); // Garantir que 'id' é tratado como string
    }
  }, [id]);

  const fetchMedicineDetails = async (medicineId: string) => {
    const { data, error } = await supabase
      .from("medicines")
      .select("*")
      .eq("id", medicineId)
      .single();

    if (error) {
      Alert.alert("Erro", error.message);
    } else {
      setMedicineName(data.nome);
      setDose(data.dose);
      setSchedule(data.schedule);
      setObservations(data.observations || "");
    }
  };

  const handleSaveChanges = async () => {
    if (!medicineName || !dose || !schedule) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios.");
      return;
    }

    const { error } = await supabase
      .from("medicines")
      .update({
        nome: medicineName,
        dose,
        schedule,
        observations,
      })
      .eq("id", id);

    if (error) {
      Alert.alert("Erro ao editar remédio", error.message);
    } else {
      Alert.alert("Sucesso", "Remédio atualizado com sucesso!");
      router.push("/medicines"); // Volta para a tela de listagem de remédios
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Remédio</Text>

      <TextInput
        placeholder="Nome do Remédio"
        value={medicineName}
        onChangeText={setMedicineName}
        style={styles.input}
      />
      <TextInput
        placeholder="Dosagem"
        value={dose}
        onChangeText={setDose}
        style={styles.input}
      />
      <TextInput
        placeholder="Horários de Uso"
        value={schedule}
        onChangeText={setSchedule}
        style={styles.input}
      />
      <TextInput
        placeholder="Observações"
        value={observations}
        onChangeText={setObservations}
        style={[styles.input, { height: 100 }]} // Aumenta a altura do campo de observações
        multiline
      />

      <Button title="Salvar Alterações" onPress={handleSaveChanges} />
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
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
});
