
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/use-toast";
import { User } from "lucide-react";

const Profile = () => {
  const { name, email, role, profileUrl, userId, setUser } = useAuthStore();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formName, setFormName] = useState(name || "");
  
  const handleSaveProfile = () => {
    // TODO: Implement with Supabase
    // For now, just update the local state
    setUser({
      id: userId!,
      email: email!,
      name: formName,
      role: role!,
      profileUrl,
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
            {profileUrl ? (
              <img 
                src={profileUrl} 
                alt={name || "User"} 
                className="w-24 h-24 rounded-full object-cover border-2 border-border"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                <User className="w-12 h-12 text-muted-foreground" />
              </div>
            )}
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
                <Button variant="outline" onClick={() => {
                  setIsEditing(false);
                  setFormName(name || "");
                }}>
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
