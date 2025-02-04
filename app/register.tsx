import React, { useState } from "react";
import { View, Text, TextInput, Alert, TouchableOpacity, StyleSheet } from "react-native";
import { supabase } from "../supabaseConfig";

const RegisterScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      Alert.alert("Erro ao cadastrar", error.message);
      return;
    }

    Alert.alert("Sucesso!", "Verifique seu e-mail para confirmar a conta.");
    navigation.navigate("Login"); // Redireciona para a tela de login
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Conta</Text>

      <TextInput
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>Já tem uma conta? Entre aqui</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#f5f5f5", // Fundo claro
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#4A90E2", // Cor suave para o título
  },
  input: {
    width: "100%",
    padding: 15,
    marginBottom: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#4A90E2", // Cor de fundo para o botão
    paddingVertical: 15,
    width: "100%",
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
    color: "#4A90E2",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});

export default RegisterScreen;
