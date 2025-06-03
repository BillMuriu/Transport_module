import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function DashboardStatCard({ title, count, description, icon }) {
  return (
    <Card className="w-full shadow-sm hover:shadow-md transition">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          <CardDescription className="text-muted-foreground">
            {description}
          </CardDescription>
        </div>
        {icon && (
          <div className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary group-hover:bg-primary/20">
            <span className="size-5">{icon}</span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{count}</p>
      </CardContent>
    </Card>
  );
}
