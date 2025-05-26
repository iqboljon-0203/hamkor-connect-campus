import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/use-toast";
import { User, Camera } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const Profile = () => {
  const { name, email, role, profileUrl, userId, setUser } = useAuthStore();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [formName, setFormName] = useState(name || "");
  const [formAvatar, setFormAvatar] = useState<string | null>(
    profileUrl || null
  );
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Fayl hajmini tekshirish (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Xatolik",
        description: "Rasm hajmi 5MB dan oshmasligi kerak",
        variant: "destructive",
      });
      return;
    }

    // Rasm formatini tekshirish
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Xatolik",
        description: "Faqat rasm fayllarini yuklashingiz mumkin",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      // Eski rasmni o'chirish
      if (formAvatar) {
        const oldPath = formAvatar.split("/").pop();
        if (oldPath) {
          await supabase.storage
            .from("avatars")
            .remove([`${userId}/${oldPath}`]);
        }
      }

      // Yangi rasmni yuklash
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) throw error;

      if (data?.path) {
        const {
          data: { publicUrl },
        } = supabase.storage.from("avatars").getPublicUrl(data.path);

        setFormAvatar(publicUrl);
        setAvatarFile(file);
      }
    } catch (error: any) {
      toast({
        title: "Xatolik",
        description: error.message || "Rasm yuklanmadi",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    // Supabase'ga update
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: formName, avatar: formAvatar })
      .eq("id", userId);
    if (error) {
      toast({
        title: "Xatolik",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    setUser({
      id: userId!,
      email: email!,
      name: formName,
      role: role!,
      profileUrl: formAvatar,
    });
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center mb-4">
            <div className="relative w-24 h-24">
              {formAvatar || profileUrl ? (
                <img
                  src={formAvatar || profileUrl || ""}
                  alt={name || "User"}
                  className="w-24 h-24 rounded-full object-cover border-2 border-border"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                  <User className="w-12 h-12 text-muted-foreground" />
                </div>
              )}
              {isEditing && (
                <>
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-1 right-1 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow cursor-pointer hover:bg-gray-100 transition border border-gray-200"
                  >
                    <Camera className="w-5 h-5 text-gray-600" />
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                  {uploading && (
                    <span className="absolute left-1/2 -bottom-6 -translate-x-1/2 text-xs text-blue-500 mt-1">
                      Yuklanmoqda...
                    </span>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                />
              ) : (
                <div className="p-2 border border-border rounded-md bg-muted/50">
                  {name}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="p-2 border border-border rounded-md bg-muted/50">
                {email}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <div className="p-2 border border-border rounded-md bg-muted/50">
                {role === "teacher" ? "Teacher" : "Student"}
              </div>
            </div>

            {isEditing ? (
              <div className="flex gap-2 pt-4">
                <Button onClick={handleSaveProfile}>Save Changes</Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setFormName(name || "");
                  }}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button className="mt-4" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
