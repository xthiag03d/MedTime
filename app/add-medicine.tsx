import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../supabaseConfig";
import { Ionicons } from "@expo/vector-icons"; // Importando o ícone

export default function AddMedicineScreen() {
  const [medicineName, setMedicineName] = useState("");
  const [dose, setDose] = useState("");
  const [schedule, setSchedule] = useState("");
  const [observations, setObservations] = useState("");
  const router = useRouter();

  const handleAddMedicine = async () => {
    if (!medicineName || !dose || !schedule) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios.");
      return;
    }

    // Obtendo o usuário logado
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      Alert.alert("Erro", "Usuário não autenticado.");
      return;
    }

    // Adicionando remédio no banco de dados
    const { error } = await supabase.from("medicines").insert([
      {
        nome: medicineName,
        dose,
        schedule,
        observations,
        user_id: user.id, // Associando ao usuário logado
      },
    ]);

    if (error) {
      Alert.alert("Erro ao adicionar remédio", error.message);
    } else {
      Alert.alert("Sucesso", "Remédio adicionado com sucesso!");
      setMedicineName("");
      setDose("");
      setSchedule("");
      setObservations("");
      router.push("/medicines"); // Redireciona para a Home após adicionar
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.push("/")} style={styles.backButton}>
        <Ionicons name="home" size={30} color="#4A90E2" />
      </TouchableOpacity>

      <Text style={styles.title}>Adicionar Remédio</Text>

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
        style={[styles.input, styles.textArea]}
        multiline
      />

      <View style={styles.buttonContainer}>
        <Button title="ADICIONAR" onPress={handleAddMedicine} color="#4A90E2" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  backButton: {
    marginTop: 20,
    marginBottom: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 15,
    marginBottom: 20,
    borderRadius: 10,
    fontSize: 17,
    backgroundColor: "#fff", // Fundo branco para maior visibilidade
    elevation: 3, // Sombra suave nos campos de entrada
  },
  textArea: {
    height: 100,
  },
  buttonContainer: {
    marginTop: 30,
    marginBottom: 40,
  },
});
