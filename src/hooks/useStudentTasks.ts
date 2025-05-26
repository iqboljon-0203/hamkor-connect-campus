import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

export function useStudentTasks(groupId: string) {
  return useQuery({
    queryKey: ["student-tasks", groupId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("id, title, deadline, description")
        .eq("group_id", groupId)
        .order("deadline", { ascending: true });
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 2,
  });
}
