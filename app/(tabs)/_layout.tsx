import { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";
import { supabase } from "../../supabaseConfig";
import { registerForPushNotificationsAsync } from "../../hooks/notifications"; // Importe a função de notificações

export default function Layout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [pushToken, setPushToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data?.session) {
        // Se não estiver logado, redireciona para a tela de login
        router.replace("/login");
      } else {
        // Se estiver logado, permite que a navegação aconteça
        setIsLoggedIn(true);
        
        // Solicitar permissão de notificações e obter o token
        const token = await registerForPushNotificationsAsync();
        if (token) {
          setPushToken(token); // Armazena o token recebido
        }
      }
    };

    checkAuth();
  }, [router]);

  // Caso o usuário não esteja logado, você pode mostrar algo enquanto a verificação acontece
  if (!isLoggedIn) {
    return null; // Ou pode renderizar um "Carregando..." ou algo para a UX
  }

  // Renderiza o conteúdo da navegação, se o usuário estiver logado
  return (
    <>
      {/* Aqui você pode mostrar notificações ou o que achar necessário */}
      <Stack />
    </>
  );
}
