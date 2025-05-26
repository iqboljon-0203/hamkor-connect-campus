import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { Plus, Users, FileText, Clock } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useGroupModal } from "@/providers/GroupModalProvider";
import { useState, useEffect } from "react";
import { TaskDetailsModal } from "@/components/modals/TaskDetailsModal";
import { GradeAnswerModal } from "@/components/modals/GradeAnswerModal";
import { supabase } from "@/lib/supabaseClient";
import { useTeacherDashboardData } from "@/hooks/useTeacherDashboardData";

interface Task {
  id: string;
  title: string;
  type: "homework" | "internship";
  group: string;
  deadline?: string;
  date?: string;
  description?: string;
  fileUrl?: string;
}

interface Answer {
  id: string;
  student: string;
  group: string;
  task: string;
  submittedAt: string;
  fileUrl: string;
  score: number | null;
  description?: string;
}

interface TeacherDashboardData {
  stats: {
    groups: number;
    tasks: number;
    submissions: number;
    pendingReviews: number;
  };
  upcomingTasks: Task[];
  lastAnswers: Answer[];
}

const TeacherDashboard = () => {
  const { userId, name } = useAuthStore();
  const navigate = useNavigate();
  const { open } = useGroupModal();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<Answer | null>(null);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);

  const { data, isLoading, error } = useTeacherDashboardData(userId) as {
    data: TeacherDashboardData | undefined;
    isLoading: boolean;
    error: unknown;
  };
  const stats = data?.stats || {
    groups: 0,
    tasks: 0,
    submissions: 0,
    pendingReviews: 0,
  };
  const upcomingTasks = data?.upcomingTasks || [];
  const lastAnswers = data?.lastAnswers || [];

  // Mock javoblar
  const answers: Answer[] = [
    {
      id: "1",
      student: "Ali Valiyev",
      group: "Web Development",
      task: "Web Development Project",
      submittedAt: "2023-06-14",
      fileUrl: "https://example.com/answer1.pdf",
      score: 8,
    },
    {
      id: "2",
      student: "Dilnoza Karimova",
      group: "Database Systems",
      task: "Database Internship",
      submittedAt: "2023-06-20",
      fileUrl: "https://example.com/answer2.pdf",
      score: null,
    },
  ];

  const handleOpenTask = (task: Task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };
  const handleCloseTask = () => {
    setIsTaskModalOpen(false);
    setSelectedTask(null);
  };
  const handleSaveTask = async (updatedTask: Task) => {
    // Supabase'da taskni yangilash
    const updateFields: {
      title: string;
      description?: string;
      type: "homework" | "internship";
      deadline: string | null;
      date: string | null;
    } = {
      title: updatedTask.title,
      description: updatedTask.description,
      type: updatedTask.type,
      deadline: updatedTask.type === "homework" ? updatedTask.deadline : null,
      date: updatedTask.type === "internship" ? updatedTask.date : null,
    };
    await supabase.from("tasks").update(updateFields).eq("id", updatedTask.id);
    setIsTaskModalOpen(false);
    setSelectedTask(null);
    // Statistikalar va yaqin topshiriqlarni yangilash
    if (userId) {
      fetchStats(userId);
      fetchUpcomingTasks(userId);
    }
  };

  const handleOpenGrade = (answer: Answer) => {
    setSelectedAnswer(answer);
    setIsGradeModalOpen(true);
  };
  const handleCloseGrade = () => {
    setIsGradeModalOpen(false);
    setSelectedAnswer(null);
  };
  const handleSaveGrade = async (score: number, teacherComment: string) => {
    if (!selectedAnswer) return;
    await supabase
      .from("answers")
      .update({ score, teacher_comment: teacherComment })
      .eq("id", selectedAnswer.id);
    setLastAnswers((prev) =>
      prev.map((a) =>
        a.id === selectedAnswer.id
          ? { ...a, score, teacher_comment: teacherComment }
          : a
      )
    );
    setIsGradeModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Xush kelibsiz, {name}
        </h1>
        <div className="flex flex-wrap gap-2">
          {/* <Button onClick={() => navigate("tasks/create")}> */}
          {/*   <Plus className="h-4 w-4 mr-2" /> */}
          {/*   Yangi topshiriq */}
          {/* </Button> */}
          <Button variant="outline" onClick={open}>
            <Plus className="h-4 w-4 mr-2" />
            Yangi guruh
          </Button>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jami guruhlar</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.groups}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Jami topshiriqlar
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.tasks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Topshirilgan ishlar
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.submissions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tekshirilishi kerak
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingReviews}</div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>Yaqinlashayotgan topshiriqlar</CardTitle>
            <CardDescription>
              Tez orada muddati tugaydigan topshiriqlar
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Yuklanmoqda...
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">
                Xatolik:{" "}
                {typeof error === "object" && error && "message" in error
                  ? (error as { message?: string }).message
                  : String(error)}
              </div>
            ) : upcomingTasks.length === 0 ? (
              <div className="text-muted-foreground">
                Yaqinlashayotgan topshiriq yo'q
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="border border-border rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 cursor-pointer hover:bg-muted/50 transition"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium">{task.title}</span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            task.type === "homework"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                              : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          }`}
                        >
                          {task.type === "homework"
                            ? "Uyga vazifa"
                            : "Amaliyot"}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {task.group} • Muddati{" "}
                        {new Date(
                          task.deadline || task.date || ""
                        ).toLocaleDateString()}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate("/teacher-dashboard/tasks")}
                    >
                      Ko'rish
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <TaskDetailsModal
        isOpen={isTaskModalOpen}
        onClose={handleCloseTask}
        task={selectedTask}
        onSave={handleSaveTask}
      />
      {/* Oxirgi javoblar bo'limi */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Oxirgi javoblar</CardTitle>
            <CardDescription>
              Studentlar tomonidan yuborilgan eng so'nggi 3 ta javob
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Yuklanmoqda...
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">
                Xatolik:{" "}
                {typeof error === "object" && error && "message" in error
                  ? (error as { message?: string }).message
                  : String(error)}
              </div>
            ) : lastAnswers.length === 0 ? (
              <div className="text-muted-foreground">
                Hali javob yuborilmagan
              </div>
            ) : (
              <div className="space-y-4">
                {lastAnswers.map((answer) => (
                  <div
                    key={answer.id}
                    className="border border-border rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 cursor-pointer hover:bg-muted/50 transition"
                    onClick={() => handleOpenGrade(answer)}
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium">{answer.student}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                          {answer.group}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {answer.task} • Yuborilgan: {answer.submittedAt}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {answer.description &&
                        answer.description !== "EMPTY" ? (
                          answer.description
                        ) : (
                          <span className="text-muted-foreground">
                            Tavsif yo'q
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {answer.score !== null ? (
                        <span className="px-2 py-0.5 rounded bg-green-100 text-green-800 text-xs">
                          {answer.score} / 10
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-yellow-100 text-yellow-800 text-xs">
                          Baholanmagan
                        </span>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenGrade(answer);
                        }}
                      >
                        Baholash
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        <GradeAnswerModal
          isOpen={isGradeModalOpen}
          onClose={handleCloseGrade}
          answer={selectedAnswer}
          onSave={handleSaveGrade}
        />
      </div>
    </div>
  );
};

export default TeacherDashboard;
