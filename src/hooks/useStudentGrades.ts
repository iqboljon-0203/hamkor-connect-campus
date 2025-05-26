import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

export function useStudentGrades(userId: string) {
  return useQuery({
    queryKey: ["student-grades", userId],
    queryFn: async () => {
      // 1. Student yuborgan barcha javoblar
      const { data: answersData, error: answersError } = await supabase
        .from("answers")
        .select("id, task_id, file_url, score, description, teacher_comment")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (answersError) throw answersError;
      if (!answersData || answersData.length === 0) return [];

      // 2. Tasklar
      const taskIds = Array.from(new Set(answersData.map((a) => a.task_id)));
      const { data: tasks, error: tasksError } = await supabase
        .from("tasks")
        .select("id, title, type, group_id")
        .in("id", taskIds);
      if (tasksError) throw tasksError;

      // 3. Guruhlar
      const groupIds = Array.from(
        new Set((tasks || []).map((t) => t.group_id))
      );
      const { data: groups, error: groupsError } = await supabase
        .from("groups")
        .select("id, name")
        .in("id", groupIds);
      if (groupsError) throw groupsError;

      const taskMap = Object.fromEntries(
        (tasks || []).map((t) => [
          t.id,
          { title: t.title, type: t.type, group_id: t.group_id },
        ])
      );
      const groupMap = Object.fromEntries(
        (groups || []).map((g) => [g.id, g.name])
      );

      // 4. Mapping
      return (answersData || []).map((a) => ({
        id: a.id,
        title: taskMap[a.task_id]?.title || "Noma'lum",
        type: taskMap[a.task_id]?.type || "homework",
        group: groupMap[taskMap[a.task_id]?.group_id] || "Noma'lum",
        answer: a.file_url,
        grade: a.score,
        studentDesc: a.description,
        teacherComment: a.teacher_comment,
      }));
    },
    staleTime: 1000 * 60 * 2,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });
}
