import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

export function useTeacherAnswersData(userId: string) {
  return useQuery({
    queryKey: ["teacher-answers-data", userId],
    queryFn: async () => {
      // 1. Ustoz yaratgan guruhlar
      const { data: groups, error: groupsError } = await supabase
        .from("groups")
        .select("id, name")
        .eq("created_by", userId);
      if (groupsError) throw groupsError;
      if (!groups || groups.length === 0) return [];
      const groupIds = groups.map((g) => g.id);
      // 2. Shu guruhlarga tegishli topshiriqlar
      const { data: tasks, error: tasksError } = await supabase
        .from("tasks")
        .select("id, title, group_id")
        .in("group_id", groupIds);
      if (tasksError) throw tasksError;
      if (!tasks || tasks.length === 0) return [];
      const taskIds = tasks.map((t) => t.id);
      const taskMap = Object.fromEntries(tasks.map((t) => [t.id, t]));
      // 3. Shu topshiriqlarga yuborilgan barcha javoblar
      const { data: answersData, error: answersError } = await supabase
        .from("answers")
        .select(
          "id, user_id, task_id, file_url, description, created_at, score, teacher_comment"
        );
      if (answersError) throw answersError;
      if (!answersData) return [];
      // 4. Studentlar va guruh nomlarini olish uchun profiles va groupsdan ma'lumotlarni yig'ish
      const userIds = Array.from(new Set(answersData.map((a) => a.user_id)));
      const { data: students } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", userIds);
      const studentMap = Object.fromEntries(
        (students || []).map((s) => [s.id, s.full_name])
      );
      const groupMap = Object.fromEntries(
        (groups || []).map((g) => [g.id, g.name])
      );
      // 5. Faqat ustoz guruhlariga tegishli va taskId mos bo'lgan javoblarni yig'ish
      const filteredAnswers = answersData
        .filter((a) => taskIds.includes(a.task_id))
        .map((a) => ({
          id: a.id,
          student: studentMap[a.user_id] || "Noma'lum",
          group: groupMap[taskMap[a.task_id]?.group_id] || "Noma'lum",
          task: taskMap[a.task_id]?.title || "Noma'lum",
          submittedAt: a.created_at?.split("T")[0] || "",
          fileUrl: a.file_url,
          score: a.score,
          description: a.description,
          teacher_comment: a.teacher_comment,
        }));
      return filteredAnswers;
    },
    staleTime: 1000 * 60 * 2,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });
}
