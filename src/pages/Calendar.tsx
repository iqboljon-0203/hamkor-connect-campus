
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Calendar = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Kalendar</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Kalendar sahifasi</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Kalendar sahifasi. Vaqt va sana bo'yicha joylashtirilgan ma'lumotlar, topshiriqlar va muhim voqealarni ko'rsatish uchun.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Calendar;
