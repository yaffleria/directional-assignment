import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CustomLegend } from "../CustomLegend/CustomLegend";

interface StackedViewProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  moodTrend: any[] | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  combinedData: any[] | undefined;
  customColors: Record<string, string>;
  hiddenSeries: Set<string>;
  toggleSeries: (dataKey: string) => void;
  handleColorChange: (dataKey: string, color: string) => void;
  COLORS: {
    mood: { happy: string; tired: string; stressed: string };
    workout: { running: string; cycling: string; stretching: string };
  };
}

export const StackedView = ({
  moodTrend,
  combinedData,
  customColors,
  hiddenSeries,
  toggleSeries,
  handleColorChange,
  COLORS,
}: StackedViewProps) => {
  return (
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
                  isAnimationActive={false}
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
                  isAnimationActive={false}
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
                  isAnimationActive={false}
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
                  isAnimationActive={false}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
