import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Calendar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface GroupDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: {
    id: string;
    title: string;
    description: string;
    location: { lat: number; lng: number; address: string } | null;
    members: number;
    createdAt: string;
    teacher: { name: string; avatar?: string };
  } | null;
  onAddTask: () => void;
}

export function GroupDetailsModal({ isOpen, onClose, group, onAddTask }: GroupDetailsModalProps) {
  if (!group) return null;
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{group.title}</DialogTitle>
          <DialogDescription>{group.description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {group.location && (
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{group.location.address}</span>
            </div>
          )}
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-2" />
            <span>Yaratilgan: {group.createdAt}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="w-4 h-4 mr-2" />
            <span>{group.members} a'zo</span>
          </div>
          <Separator />
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={group.teacher.avatar} />
              <AvatarFallback>
                {group.teacher.name.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <p className="font-medium">{group.teacher.name}</p>
              <p className="text-xs text-muted-foreground">O'qituvchi</p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button className="w-full" onClick={onAddTask}>
            Guruhga topshiriq qo'shish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 