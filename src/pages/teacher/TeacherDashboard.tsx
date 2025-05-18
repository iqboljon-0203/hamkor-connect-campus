
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {name}</h1>
        <div className="flex space-x-2">
          <Button onClick={() => navigate("tasks/create")}>
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
          <Button variant="outline" onClick={() => navigate("groups/create")}>
            <Plus className="h-4 w-4 mr-2" />
            New Group
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Groups</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.groups}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.tasks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Submissions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.submissions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
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
            <CardTitle>Upcoming Tasks</CardTitle>
            <CardDescription>
              Tasks that are coming up soon
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTasks.map(task => (
                <div key={task.id} className="border border-border rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <div className="flex items-center">
                      <span className="font-medium">{task.title}</span>
                      <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                        task.type === 'homework' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' 
                          : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      }`}>
                        {task.type.charAt(0).toUpperCase() + task.type.slice(1)}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {task.group} • Due {new Date(task.deadline).toLocaleDateString()}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => navigate(`tasks/${task.id}`)}>
                    View
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
