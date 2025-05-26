import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

export function useStudentDashboardData(userId: string) {
  return useQuery({
    queryKey: ["student-dashboard-data", userId],
    queryFn: async () => {
      // 1. Student a'zo bo'lgan guruhlar
      const { data: memberData, error: memberError } = await supabase
        .from("group_members")
        .select("group_id")
        .eq("user_id", userId);
      if (memberError) throw memberError;
      const groupIds = (memberData || []).map((m) => m.group_id);
      if (!groupIds.length) {
        return {
          stats: { completed: 0, pending: 0, upcomingInternships: 0 },
          upcomingTasks: [],
          lastAnswers: [],
        };
      }
      // 2. Shu guruhlarga tegishli barcha topshiriqlar
      const { data: tasks, error: tasksError } = await supabase
        .from("tasks")
        .select("id, title, type, deadline, date, group_id")
        .in("group_id", groupIds);
      if (tasksError) throw tasksError;
      // 3. Student yuborgan javoblar
      const { data: answers, error: answersError } = await supabase
        .from("answers")
        .select("id, task_id, score, description, file_url, created_at")
        .eq("user_id", userId);
      if (answersError) throw answersError;
      // 4. Guruh nomlari
      const { data: groups, error: groupsError } = await supabase
        .from("groups")
        .select("id, name")
        .in("id", groupIds);
      if (groupsError) throw groupsError;
      const groupMap = Object.fromEntries(
        (groups || []).map((g) => [g.id, g.name])
      );
      // 5. Statistika
      const completed = (answers || []).filter((a) => a.score !== null).length;
      const answeredTaskIds = new Set((answers || []).map((a) => a.task_id));
      const pending = (tasks || []).filter(
        (t) =>
          !answeredTaskIds.has(t.id) ||
          (answers || []).some((a) => a.task_id === t.id && a.score === null)
      ).length;
      const now = new Date();
      const upcomingInternships = (tasks || []).filter(
        (t) => t.type === "internship" && t.date && new Date(t.date) > now
      ).length;
      // 6. Yaqinlashayotgan 3 ta topshiriq
      const filtered = (tasks || []).filter((t) => {
        const dateStr = t.type === "homework" ? t.deadline : t.date;
        return dateStr && new Date(dateStr) >= now;
      });
      const sorted = filtered
        .sort((a, b) => {
          const aDate = new Date(a.type === "homework" ? a.deadline : a.date);
          const bDate = new Date(b.type === "homework" ? b.deadline : b.date);
          return aDate.getTime() - bDate.getTime();
        })
        .slice(0, 3)
        .map((t) => {
          const answer = (answers || []).find((a) => a.task_id === t.id);
          let status: "pending" | "submitted" = "pending";
          if (answer && answer.score !== null) status = "submitted";
          return {
            ...t,
            group: groupMap[t.group_id] || "",
            status,
          };
        });
      // 7. So'nggi 3 ta javob
      const lastAnswers = (answers || [])
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .slice(0, 3)
        .map((a) => {
          const task = (tasks || []).find((t) => t.id === a.task_id) || {
            title: "",
            group_id: "",
          };
          return {
            id: a.id,
            taskTitle: task.title,
            group: groupMap[task.group_id] || "",
            date: a.created_at,
            desc: a.description,
            file_url: a.file_url,
          };
        });
      return {
        stats: { completed, pending, upcomingInternships },
        upcomingTasks: sorted,
        lastAnswers,
      };
    },
    staleTime: 1000 * 60 * 2,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });
}
