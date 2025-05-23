
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Plus, Users, FileText, Clock } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

const TeacherDashboard = () => {
  const { name } = useAuthStore();
  const navigate = useNavigate();

  // Mock data until we connect to Supabase
  const stats = {
    groups: 3,
    tasks: 12,
    submissions: 8,
    pendingReviews: 5
  };

  // Mock upcoming tasks
  const upcomingTasks = [
    { id: "1", title: "Web Development Project", deadline: "2023-06-15", type: "homework", group: "Web Development" },
    { id: "2", title: "Database Internship", deadline: "2023-06-20", type: "internship", group: "Database Systems" },
    { id: "3", title: "Final Exam Preparation", deadline: "2023-06-25", type: "homework", group: "Software Engineering" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Hush kelibsiz, {name}</h1>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => navigate("tasks/create")}>
            <Plus className="h-4 w-4 mr-2" />
            Yangi topshiriq
          </Button>
          <Button variant="outline" onClick={() => navigate("groups/create")}>
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
            <CardTitle className="text-sm font-medium">Jami topshiriqlar</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.tasks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Topshirilgan ishlar</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.submissions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tekshirilishi kerak</CardTitle>
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
            <div className="space-y-4">
              {upcomingTasks.map(task => (
                <div key={task.id} className="border border-border rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{task.title}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        task.type === 'homework' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' 
                          : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      }`}>
                        {task.type === 'homework' ? 'Uyga vazifa' : 'Amaliyot'}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {task.group} • Muddati {new Date(task.deadline).toLocaleDateString()}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => navigate(`tasks/${task.id}`)}>
                    Ko'rish
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeacherDashboard;
