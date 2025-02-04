import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { supabase } from "../../supabaseConfig"; // Certifique-se de que seu arquivo supabaseConfig está configurado corretamente

export default function HomePage() {
  const router = useRouter();
  interface Medicine {
    nome: string;
    dose: string;
    schedule: string;
  }
  
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [nextMedicine, setNextMedicine] = useState<Medicine | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Função para formatar o horário para comparação
  const convertTo24Hour = (time: string) => {
    const [hours, minutes, period] = time.split(/[: ]/);
    let hour = parseInt(hours, 10);
    if (period === "PM" && hour !== 12) {
      hour += 12;
    } else if (period === "AM" && hour === 12) {
      hour = 0;
    }
    return hour * 60 + parseInt(minutes, 10); // Converte para minutos
  };

  // Função para realizar o refresh na página
  const handleRefresh = async () => {
    setIsRefreshing(true);

    // Buscando novamente os medicamentos
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from("medicines")
        .select("nome, dose, schedule")
        .eq("user_id", user.id);

      if (error) {
        console.error("Erro ao buscar medicamentos:", error.message);
      } else {
        setMedicines(data);
        const next = getNextMedicine(data);
        setNextMedicine(next);
      }
    }

    setIsRefreshing(false);
  };

  // Função para buscar o próximo remédio
  const getNextMedicine = (medicines: any) => {
    const currentTime = new Date();
    const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

    // Ordenar os medicamentos pela hora
    const sortedMedicines = medicines.sort((a: any, b: any) => {
      return convertTo24Hour(a.schedule) - convertTo24Hour(b.schedule);
    });

    // Encontrar o próximo remédio
    for (let medicine of sortedMedicines) {
      if (convertTo24Hour(medicine.schedule) > currentMinutes) {
        return medicine;
      }
    }

    // Caso não encontre (todos os remédios sejam passados)
    return sortedMedicines[0]; // Retorna o primeiro remédio do dia
  };

  // Buscar medicamentos do banco de dados
  useEffect(() => {
    const fetchMedicines = async () => {
      // Pega o user_id autenticado do Supabase
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data, error } = await supabase
          .from("medicines")
          .select("nome, dose, schedule")
          .eq("user_id", user.id);  // Usando o user.id autenticado

        if (error) {
          console.error("Erro ao buscar medicamentos:", error.message);
        } else {
          setMedicines(data);
          const next = getNextMedicine(data);
          setNextMedicine(next);
        }
      } else {
        console.error("Usuário não autenticado");
      }
    };

    fetchMedicines();
  }, []);

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
        />
      }>
      {/* Logo e Bem-vindo */}
      <View style={styles.logoContainer}>
        <Image source={require("../../assets/images/logo2.png")} style={styles.logo} />
        <Text style={styles.headerText}>Bem-vindo ao MedTime!</Text>
        <Text style={styles.subHeaderText}>Gerencie seus remédios e lembretes facilmente.</Text>
      </View>

      {/* Próximo lembrete */}
      {nextMedicine && (
        <View style={styles.reminderCard}>
          <Ionicons name="alarm-outline" size={40} color="#FF5733" />
          <View style={styles.reminderText}>
            <Text style={styles.reminderTitle}>Próximo Remédio</Text>
            <Text style={styles.reminderInfo}>
              {nextMedicine.nome} - {nextMedicine.schedule}
            </Text>
          </View>
        </View>
      )}

      {/* Cartões de ação */}
      <TouchableOpacity style={styles.card} onPress={() => router.push("/add-medicine")}>
        <Ionicons name="add-circle-outline" size={40} color="#4A90E2" />
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>Adicionar Remédio</Text>
          <Text style={styles.cardDescription}>Controle suas doses e horários com facilidade.</Text>
        </View>
      </TouchableOpacity>

      {/* Adicionar Dependente */}
      <TouchableOpacity style={styles.card} onPress={() => router.push("/add-dependent")}>
        <Ionicons name="person-add-outline" size={40} color="#4A90E2" />
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>Adicionar Dependente</Text>
          <Text style={styles.cardDescription}>Adicione dependentes para gerenciar os remédios deles também.</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => router.push("/medicines")}>
        <Ionicons name="medkit-outline" size={40} color="#4A90E2" />
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>Ver Meus Remédios</Text>
          <Text style={styles.cardDescription}>Consulte sua lista de medicamentos cadastrados.</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => router.push("/profile")}>
        <Ionicons name="person-circle-outline" size={40} color="#4A90E2" />
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>Meu Perfil</Text>
          <Text style={styles.cardDescription}>Edite suas informações e configurações.</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f9",
    padding: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
    color: "#4A90E2",
  },
  subHeaderText: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
  },
  reminderCard: {
    backgroundColor: "#FFF3E0",
    borderRadius: 12,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  reminderText: {
    marginLeft: 15,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF5733",
  },
  reminderInfo: {
    fontSize: 14,
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardText: {
    marginLeft: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  cardDescription: {
    fontSize: 14,
    color: "#777",
  },
});
