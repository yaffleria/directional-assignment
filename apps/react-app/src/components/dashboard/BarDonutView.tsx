import {
  BarChart,
  Bar,
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
import { CustomLegend } from "../CustomLegend/CustomLegend";

interface BarDonutViewProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  coffeeBrands: any[] | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  snackBrands: any[] | undefined;
  customColors: Record<string, string>;
  hiddenSeries: Set<string>;
  toggleSeries: (dataKey: string) => void;
  handleColorChange: (dataKey: string, color: string) => void;
  COLORS: { primary: string[] };
}

export const BarDonutView = ({
  coffeeBrands,
  snackBrands,
  customColors,
  hiddenSeries,
  toggleSeries,
  handleColorChange,
  COLORS,
}: BarDonutViewProps) => {
  return (
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
              {!hiddenSeries.has("Popularity") && (
                <Bar
                  dataKey="popularity"
                  fill={customColors["popularity"] || COLORS.primary[0]}
                  name="Popularity"
                  isAnimationActive={false}
                />
              )}
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
              {!hiddenSeries.has("Share") && (
                <Bar
                  dataKey="share"
                  fill={customColors["share"] || COLORS.primary[1]}
                  name="Share"
                  isAnimationActive={false}
                />
              )}
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
  );
};
