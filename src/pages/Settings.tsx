
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Settings = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Sozlamalar</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Ilova sozlamalari</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Ushbu sahifa foydalanuvchi sozlamalari bilan ishlash uchun.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
