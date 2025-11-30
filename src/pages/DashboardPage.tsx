import { useState, useMemo } from "react";
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
import { Button } from "@/components/ui/button";
import { PageHeader } from "../components/layout/PageHeader/PageHeader";
import { CustomLegend } from "../components/CustomLegend/CustomLegend";
import { SquareDot } from "../components/CustomLegend/SquareDot";
import { ArrowLeft } from "lucide-react";

const COLORS = {
  primary: ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"],
  mood: { happy: "#10b981", tired: "#f59e0b", stressed: "#ef4444" },
  workout: { running: "#3b82f6", cycling: "#8b5cf6", stretching: "#ec4899" },
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<1 | 2 | 3>(1);
  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set());
  const [customColors, setCustomColors] = useState<Record<string, string>>({});

  const handleColorChange = (dataKey: string, color: string) => {
    setCustomColors((prev) => ({
      ...prev,
      [dataKey]: color,
    }));
  };

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

  const coffeeChartData = useMemo(() => {
    if (!coffeeConsumption?.teams) return [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataMap = new Map<number, any>();
    coffeeConsumption.teams.forEach((team) => {
      team.series.forEach((point) => {
        const existing = dataMap.get(point.cups) || { cups: point.cups };
        existing[`${team.team} Productivity`] = point.productivity;
        existing[`${team.team} Bugs`] = point.bugs;
        dataMap.set(point.cups, existing);
      });
    });
    return Array.from(dataMap.values()).sort((a, b) => a.cups - b.cups);
  }, [coffeeConsumption]);

  const snackChartData = useMemo(() => {
    if (!snackImpact?.departments) return [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataMap = new Map<number, any>();
    snackImpact.departments.forEach((dept) => {
      dept.metrics.forEach((point) => {
        const existing = dataMap.get(point.snacks) || { snacks: point.snacks };
        existing[`${dept.name} Morale`] = point.morale;
        existing[`${dept.name} Meetings`] = point.meetingsMissed;
        dataMap.set(point.snacks, existing);
      });
    });
    return Array.from(dataMap.values()).sort((a, b) => a.snacks - b.snacks);
  }, [snackImpact]);

  const toggleSeries = (dataKey: string) => {
    setHiddenSeries((prev) => {
      const next = new Set(prev);
      if (next.has(dataKey)) {
        next.delete(dataKey);
      } else {
        next.add(dataKey);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader>
        <Button
          variant="ghost"
          onClick={() => navigate("/posts")}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={18} /> Back to Posts
        </Button>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="w-20"></div>
      </PageHeader>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex gap-2 flex-wrap">
          <Button
            variant={activeView === 1 ? "default" : "outline"}
            onClick={() => setActiveView(1)}
          >
            Bar & Donut
          </Button>
          <Button
            variant={activeView === 2 ? "default" : "outline"}
            onClick={() => setActiveView(2)}
          >
            Stacked
          </Button>
          <Button
            variant={activeView === 3 ? "default" : "outline"}
            onClick={() => setActiveView(3)}
          >
            Dual Axis
          </Button>
        </div>

        {activeView === 1 && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Coffee Brands */}
              <div className="bg-card rounded-lg border p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">
                  Top Coffee Brands (Bar)
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={coffeeBrands || []}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="brand" />
                    <YAxis />
                    <Tooltip />
                    <Legend
                      content={
                        <CustomLegend
                          onToggle={toggleSeries}
                          hiddenSeries={hiddenSeries}
                          onColorChange={handleColorChange}
                        />
                      }
                    />
                    <Bar
                      dataKey="popularity"
                      fill={customColors["popularity"] || COLORS.primary[0]}
                      name="Popularity"
                      hide={hiddenSeries.has("Popularity")}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-card rounded-lg border p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">
                  Top Coffee Brands (Donut)
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      data={(coffeeBrands || []) as any}
                      dataKey="popularity"
                      nameKey="brand"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      label
                    >
                      {coffeeBrands?.map((entry, i) => (
                        <Cell
                          key={`cell-${i}`}
                          fill={
                            customColors[entry.brand] ||
                            COLORS.primary[i % COLORS.primary.length]
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend
                      content={
                        <CustomLegend
                          onToggle={toggleSeries}
                          hiddenSeries={hiddenSeries}
                          onColorChange={handleColorChange}
                        />
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Snack Brands */}
              <div className="bg-card rounded-lg border p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">
                  Popular Snack Brands (Bar)
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={snackBrands || []}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend
                      content={
                        <CustomLegend
                          onToggle={toggleSeries}
                          hiddenSeries={hiddenSeries}
                          onColorChange={handleColorChange}
                        />
                      }
                    />
                    <Bar
                      dataKey="share"
                      fill={customColors["share"] || COLORS.primary[1]}
                      name="Share"
                      hide={hiddenSeries.has("Share")}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-card rounded-lg border p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">
                  Popular Snack Brands (Donut)
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      data={(snackBrands || []) as any}
                      dataKey="share"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      label
                    >
                      {snackBrands?.map((entry, i) => (
                        <Cell
                          key={`cell-${i}`}
                          fill={
                            customColors[entry.name] ||
                            COLORS.primary[i % COLORS.primary.length]
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend
                      content={
                        <CustomLegend
                          onToggle={toggleSeries}
                          hiddenSeries={hiddenSeries}
                          onColorChange={handleColorChange}
                        />
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeView === 2 && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Mood Trend */}
              <div className="bg-card rounded-lg border p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">
                  Weekly Mood Trend (Stacked Area)
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={moodTrend}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Legend
                      content={
                        <CustomLegend
                          onToggle={toggleSeries}
                          hiddenSeries={hiddenSeries}
                          onColorChange={handleColorChange}
                        />
                      }
                    />
                    {["happy", "tired", "stressed"].map((key) => (
                      <Area
                        key={key}
                        type="monotone"
                        dataKey={key}
                        stackId="mood"
                        stroke={
                          customColors[key] ||
                          COLORS.mood[key as keyof typeof COLORS.mood]
                        }
                        fill={
                          customColors[key] ||
                          COLORS.mood[key as keyof typeof COLORS.mood]
                        }
                        fillOpacity={0.6}
                        hide={hiddenSeries.has(key)}
                      />
                    ))}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-card rounded-lg border p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">
                  Weekly Mood Trend (Stacked Bar)
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={moodTrend}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Legend
                      content={
                        <CustomLegend
                          onToggle={toggleSeries}
                          hiddenSeries={hiddenSeries}
                          onColorChange={handleColorChange}
                        />
                      }
                    />
                    {["happy", "tired", "stressed"].map((key) => (
                      <Bar
                        key={key}
                        dataKey={key}
                        stackId="mood-bar"
                        fill={
                          customColors[key] ||
                          COLORS.mood[key as keyof typeof COLORS.mood]
                        }
                        hide={hiddenSeries.has(key)}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Workout Trend */}
              <div className="bg-card rounded-lg border p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">
                  Weekly Workout Trend (Stacked Area)
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={combinedData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Legend
                      content={
                        <CustomLegend
                          onToggle={toggleSeries}
                          hiddenSeries={hiddenSeries}
                          onColorChange={handleColorChange}
                        />
                      }
                    />
                    {["running", "cycling", "stretching"].map((key) => (
                      <Area
                        key={key}
                        type="monotone"
                        dataKey={key}
                        stackId="workout"
                        stroke={
                          customColors[key] ||
                          COLORS.workout[key as keyof typeof COLORS.workout]
                        }
                        fill={
                          customColors[key] ||
                          COLORS.workout[key as keyof typeof COLORS.workout]
                        }
                        fillOpacity={0.6}
                        hide={hiddenSeries.has(key)}
                      />
                    ))}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-card rounded-lg border p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">
                  Weekly Workout Trend (Stacked Bar)
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={combinedData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Legend
                      content={
                        <CustomLegend
                          onToggle={toggleSeries}
                          hiddenSeries={hiddenSeries}
                          onColorChange={handleColorChange}
                        />
                      }
                    />
                    {["running", "cycling", "stretching"].map((key) => (
                      <Bar
                        key={key}
                        dataKey={key}
                        stackId="workout-bar"
                        fill={
                          customColors[key] ||
                          COLORS.workout[key as keyof typeof COLORS.workout]
                        }
                        hide={hiddenSeries.has(key)}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeView === 3 && (
          <div className="space-y-6">
            <div className="bg-card rounded-lg border p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">
                Coffee Consumption vs Bugs & Productivity
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={coffeeChartData}>
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
                  <YAxis
                    yAxisId="left"
                    label={{
                      value: "Bugs",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    label={{
                      value: "Productivity",
                      angle: 90,
                      position: "insideRight",
                    }}
                  />
                  <Tooltip />
                  <Legend
                    content={
                      <CustomLegend
                        onToggle={toggleSeries}
                        hiddenSeries={hiddenSeries}
                        markerShape="auto"
                        onColorChange={handleColorChange}
                      />
                    }
                  />
                  {coffeeConsumption?.teams?.map((team, i) => (
                    <Line
                      key={`${team.team}-bugs`}
                      yAxisId="left"
                      type="monotone"
                      dataKey={`${team.team} Bugs`}
                      name={`${team.team} Bugs`}
                      stroke={
                        customColors[`${team.team} Bugs`] || COLORS.primary[i]
                      }
                      strokeWidth={2}
                      hide={hiddenSeries.has(`${team.team} Bugs`)}
                      dot={{
                        r: 4,
                        fill:
                          customColors[`${team.team} Bugs`] ||
                          COLORS.primary[i],
                      }}
                      activeDot={{ r: 6 }}
                    />
                  ))}
                  {coffeeConsumption?.teams?.map((team, i) => (
                    <Line
                      key={`${team.team}-productivity`}
                      yAxisId="right"
                      type="monotone"
                      dataKey={`${team.team} Productivity`}
                      name={`${team.team} Productivity`}
                      stroke={
                        customColors[`${team.team} Productivity`] ||
                        COLORS.primary[i]
                      }
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      hide={hiddenSeries.has(`${team.team} Productivity`)}
                      dot={
                        <SquareDot
                          fill={
                            customColors[`${team.team} Productivity`] ||
                            COLORS.primary[i]
                          }
                        />
                      }
                      activeDot={{ r: 6 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-card rounded-lg border p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">
                Snack Impact on Meetings & Morale
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={snackChartData}>
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
                  <YAxis
                    yAxisId="left"
                    label={{
                      value: "Meetings Missed",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    label={{
                      value: "Morale",
                      angle: 90,
                      position: "insideRight",
                    }}
                  />
                  <Tooltip />
                  <Legend
                    content={
                      <CustomLegend
                        onToggle={toggleSeries}
                        hiddenSeries={hiddenSeries}
                        markerShape="auto"
                        onColorChange={handleColorChange}
                      />
                    }
                  />
                  {snackImpact?.departments?.map((dept, i) => (
                    <Line
                      key={`${dept.name}-missed`}
                      yAxisId="left"
                      type="monotone"
                      dataKey={`${dept.name} Meetings`}
                      name={`${dept.name} Meetings`}
                      stroke={
                        customColors[`${dept.name} Meetings`] ||
                        COLORS.primary[i]
                      }
                      strokeWidth={2}
                      hide={hiddenSeries.has(`${dept.name} Meetings`)}
                      dot={{
                        r: 4,
                        fill:
                          customColors[`${dept.name} Meetings`] ||
                          COLORS.primary[i],
                      }}
                      activeDot={{ r: 6 }}
                    />
                  ))}
                  {snackImpact?.departments?.map((dept, i) => (
                    <Line
                      key={`${dept.name}-morale`}
                      yAxisId="right"
                      type="monotone"
                      dataKey={`${dept.name} Morale`}
                      name={`${dept.name} Morale`}
                      stroke={
                        customColors[`${dept.name} Morale`] || COLORS.primary[i]
                      }
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      hide={hiddenSeries.has(`${dept.name} Morale`)}
                      dot={
                        <SquareDot
                          fill={
                            customColors[`${dept.name} Morale`] ||
                            COLORS.primary[i]
                          }
                        />
                      }
                      activeDot={{ r: 6 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
