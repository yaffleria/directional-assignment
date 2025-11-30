import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Button } from "../components/ui/Button";
import { ArrowLeft } from "lucide-react";

const COLORS = {
  primary: ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"],
  mood: { happy: "#10b981", tired: "#f59e0b", stressed: "#ef4444" },
  workout: { running: "#3b82f6", cycling: "#8b5cf6", stretching: "#ec4899" },
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<1 | 2 | 3 | 4>(1);

  const { data: coffeeBrands } = useQuery({
    queryKey: ["coffeeBrands"],
    queryFn: async () => (await api.mock.topCoffeeBrandsList()).data,
  });
  const { data: snackBrands } = useQuery({
    queryKey: ["snackBrands"],
    queryFn: async () => (await api.mock.popularSnackBrandsList()).data,
  });
  const { data: moodTrend } = useQuery({
    queryKey: ["moodTrend"],
    queryFn: async () => (await api.mock.weeklyMoodTrendList()).data,
  });
  const { data: workoutTrend } = useQuery({
    queryKey: ["workoutTrend"],
    queryFn: async () => (await api.mock.weeklyWorkoutTrendList()).data,
  });
  const { data: coffeeConsumption } = useQuery({
    queryKey: ["coffeeConsumption"],
    queryFn: async () => (await api.mock.coffeeConsumptionList()).data,
  });
  const { data: snackImpact } = useQuery({
    queryKey: ["snackImpact"],
    queryFn: async () => (await api.mock.snackImpactList()).data,
  });

  const combinedData = moodTrend?.map((mood, index) => ({
    ...mood,
    running: workoutTrend?.[index]?.running || 0,
    cycling: workoutTrend?.[index]?.cycling || 0,
    stretching: workoutTrend?.[index]?.stretching || 0,
  }));

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/posts")}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={18} /> Back to Posts
          </Button>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="w-20"></div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex gap-2 flex-wrap">
          {[1, 2, 3, 4].map((v) => (
            <Button
              key={v}
              variant={activeView === v ? "default" : "outline"}
              onClick={() => setActiveView(v as 1 | 2 | 3 | 4)}
            >
              View {v}
            </Button>
          ))}
        </div>

        {activeView === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card rounded-lg border p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Weekly Mood Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={moodTrend}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="happy"
                    stackId="1"
                    stroke={COLORS.mood.happy}
                    fill={COLORS.mood.happy}
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="tired"
                    stackId="1"
                    stroke={COLORS.mood.tired}
                    fill={COLORS.mood.tired}
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="stressed"
                    stackId="1"
                    stroke={COLORS.mood.stressed}
                    fill={COLORS.mood.stressed}
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-card rounded-lg border p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">
                Popular Snack Brands
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={snackBrands as any}
                    dataKey="share"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {snackBrands?.map((_, i) => (
                      <Cell
                        key={`cell-${i}`}
                        fill={COLORS.primary[i % COLORS.primary.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeView === 2 && (
          <div className="space-y-6">
            <div className="bg-card rounded-lg border p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">
                Weekly Mood Trend (Stacked)
              </h3>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={combinedData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="week" />
                  <YAxis
                    label={{
                      value: "Percentage (%)",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="happy"
                    stackId="mood"
                    stroke={COLORS.mood.happy}
                    fill={COLORS.mood.happy}
                    fillOpacity={0.7}
                  />
                  <Area
                    type="monotone"
                    dataKey="tired"
                    stackId="mood"
                    stroke={COLORS.mood.tired}
                    fill={COLORS.mood.tired}
                    fillOpacity={0.7}
                  />
                  <Area
                    type="monotone"
                    dataKey="stressed"
                    stackId="mood"
                    stroke={COLORS.mood.stressed}
                    fill={COLORS.mood.stressed}
                    fillOpacity={0.7}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-card rounded-lg border p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">
                Weekly Workout Trend (Stacked)
              </h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={combinedData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="running"
                    stackId="workout"
                    fill={COLORS.workout.running}
                  />
                  <Bar
                    dataKey="cycling"
                    stackId="workout"
                    fill={COLORS.workout.cycling}
                  />
                  <Bar
                    dataKey="stretching"
                    stackId="workout"
                    fill={COLORS.workout.stretching}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeView === 3 && (
          <div className="space-y-6">
            <div className="bg-card rounded-lg border p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">
                Coffee Consumption vs Productivity & Bugs
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis
                    dataKey="cups"
                    type="number"
                    label={{
                      value: "Coffee Cups",
                      position: "insideBottom",
                      offset: -5,
                    }}
                  />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  {coffeeConsumption?.teams?.map((team, i) => (
                    <Line
                      key={team.team}
                      yAxisId="left"
                      type="monotone"
                      data={team.series}
                      dataKey="productivity"
                      name={`${team.team}  Productivity`}
                      stroke={COLORS.primary[i]}
                      strokeWidth={2}
                    />
                  ))}
                  {coffeeConsumption?.teams?.map((team, i) => (
                    <Line
                      key={`${team.team}-bugs`}
                      yAxisId="right"
                      type="monotone"
                      data={team.series}
                      dataKey="bugs"
                      name={`${team.team} Bugs`}
                      stroke={COLORS.primary[i]}
                      strokeWidth={2}
                      strokeDasharray="5 5"
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-card rounded-lg border p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">
                Snack Impact on Morale & Meetings
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis
                    dataKey="snacks"
                    type="number"
                    label={{
                      value: "Snacks per Day",
                      position: "insideBottom",
                      offset: -5,
                    }}
                  />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  {snackImpact?.departments?.map((dept, i) => (
                    <Line
                      key={dept.name}
                      yAxisId="left"
                      type="monotone"
                      data={dept.metrics}
                      dataKey="morale"
                      name={`${dept.name} Morale`}
                      stroke={COLORS.primary[i]}
                      strokeWidth={2}
                    />
                  ))}
                  {snackImpact?.departments?.map((dept, i) => (
                    <Line
                      key={`${dept.name}-missed`}
                      yAxisId="right"
                      type="monotone"
                      data={dept.metrics}
                      dataKey="meetingsMissed"
                      name={`${dept.name} Meetings`}
                      stroke={COLORS.primary[i]}
                      strokeWidth={2}
                      strokeDasharray="5 5"
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeView === 4 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card rounded-lg border p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">
                  Top Coffee Brands
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={coffeeBrands as any}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="brand" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="popularity" fill={COLORS.primary[0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-card rounded-lg border p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Snack Brands</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={snackBrands as any}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="share" fill={COLORS.primary[1]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-card rounded-lg border p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">
                Weekly Trends Overview
              </h3>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={moodTrend}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="happy"
                    stroke={COLORS.mood.happy}
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="tired"
                    stroke={COLORS.mood.tired}
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="stressed"
                    stroke={COLORS.mood.stressed}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
