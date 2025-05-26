import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AddTaskModal } from "@/components/modals/AddTaskModal";

export default function GroupDetails() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Guruh ma'lumotini olish
      const { data: groupData } = await supabase
        .from("groups")
        .select("*")
        .eq("id", groupId)
        .single();
      setGroup(groupData);

      // Tasklarni olish
      const { data: tasksData } = await supabase
        .from("tasks")
        .select("*")
        .eq("group_id", groupId)
        .order("created_at", { ascending: false });
      setTasks(tasksData || []);
      setLoading(false);
    };
    if (groupId) fetchData();
  }, [groupId]);

  if (loading) return <div className="p-8">Yuklanmoqda...</div>;
  if (!group) return <div className="p-8">Guruh topilmadi</div>;

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8">
      <Button variant="outline" onClick={() => navigate(-1)}>
        ← Orqaga
      </Button>
      <div className="flex justify-between items-center">
        <div />
        <Button
          onClick={() => setIsAddTaskOpen(true)}
          className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold transition"
        >
          Guruhga topshiriq qo'shish
        </Button>
      </div>
      <Card className="rounded-2xl shadow-md border border-border bg-white dark:bg-muted/60">
        <CardHeader>
          <CardTitle className="text-2xl mb-2">{group.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <span className="font-bold">Manzil:</span> {group.address}
          </div>
          <div>
            <span className="font-bold">Kenglik/Uzunlik:</span> {group.lat},{" "}
            {group.lng}
          </div>
          <div>
            <span className="font-bold">Yaratilgan:</span>{" "}
            {group.created_at?.split("T")[0]}
          </div>
        </CardContent>
      </Card>
      <div>
        <h2 className="text-xl font-bold mb-4">Guruh topshiriqlari</h2>
        {tasks.length === 0 ? (
          <div>Hali topshiriq yo'q</div>
        ) : (
          <div className="space-y-5">
            {tasks.map((task) => (
              <Card
                key={task.id}
                className="rounded-2xl shadow-sm border border-border bg-white dark:bg-muted/60 hover:shadow-lg transition"
              >
                <CardHeader className="flex flex-row items-center gap-2 pb-1">
                  <CardTitle className="text-lg">{task.title}</CardTitle>
                  <span
                    className={`text-xs px-2 py-1 rounded font-semibold ${
                      task.type === "homework"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {task.type === "homework" ? "Uyga vazifa" : "Amaliyot"}
                  </span>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground mb-1">
                    {task.type === "homework"
                      ? `Deadline: ${task.deadline ? new Date(task.deadline).toLocaleDateString() : "-"}`
                      : `Amaliyot kuni: ${task.date ? new Date(task.date).toLocaleDateString() : "-"}`}
                  </div>
                  <div className="text-xs text-muted-foreground mb-1">
                    {task.description}
                  </div>
                  {task.file_url && (
                    <a
                      href={
                        supabase.storage
                          .from("tasks")
                          .getPublicUrl(task.file_url).data.publicUrl
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline text-xs"
                    >
                      Faylni ko'rish
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <AddTaskModal
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        onSubmit={async () => {
          // Task qo'shilgandan so'ng ro'yxatni yangilash
          const { data: tasksData } = await supabase
            .from("tasks")
            .select("*")
            .eq("group_id", groupId)
            .order("created_at", { ascending: false });
          setTasks(tasksData || []);
        }}
        group={{ id: group.id, title: group.name }}
      />
    </div>
  );
}
