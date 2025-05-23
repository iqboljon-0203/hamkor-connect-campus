
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const StudentTasks = () => {
  // Mock tasks
  const homeworkTasks = [
    { id: "1", title: "Tadqiqot ishini topshirish", deadline: "2023-06-15", status: "pending", group: "Tadqiqot usullari" },
    { id: "2", title: "Testni yakunlash", deadline: "2023-06-10", status: "submitted", group: "Dasturiy ta'minot muhandisligi" },
    { id: "3", title: "5-chi laboratoriya mashg'uloti", deadline: "2023-06-18", status: "pending", group: "Ma'lumotlar bazasi tizimlari" },
  ];

  const internshipTasks = [
    { id: "4", title: "Dasturiy ta'minot sinovi", date: "2023-06-20", status: "pending", group: "Sifat nazorati" },
    { id: "5", title: "Ma'lumotlar bazasi migratsiyasi", date: "2023-07-05", status: "pending", group: "Ma'lumotlar bazasi tizimlari" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Mening topshiriqlarim</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Topshiriqlar</CardTitle>
          <CardDescription>Barcha topshiriqlarni ko'rish va boshqarish</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="homework" className="space-y-4">
            <TabsList>
              <TabsTrigger value="homework">Uyga vazifalar</TabsTrigger>
              <TabsTrigger value="internship">Amaliyot</TabsTrigger>
            </TabsList>
            <TabsContent value="homework" className="space-y-4">
              {homeworkTasks.map(task => (
                <div key={task.id} className="border border-border rounded-lg p-4 flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{task.title}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        task.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' 
                          : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      }`}>
                        {task.status === 'pending' ? 'Kutilmoqda' : 'Topshirilgan'}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {task.group} • Muddati {new Date(task.deadline).toLocaleDateString()}
                    </div>
                  </div>
                  <Button>
                    {task.status === "pending" ? "Topshirish" : "Ko'rish"}
                  </Button>
                </div>
              ))}
            </TabsContent>
            <TabsContent value="internship" className="space-y-4">
              {internshipTasks.map(task => (
                <div key={task.id} className="border border-border rounded-lg p-4 flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{task.title}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        new Date(task.date) > new Date() 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' 
                          : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      }`}>
                        {new Date(task.date) > new Date() ? 'Kelgusi' : 'Bugun'}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {task.group} • Rejada {new Date(task.date).toLocaleDateString()}
                    </div>
                  </div>
                  <Button 
                    disabled={new Date(task.date).toDateString() !== new Date().toDateString()}
                  >
                    {new Date(task.date).toDateString() === new Date().toDateString() ? "Topshirish" : "Ko'rish"}
                  </Button>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentTasks;
