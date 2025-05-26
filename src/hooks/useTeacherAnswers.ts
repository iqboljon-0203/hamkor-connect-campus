import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

export function useTeacherAnswers(taskId: string) {
  return useQuery({
    queryKey: ["teacher-answers", taskId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("answers")
        .select("id, user_id, created_at, file_url, grade, teacher_comment")
        .eq("task_id", taskId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 2,
  });
}
