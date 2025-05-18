
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";

const TeacherGroups = () => {
  // Mock data for groups
  const groups = [
    { id: 1, name: "Web Development", members: 12, code: "WEB-101" },
    { id: 2, name: "Database Systems", members: 8, code: "DB-202" },
    { id: 3, name: "Software Engineering", members: 15, code: "SE-303" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Guruhlar</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Yangi guruh
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <Card key={group.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>{group.name}</CardTitle>
                <CardDescription className="mt-1">Kod: {group.code}</CardDescription>
              </div>
              <Users className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  {group.members} a'zo
                </div>
                <Button variant="outline" size="sm">
                  Batafsil
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TeacherGroups;
