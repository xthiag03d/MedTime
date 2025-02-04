import { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";
import { supabase } from "../supabaseConfig";

export default function Layout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace("/login");
      } else {
        setIsLoggedIn(true);
      }
    };

    checkAuth();
  }, []);

  return <Stack />;
}
