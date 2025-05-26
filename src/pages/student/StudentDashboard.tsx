import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { Calendar, FileText } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useStudentDashboardData } from "@/hooks/useStudentDashboardData";

// Tiplar
interface HomeworkTask {
  type: "homework";
  id: string;
  title: string;
  deadline: string;
  status: string;
  group: string;
}
interface InternshipTask {
  type: "internship";
  id: string;
  title: string;
  date: string;
  status: string;
  group: string;
}
type Task = HomeworkTask | InternshipTask;

interface LastAnswer {
  id: string;
  taskTitle: string;
  group: string;
  date: string;
  desc: string;
  file_url?: string;
}

interface SupabaseAnswer {
  id: string;
  desc: string;
  file_url?: string;
  created_at: string;
  task?: {
    id: string;
    title: string;
    group_id: string;
  } | null;
}

interface SupabaseGroup {
  id: string;
  name: string;
}

interface StudentDashboardData {
  stats: { completed: number; pending: number; upcomingInternships: number };
  upcomingTasks: Task[];
  lastAnswers: LastAnswer[];
}

const StudentDashboard = () => {
  const { name, userId } = useAuthStore();
  const navigate = useNavigate();
  const [openTask, setOpenTask] = useState<Task | null>(null);
  const [answerDesc, setAnswerDesc] = useState("");
  const [answerFile, setAnswerFile] = useState<File | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [locationError, setLocationError] = useState("");

  const { data, isLoading, error } = useStudentDashboardData(userId) as {
    data: StudentDashboardData | undefined;
    isLoading: boolean;
    error: unknown;
  };
  const stats = data?.stats || {
    completed: 0,
    pending: 0,
    upcomingInternships: 0,
  };
  const upcomingTasks = data?.upcomingTasks || [];
  const lastAnswers = data?.lastAnswers || [];

  // Mock data until we connect to Supabase
  const homeworkTasks = [
    {
      id: "1",
      title: "Tadqiqot ishini topshirish",
      deadline: "2025-06-15",
      status: "pending",
      group: "Tadqiqot usullari",
    },
    {
      id: "2",
      title: "Testni yakunlash",
      deadline: "2025-06-20",
      status: "submitted",
      group: "Dasturiy ta'minot muhandisligi",
    },
    {
      id: "3",
      title: "5-chi laboratoriya mashg'uloti",
      deadline: "2025-06-25",
      status: "pending",
      group: "Ma'lumotlar bazasi tizimlari",
    },
  ];

  const internshipTasks = [
    {
      id: "4",
      title: "Dasturiy ta'minot sinovi",
      date: "2025-07-01",
      status: "pending",
      group: "Sifat nazorati",
    },
    {
      id: "5",
      title: "Ma'lumotlar bazasi migratsiyasi",
      date: "2025-07-05",
      status: "pending",
      group: "Ma'lumotlar bazasi tizimlari",
    },
  ];

  // Barcha topshiriqlarni bitta massivga birlashtiramiz
  const allTasks: Task[] = [
    ...homeworkTasks.map((t) => ({ ...t, type: "homework" as const })),
    ...internshipTasks.map((t) => ({ ...t, type: "internship" as const })),
  ];

  function isToday(dateStr) {
    const today = new Date();
    const date = new Date(dateStr);
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  }

  const handleOpen = (task) => {
    setOpenTask(task);
    setAnswerDesc("");
    setAnswerFile(null);
    setLocation(null);
    setLocationError("");
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAnswerFile(e.target.files[0]);
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Brauzeringiz geolokatsiyani qo'llab-quvvatlamaydi");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationError("");
      },
      () => {
        setLocationError("Lokatsiyani aniqlab bo'lmadi");
      }
    );
  };

  const handleSubmit = (task) => {
    if (task.type === "internship") {
      if (!location) {
        setLocationError("Lokatsiyani aniqlang");
        return;
      }
      // Lokatsiya tekshiruvi uchun mock
      // TODO: Guruh lokatsiyasini taskdan olish
      // const groupLoc = ...
      // const dist = ...
      // if (dist > 0.02) { setLocationError('Siz kerakli joyda emassiz!'); return; }
    }
    alert(
      "Javob yuborildi!\nTavsif: " +
        answerDesc +
        (answerFile ? "\nFayl: " + answerFile.name : "")
    );
    setOpenTask(null);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">
        Xush kelibsiz, {name}
      </h1>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="rounded-2xl bg-white dark:bg-muted/60 border border-border shadow-md p-6 flex flex-col gap-2">
          <div className="text-sm text-muted-foreground font-medium flex items-center gap-2">
            Yakunlangan topshiriqlar
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2l4 -4m6 2a9 9 0 11-18 0a9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="text-2xl font-bold">{stats.completed}</div>
        </div>
        <div className="rounded-2xl bg-white dark:bg-muted/60 border border-border shadow-md p-6 flex flex-col gap-2">
          <div className="text-sm text-muted-foreground font-medium flex items-center gap-2">
            Kutilayotgan topshiriqlar
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 17v-6a2 2 0 012-2h6"
              />
            </svg>
          </div>
          <div className="text-2xl font-bold">{stats.pending}</div>
        </div>
        <div className="rounded-2xl bg-white dark:bg-muted/60 border border-border shadow-md p-6 flex flex-col gap-2">
          <div className="text-sm text-muted-foreground font-medium flex items-center gap-2">
            Yaqinlashayotgan amaliyotlar
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div className="text-2xl font-bold">{stats.upcomingInternships}</div>
        </div>
      </div>

      {/* Guruhga qo'shilish cardini olib tashladim */}

      {/* Yaqinlashayotgan topshiriqlar bo'limi */}
      <Card>
        <CardHeader>
          <CardTitle>Yaqinlashayotgan topshiriqlar</CardTitle>
          <CardDescription>
            Deadline yoki amaliyot kuni eng yaqin bo'lgan 3 ta topshiriq
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
            upcomingTasks.map((task) => (
              <div
                key={task.id}
                className="border border-border rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{task.title}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${task.type === "homework" ? "bg-purple-100 text-purple-800" : "bg-orange-100 text-orange-800"}`}
                    >
                      {task.type === "homework" ? "Uyga vazifa" : "Amaliyot"}
                    </span>
                    {/* Status badge */}
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        task.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {task.status === "pending"
                        ? "Kutilmoqda"
                        : "Topshirilgan"}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {task.group} •{" "}
                    {task.type === "homework"
                      ? `Muddati ${new Date(task.deadline).toLocaleDateString()}`
                      : `Rejada ${new Date(task.date).toLocaleDateString()}`}
                  </div>
                </div>
                <Button
                  className="min-w-[110px]"
                  onClick={() =>
                    task.status === "pending"
                      ? navigate("/student-dashboard/tasks")
                      : navigate("/student-dashboard/grades")
                  }
                >
                  {task.status === "pending" ? "Topshirish" : "Ko'rish"}
                </Button>
                {task.status === "pending" && (
                  <Dialog
                    open={openTask?.id === task.id}
                    onOpenChange={() => setOpenTask(null)}
                  >
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Javob yuborish</DialogTitle>
                        <DialogDescription>
                          {task.type === "homework"
                            ? "Uyga vazifa uchun javob yuboring."
                            : "Amaliyot topshirig'i uchun faqat amaliyot kuni va kerakli joyda bo'lsangiz javob yuborishingiz mumkin."}
                        </DialogDescription>
                      </DialogHeader>
                      <Input
                        placeholder="Tavsif..."
                        value={answerDesc}
                        onChange={(e) => setAnswerDesc(e.target.value)}
                        className="mb-2"
                      />
                      <Input
                        type="file"
                        onChange={handleFileChange}
                        className="mb-2"
                      />
                      {task.type === "internship" && (
                        <div className="mb-2">
                          <Button type="button" onClick={handleGetLocation}>
                            Lokatsiyani aniqlash
                          </Button>
                          {location && (
                            <div className="text-xs mt-1 text-green-600">
                              Lokatsiya: {location.lat.toFixed(4)},{" "}
                              {location.lng.toFixed(4)}
                            </div>
                          )}
                          {locationError && (
                            <div className="text-xs mt-1 text-red-600">
                              {locationError}
                            </div>
                          )}
                        </div>
                      )}
                      <DialogFooter>
                        <Button onClick={() => handleSubmit(task)}>
                          Yuborish
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* So'nggi faollik bo'limi */}
      <Card>
        <CardHeader>
          <CardTitle>So'nggi faollik</CardTitle>
          <CardDescription>Eng oxirgi 3 ta yuborilgan javob</CardDescription>
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
            <div className="text-muted-foreground">Hali javob yuborilmagan</div>
          ) : (
            <div className="space-y-3">
              {lastAnswers.map((ans) => (
                <div
                  key={ans.id}
                  className="border border-border rounded-lg p-3 flex flex-col gap-1"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{ans.taskTitle}</span>
                    <span className="text-xs text-muted-foreground">
                      {ans.group}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(ans.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {ans.desc && ans.desc !== "EMPTY" ? (
                      ans.desc
                    ) : (
                      <span className="text-muted-foreground">Tavsif yo'q</span>
                    )}
                  </div>
                  {ans.file_url && (
                    <a
                      href={
                        supabase.storage
                          .from("answers")
                          .getPublicUrl(ans.file_url).data.publicUrl
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 underline mt-1"
                    >
                      Faylni ko'rish
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;
