import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface Task {
  id: string;
  title: string;
  type: "homework" | "internship";
  group: string;
  deadline?: string;
  practiceDay?: string;
  desc?: string;
  fileUrl?: string;
}

interface TaskDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onSave: (task: Task) => void;
}

export function TaskDetailsModal({
  isOpen,
  onClose,
  task,
  onSave,
}: TaskDetailsModalProps) {
  const [isEdit, setIsEdit] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(task);

  useEffect(() => {
    setEditTask(task);
    setIsEdit(false);
  }, [task, isOpen]);

  if (!task) return null;

  const handleChange = (field: keyof Task, value: any) => {
    if (!editTask) return;
    setEditTask({ ...editTask, [field]: value });
  };

  const handleSave = () => {
    if (editTask) {
      onSave(editTask);
      setIsEdit(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Topshiriqni tahrirlash" : "Topshiriq ma'lumotlari"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Topshiriq ma'lumotlarini tahrirlash va saqlash mumkin."
              : "Topshiriq haqida to'liq ma'lumot."}
          </DialogDescription>
        </DialogHeader>
        {isEdit ? (
          <div className="space-y-2">
            <Label>Vazifa nomi</Label>
            <Input
              value={editTask?.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
            />
            <Label>Vazifa tavsifi</Label>
            <Textarea
              value={editTask?.desc || ""}
              onChange={(e) => handleChange("desc", e.target.value)}
            />
            {editTask?.type === "homework" && (
              <>
                <Label>Deadline</Label>
                <Input
                  type="date"
                  value={editTask.deadline || ""}
                  onChange={(e) => handleChange("deadline", e.target.value)}
                />
              </>
            )}
            {editTask?.type === "internship" && (
              <>
                <Label>Amaliyot kuni</Label>
                <Input
                  type="date"
                  value={editTask.practiceDay || ""}
                  onChange={(e) => handleChange("practiceDay", e.target.value)}
                />
              </>
            )}
            {/* Fayl yuklashni ham qo'shish mumkin */}
          </div>
        ) : (
          <div className="space-y-2">
            <div>
              <b>Nomi:</b> {task.title}
            </div>
            <div>
              <b>Tavsifi:</b> {task.desc}
            </div>
            <div>
              <b>Turi:</b>{" "}
              {task.type === "homework" ? "Uyga vazifa" : "Amaliyot"}
            </div>
            <div>
              <b>Guruh:</b> {task.group}
            </div>
            {task.type === "homework" && (
              <div>
                <b>Deadline:</b> {task.deadline}
              </div>
            )}
            {task.type === "internship" && (
              <div>
                <b>Amaliyot kuni:</b> {task.practiceDay}
              </div>
            )}
            {task.fileUrl && (
              <div>
                <b>Fayl:</b>{" "}
                <a
                  href={task.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Yuklab olish
                </a>
              </div>
            )}
          </div>
        )}
        <DialogFooter>
          {isEdit ? (
            <>
              <Button onClick={handleSave}>Saqlash</Button>
              <Button variant="outline" onClick={() => setIsEdit(false)}>
                Bekor qilish
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEdit(true)}>Tahrirlash</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
