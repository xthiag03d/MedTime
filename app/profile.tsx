import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity } from "react-native";
import { supabase } from "../supabaseConfig";
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const [userData, setUserData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        Alert.alert("Erro", error.message);
      } else {
        setUserData(data.user);
        setNewName(data.user?.user_metadata?.full_name || "");
        setNewPhone(data.user?.user_metadata?.phone || "");
      }
    };

    fetchUserData();
  }, []);

  const handleUpdateProfile = async () => {
    if (!newName) {
      Alert.alert("Erro", "O nome não pode estar vazio.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      data: { full_name: newName, phone: newPhone },
    });

    if (error) {
      Alert.alert("Erro", error.message);
    } else {
      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
      setUserData({ ...userData, user_metadata: { full_name: newName, phone: newPhone } });
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>

      {/* Exibe a foto do perfil ou uma imagem padrão */}
      <View style={styles.avatarContainer}>
        <Image
          source={userData?.user_metadata?.avatar_url ? { uri: userData?.user_metadata?.avatar_url } : require("../assets/images/default-avatar.png")}
          style={styles.avatar}
        />
      </View>

      {/* Exibe as informações do usuário */}
      <View style={styles.profileInfo}>
        <Text style={styles.label}>Nome:</Text>
        <TextInput
          value={newName}
          onChangeText={setNewName}
          style={styles.input}
        />

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.infoText}>{userData?.email}</Text>

        <Text style={styles.label}>Telefone:</Text>
        <TextInput
          value={newPhone}
          onChangeText={setNewPhone}
          style={styles.input}
          keyboardType="phone-pad"
        />
      </View>

      {/* Botão de atualização do perfil */}
      <Button
        title={loading ? "Atualizando..." : "Atualizar Perfil"}
        onPress={handleUpdateProfile}
        disabled={loading}
        color="#4CAF50"
      />

      {/* Botão de logout usando TouchableOpacity */}
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Ionicons name="log-out-outline" size={24} color="red" style={styles.logoutIcon} />
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#4CAF50",
    marginBottom: 20,
  },
  profileInfo: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
  },
  infoText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 15,
  },
  logoutButton: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  logoutIcon: {
    marginRight: 10,
  },
  logoutText: {
    fontSize: 16,
    color: "red",
    fontWeight: "bold",
  },
});
