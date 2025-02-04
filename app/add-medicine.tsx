import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Switch } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { supabase } from "../supabaseConfig";
import { Ionicons } from "@expo/vector-icons";

export default function AddMedicineScreen() {
  const [medicineName, setMedicineName] = useState("");
  const [dose, setDose] = useState("");
  const [schedule, setSchedule] = useState("");
  const [observations, setObservations] = useState("");
  const [dependents, setDependents] = useState<any[]>([]);
  const [selectedDependent, setSelectedDependent] = useState("");
  const [addDependent, setAddDependent] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchDependents = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from("dependents")
          .select("*")
          .eq("user_id", user.id);
        if (error) {
          console.error(error);
          Alert.alert("Erro", "Não foi possível carregar os dependentes.");
        } else {
          setDependents(data);
        }
      }
    };
    fetchDependents();
  }, []);

  const handleAddMedicine = async () => {
    if (!medicineName || !dose || !schedule) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios.");
      return;
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      Alert.alert("Erro", "Usuário não autenticado.");
      return;
    }

    const { error } = await supabase.from("medicines").insert([{
      nome: medicineName,
      dose,
      schedule,
      observations,
      user_id: user.id,
      dependente_id: addDependent ? selectedDependent : null,
    }]);

    if (error) {
      Alert.alert("Erro ao adicionar remédio", error.message);
    } else {
      Alert.alert("Sucesso", "Remédio adicionado com sucesso!");
      setMedicineName("");
      setDose("");
      setSchedule("");
      setObservations("");
      setSelectedDependent("");
      setAddDependent(false);
      router.push("/medicines");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push("/")} style={styles.iconButton}>
            <Ionicons name="home" size={30} color="#4A90E2" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleAddMedicine} style={styles.iconButton}>
            <Ionicons name="add-circle" size={35} color="#4A90E2" />
          </TouchableOpacity>
        </View>

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

        <View style={styles.switchContainer}>
          <Text style={styles.label}>Adicionar Dependente?</Text>
          <Switch
            value={addDependent}
            onValueChange={setAddDependent}
            thumbColor={addDependent ? "#4A90E2" : "#ccc"}
            trackColor={{ true: "#4A90E2", false: "#ccc" }}
          />
        </View>

        {addDependent && (
          <View>
            <Text style={styles.label}>Selecione o Dependente</Text>
            <Picker
              selectedValue={selectedDependent}
              onValueChange={(itemValue) => setSelectedDependent(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Selecione um dependente" value="" />
              {dependents.map((dependente) => (
                <Picker.Item key={dependente.id} label={dependente.nome} value={dependente.id} />
              ))}
            </Picker>
          </View>
        )}
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    paddingBottom: 100,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
    justifyContent: "flex-start",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",  // Centraliza os ícones no topo
    alignItems: "center",
    marginBottom: 20,
  },
  iconButton: {
    marginHorizontal: 15,
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
    backgroundColor: "#737475",
    elevation: 3,
  },
  textArea: {
    height: 100,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "bold",
    color: "#333",
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 20,
    backgroundColor: "#333",
  },
});
