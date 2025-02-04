import React, { useState } from "react";
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../supabaseConfig";

const LoginScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert("Erro ao entrar", error.message);
      return;
    }

    router.replace("/(tabs)"); // Redireciona para a tela principal após o login
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require('../assets/images/logo2.png')} style={styles.logo} />

      {/* Título de boas-vindas */}
      <Text style={styles.title}>Bem-vindo!</Text>

      {/* Campos de entrada */}
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

      {/* Botão de login */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      {/* Link para registro */}
      <TouchableOpacity onPress={() => router.push("/register")}>
        <Text style={styles.link}>Ainda não tem uma conta? Registre-se</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    backgroundColor: "#f5f5f5",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#4A90E2", // Cor suave para o título
    textAlign: "center",
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
    textAlign: "center",
  },
});

export default LoginScreen;
