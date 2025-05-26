import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

export function useStudentDashboard(userId: string) {
  return useQuery({
    queryKey: ["student-dashboard", userId],
    queryFn: async () => {
      const [tasks, stats, activity] = await Promise.all([
        supabase
          .from("tasks")
          .select("id, title, deadline")
          .eq("student_id", userId)
          .order("deadline", { ascending: true })
          .limit(3),
        supabase.from("stats").select("*").eq("student_id", userId).single(),
        supabase
          .from("activity")
          .select("*")
          .eq("student_id", userId)
          .order("created_at", { ascending: false })
          .limit(5),
      ]);
      if (tasks.error) throw tasks.error;
      if (stats.error) throw stats.error;
      if (activity.error) throw activity.error;
      return {
        tasks: tasks.data,
        stats: stats.data,
        activity: activity.data,
      };
    },
    staleTime: 1000 * 60 * 2,
  });
}
