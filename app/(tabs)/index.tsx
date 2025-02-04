import { View, Text, Button, StyleSheet, ScrollView, Image } from "react-native";
import { useRouter } from "expo-router";

export default function HomePage() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/images/logo.png")}  // Altere para o caminho do seu logo
          style={styles.logo}
        />
      </View>

      <Text style={styles.headerText}>Bem-vindo ao MedTime!</Text>
      <Text style={styles.subHeaderText}>
        Gerencie seus remédios e lembretes de forma simples e eficiente.
      </Text>

      {/* Cartões de ação */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Adicione um novo remédio</Text>
        <Text style={styles.cardDescription}>
          Mantenha o controle das doses e horários para não esquecer de tomar.
        </Text>
        <Button
          title="Adicionar Remédio"
          onPress={() => router.push("/add-medicine")}
          color="#4A90E2" // Cor personalizada para o botão
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Veja seus remédios cadastrados</Text>
        <Text style={styles.cardDescription}>
          Acesse facilmente a lista de remédios que você já cadastrou.
        </Text>
        <Button
          title="Ver Remédios"
          onPress={() => router.push("/medicines")}
          color="#4A90E2"
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Gerencie seu perfil</Text>
        <Text style={styles.cardDescription}>
          Edite suas preferências e configurações de notificações.
        </Text>
        <Button
          title="Editar Perfil"
          onPress={() => router.push("/profile")}
          color="#4A90E2"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f9", // Cor de fundo suave
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 120,  // Tamanho do logo
    height: 120, // Tamanho do logo
    resizeMode: "contain", // Garantir que o logo não distorça
  },
  headerText: {
    fontSize: 30,  // Tamanho maior para o título
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    color: "#4A90E2",
  },
  subHeaderText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#555",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12, // Arredondar mais os cantos
    padding: 20,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5, // Sombra para dispositivos Android
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  cardDescription: {
    fontSize: 14,
    marginBottom: 15,
    color: "#777",
  },
});
