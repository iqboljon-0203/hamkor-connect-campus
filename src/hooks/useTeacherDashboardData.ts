import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

export function useTeacherDashboardData(userId: string) {
  return useQuery({
    queryKey: ["teacher-dashboard-data", userId],
    queryFn: async () => {
      // 1. Ustoz yaratgan guruhlar
      const { data: groups, error: groupsError } = await supabase
        .from("groups")
        .select("id, name")
        .eq("created_by", userId);
      if (groupsError) throw groupsError;
      const groupIds = (groups || []).map((g) => g.id);
      if (!groupIds.length) {
        return {
          stats: { groups: 0, tasks: 0, submissions: 0, pendingReviews: 0 },
          upcomingTasks: [],
          lastAnswers: [],
        };
      }
      // 2. Shu guruhlarga tegishli topshiriqlar
      const { data: tasks, error: tasksError } = await supabase
        .from("tasks")
        .select("id, title, type, group_id, deadline, date")
        .in("group_id", groupIds);
      if (tasksError) throw tasksError;
      const taskIds = (tasks || []).map((t) => t.id);
      // 3. Javoblar (answers)
      const {
        data: answers,
        error: answersError,
        count: submissionsCount,
      } = await supabase
        .from("answers")
        .select(
          "id, user_id, task_id, created_at, score, description, file_url",
          { count: "exact" }
        )
        .in("task_id", taskIds);
      if (answersError) throw answersError;
      // 4. Baholanmagan javoblar (score null)
      const { count: pendingCount } = await supabase
        .from("answers")
        .select("id", { count: "exact", head: true })
        .in("task_id", taskIds)
        .is("score", null);
      // 5. Statistika
      const stats = {
        groups: groupIds.length,
        tasks: taskIds.length,
        submissions: submissionsCount || 0,
        pendingReviews: pendingCount || 0,
      };
      // 6. Yaqinlashayotgan 3 ta topshiriq
      const groupMap = Object.fromEntries(
        (groups || []).map((g) => [g.id, g.name])
      );
      const now = new Date();
      const upcomingTasks = (tasks || [])
        .map((t) => ({
          id: t.id,
          title: t.title,
          type: t.type,
          group: groupMap[t.group_id] || "Noma'lum",
          deadline: t.deadline,
          date: t.date,
        }))
        .filter((t) => {
          const dateStr = t.deadline || t.date;
          if (!dateStr) return false;
          const date = new Date(dateStr);
          return date >= now;
        })
        .sort((a, b) => {
          const aDate = new Date(a.deadline || a.date);
          const bDate = new Date(b.deadline || b.date);
          return aDate.getTime() - bDate.getTime();
        })
        .slice(0, 3);
      // 7. Oxirgi 3 ta javob
      const taskMap = Object.fromEntries(
        (tasks || []).map((t) => [
          t.id,
          {
            title: t.title,
            group: groupMap[t.group_id] || "Noma'lum",
          },
        ])
      );
      const lastAnswersRaw = (answers || [])
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .slice(0, 3);
      // Student ismlarini olish
      const userIds = Array.from(new Set(lastAnswersRaw.map((a) => a.user_id)));
      let studentMap: Record<string, string> = {};
      if (userIds.length) {
        const { data: students } = await supabase
          .from("profiles")
          .select("id, full_name")
          .in("id", userIds);
        studentMap = Object.fromEntries(
          (students || []).map((s) => [s.id, s.full_name])
        );
      }
      const lastAnswers = lastAnswersRaw.map((a) => ({
        id: a.id,
        student: studentMap[a.user_id] || "Noma'lum",
        group: taskMap[a.task_id]?.group || "Noma'lum",
        task: taskMap[a.task_id]?.title || "Noma'lum",
        submittedAt: a.created_at?.split("T")[0] || "",
        score: a.score,
        fileUrl: a.file_url,
        description: a.description,
      }));
      return {
        stats,
        upcomingTasks,
        lastAnswers,
      };
    },
    staleTime: 1000 * 60 * 2,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });
}
