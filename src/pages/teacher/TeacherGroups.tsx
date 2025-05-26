import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Users,
  MapPin,
  Calendar,
  ChevronRight,
  Copy,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CreateGroupModal } from "@/components/modals/CreateGroupModal";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { GroupDetailsModal } from "@/components/modals/GroupDetailsModal";
import { AddTaskModal } from "@/components/modals/AddTaskModal";
import { nanoid } from "nanoid";
import { supabase } from "@/lib/supabaseClient";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";

interface Group {
  id: string;
  title: string;
  description: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  } | null;
  members: number;
  createdAt: string;
  teacher: {
    name: string;
    avatar?: string;
  };
}

const TeacherGroups = () => {
  const { toast } = useToast();
  const { userId, name } = useAuthStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const navigate = useNavigate();

  // Guruhlarni Supabase'dan olish
  useEffect(() => {
    const fetchGroups = async () => {
      if (!userId) return;
      const { data, error } = await supabase
        .from("groups")
        .select("id, name, lat, lng, address, created_at")
        .eq("created_by", userId)
        .order("created_at", { ascending: false });
      if (error) {
        toast({
          title: "Xatolik",
          description: error.message,
          variant: "destructive",
        });
      } else if (data) {
        // Har bir guruh uchun a'zolar sonini olish
        const groupsWithMembers = await Promise.all(
          data.map(async (g: any) => {
            const { count } = await supabase
              .from("group_members")
              .select("id", { count: "exact", head: true })
              .eq("group_id", g.id);
            return {
              id: g.id,
              title: g.name,
              description: "", // Agar description bo'lsa, qo'shing
              location: {
                lat: g.lat,
                lng: g.lng,
                address: g.address,
              },
              members: count || 0,
              createdAt: g.created_at?.split("T")[0] || "",
              teacher: {
                name: name || "O'qituvchi",
                avatar: "https://github.com/shadcn.png",
              },
            };
          })
        );
        setGroups(groupsWithMembers);
      }
    };
    fetchGroups();
  }, [userId, name, toast]);

  // Yangi guruh yaratish
  const handleCreateGroup = async (data: {
    title: string;
    description: string;
    location: {
      lat: number;
      lng: number;
      address: string;
    };
  }) => {
    try {
      if (!userId) throw new Error("Foydalanuvchi aniqlanmadi");
      const { data: group, error } = await supabase
        .from("groups")
        .insert([
          {
            name: data.title,
            lat: data.location.lat,
            lng: data.location.lng,
            address: data.location.address,
            created_by: userId,
          },
        ])
        .select()
        .single();
      if (error) throw error;
      setGroups((prev) => [
        {
          id: group.id,
          title: group.name,
          description: data.description,
          location: {
            lat: group.lat,
            lng: group.lng,
            address: group.address,
          },
          members: 0, // Yangi guruh yaratishda a'zolar soni 0 bo'ladi
          createdAt: group.created_at?.split("T")[0] || "",
          teacher: {
            name: name || "O'qituvchi",
            avatar: "https://github.com/shadcn.png",
          },
        },
        ...prev,
      ]);
      toast({ title: "Muvaffaqiyatli", description: "Yangi guruh yaratildi" });
    } catch (error: any) {
      toast({
        title: "Xatolik",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleOpenDetails = (group: Group) => {
    navigate(`/teacher-dashboard/groups/${group.id}`);
  };
  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedGroup(null);
  };
  const handleAddTask = () => {
    setIsAddTaskOpen(true);
  };
  const handleCloseAddTask = () => {
    setIsAddTaskOpen(false);
  };
  const handleSubmitTask = (data: any) => {
    // TODO: Yangi topshiriqni API yoki statega qo'shish
    alert("Yangi topshiriq qo'shildi: " + JSON.stringify(data, null, 2));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Guruhlar</h1>
          <p className="text-muted-foreground">
            Barcha guruhlaringiz va ularning ma'lumotlari
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Yangi guruh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <Card key={group.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-xl">{group.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {group.description}
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="ml-2">
                  {group.members} a'zo
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {group.location && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="line-clamp-1">{group.location.address}</span>
                </div>
              )}
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Yaratilgan: {group.createdAt}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={group.teacher.avatar} />
                    <AvatarFallback>
                      {group.teacher.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <p className="font-medium">{group.teacher.name}</p>
                    <p className="text-xs text-muted-foreground">O'qituvchi</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  ID: {group.id}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    navigator.clipboard.writeText(group.id);
                    toast({ title: "ID nusxalandi!", description: group.id });
                  }}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleOpenDetails(group)}
              >
                Batafsil
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <CreateGroupModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateGroup}
      />

      <GroupDetailsModal
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
        group={selectedGroup}
        onAddTask={handleAddTask}
      />
      <AddTaskModal
        isOpen={isAddTaskOpen}
        onClose={handleCloseAddTask}
        onSubmit={handleSubmitTask}
        group={selectedGroup}
      />
    </div>
  );
};

export default TeacherGroups;
