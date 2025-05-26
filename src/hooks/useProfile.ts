import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

export function useProfile(userId: string) {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, avatar, role")
        .eq("id", userId)
        .single();
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 daqiqa cache
  });
}
