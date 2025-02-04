import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useState } from "react";
import { supabase } from "../supabaseConfig"; // Certifique-se de que seu arquivo supabaseConfig está configurado corretamente
import { useRouter } from "expo-router";

export default function AdicionarDependentes() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [relacionamento, setRelacionamento] = useState("");
  const [emailDependente, setEmailDependente] = useState(""); // Campo para o e-mail do dependente
  const [loading, setLoading] = useState(false);

  // Função para adicionar dependente no banco
  const handleAddDependente = async () => {
    if (!nome || !relacionamento || !emailDependente) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { error } = await supabase
        .from("dependents")
        .insert([
          {
            nome: nome,
            relacionamento: relacionamento,
            email: emailDependente, // Email do dependente
            user_id: user.id, // ID do usuário autenticado
          },
        ]);

      setLoading(false);

      if (error) {
        Alert.alert("Erro", "Não foi possível adicionar o dependente.");
        console.error(error);
      } else {
        Alert.alert("Sucesso", "Dependente adicionado com sucesso!");
        router.push("/medicines"); // Redireciona para a página inicial após sucesso
      }
    } else {
      Alert.alert("Erro", "Usuário não autenticado.");
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Adicionar Dependente</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome do dependente"
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        style={styles.input}
        placeholder="Relacionamento (Ex: Filho, Esposa)"
        value={relacionamento}
        onChangeText={setRelacionamento}
      />

      <TextInput
        style={styles.input}
        placeholder="E-mail do dependente"
        value={emailDependente}
        onChangeText={setEmailDependente}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleAddDependente}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Adicionando..." : "Adicionar Dependente"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f9",
    padding: 20,
    justifyContent: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    backgroundColor: "#737475",
    borderRadius: 6,
    padding: 15,
    marginBottom: 15,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  button: {
    backgroundColor: "#4A90E2",
    padding: 15,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    borderRadius: 6,
  },
});
