
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { Calendar, FileText } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

const StudentDashboard = () => {
  const { name } = useAuthStore();
  const navigate = useNavigate();

  // Mock data until we connect to Supabase
  const stats = {
    completedTasks: 15,
    pendingTasks: 5,
    upcomingInternships: 2
  };

  // Mock tasks
  const homeworkTasks = [
    { id: "1", title: "Submit Research Paper", deadline: "2023-06-15", status: "pending", group: "Research Methods" },
    { id: "2", title: "Complete Quiz", deadline: "2023-06-10", status: "submitted", group: "Software Engineering" },
    { id: "3", title: "Lab Exercise 5", deadline: "2023-06-18", status: "pending", group: "Database Systems" },
  ];

  const internshipTasks = [
    { id: "4", title: "Software Testing", date: "2023-06-20", status: "pending", group: "Quality Assurance" },
    { id: "5", title: "Database Migration", date: "2023-07-05", status: "pending", group: "Database Systems" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Welcome back, {name}</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedTasks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingTasks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Internships</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingInternships}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
          <CardDescription>View and manage your assigned tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="homework" className="space-y-4">
            <TabsList>
              <TabsTrigger value="homework">Homework</TabsTrigger>
              <TabsTrigger value="internship">Internship</TabsTrigger>
            </TabsList>
            <TabsContent value="homework" className="space-y-4">
              {homeworkTasks.map(task => (
                <div key={task.id} className="border border-border rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <div className="flex items-center">
                      <span className="font-medium">{task.title}</span>
                      <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                        task.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' 
                          : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      }`}>
                        {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {task.group} • Due {new Date(task.deadline).toLocaleDateString()}
                    </div>
                  </div>
                  <Button onClick={() => navigate(`tasks/${task.id}`)}>
                    {task.status === "pending" ? "Submit" : "View"}
                  </Button>
                </div>
              ))}
            </TabsContent>
            <TabsContent value="internship" className="space-y-4">
              {internshipTasks.map(task => (
                <div key={task.id} className="border border-border rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <div className="flex items-center">
                      <span className="font-medium">{task.title}</span>
                      <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                        new Date(task.date) > new Date() 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' 
                          : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      }`}>
                        {new Date(task.date) > new Date() ? 'Upcoming' : 'Today'}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {task.group} • Scheduled {new Date(task.date).toLocaleDateString()}
                    </div>
                  </div>
                  <Button 
                    disabled={new Date(task.date).toDateString() !== new Date().toDateString()} 
                    onClick={() => navigate(`tasks/${task.id}`)}
                  >
                    {new Date(task.date).toDateString() === new Date().toDateString() ? "Submit" : "View"}
                  </Button>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Join a Group</CardTitle>
          <CardDescription>
            Enter a group code provided by your teacher
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("join-group")}>
              Join Group
            </Button>
            <Button variant="ghost" onClick={() => navigate("my-groups")}>
              View My Groups
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;
