import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

export function useTeacherDashboard(userId: string) {
  return useQuery({
    queryKey: ["teacher-dashboard", userId],
    queryFn: async () => {
      const [groups, tasks, answers] = await Promise.all([
        supabase.from("groups").select("id, name").eq("teacher_id", userId),
        supabase
          .from("tasks")
          .select("id, title, deadline")
          .eq("teacher_id", userId)
          .order("deadline", { ascending: true })
          .limit(3),
        supabase
          .from("answers")
          .select("id, task_id, user_id, created_at, file_url, grade")
          .order("created_at", { ascending: false })
          .limit(5),
      ]);
      if (groups.error) throw groups.error;
      if (tasks.error) throw tasks.error;
      if (answers.error) throw answers.error;
      return {
        groups: groups.data,
        tasks: tasks.data,
        answers: answers.data,
      };
    },
    staleTime: 1000 * 60 * 2,
  });
}
