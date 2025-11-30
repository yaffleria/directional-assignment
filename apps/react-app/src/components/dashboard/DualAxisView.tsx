import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { CustomLegend } from '../CustomLegend/CustomLegend'
import { SquareDot } from '../CustomLegend/SquareDot'
import { CustomDualAxisTooltip } from './CustomDualAxisTooltip'

interface DualAxisViewProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  coffeeChartData: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  snackChartData: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  coffeeConsumption: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  snackImpact: any
  customColors: Record<string, string>
  hiddenSeries: Set<string>
  toggleSeries: (dataKey: string) => void
  handleColorChange: (dataKey: string, color: string) => void
  COLORS: { primary: string[] }
}

export const DualAxisView = ({
  coffeeChartData,
  snackChartData,
  coffeeConsumption,
  snackImpact,
  customColors,
  hiddenSeries,
  toggleSeries,
  handleColorChange,
  COLORS
}: DualAxisViewProps) => {
  const [hoveredTeam, setHoveredTeam] = useState<string | null>(null)

  const handleLineHover = (dataKey: string) => {
    let teamName = ''
    if (dataKey.includes(' Bugs')) teamName = dataKey.replace(' Bugs', '')
    else if (dataKey.includes(' Productivity')) teamName = dataKey.replace(' Productivity', '')
    else if (dataKey.includes(' Meetings')) teamName = dataKey.replace(' Meetings', '')
    else if (dataKey.includes(' Morale')) teamName = dataKey.replace(' Morale', '')

    setHoveredTeam(teamName)
  }

  const handleLineLeave = () => {
    setHoveredTeam(null)
  }

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg border p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Coffee Consumption vs Bugs & Productivity</h3>
        <ResponsiveContainer
          width="100%"
          height={400}
        >
          <LineChart
            data={coffeeChartData}
            onMouseLeave={handleLineLeave}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              opacity={0.3}
            />
            <XAxis
              dataKey="cups"
              type="number"
              label={{
                value: 'Coffee Cups',
                position: 'insideBottom',
                offset: -5
              }}
            />
            <YAxis
              yAxisId="left"
              label={{
                value: 'Bugs',
                angle: -90,
                position: 'insideLeft'
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{
                value: 'Productivity',
                angle: 90,
                position: 'insideRight'
              }}
            />
            <Tooltip
              content={
                <CustomDualAxisTooltip
                  xAxisLabel="Cups"
                  hoveredTeam={hoveredTeam}
                />
              }
              shared={true}
              trigger="hover"
              isAnimationActive={false}
            />
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
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {coffeeConsumption?.teams?.map((team: any, i: number) => (
              <Line
                key={`${team.team}-bugs`}
                yAxisId="left"
                type="monotone"
                dataKey={`${team.team} Bugs`}
                name={`${team.team} Bugs`}
                stroke={customColors[`${team.team} Bugs`] || COLORS.primary[i]}
                strokeWidth={hoveredTeam === team.team ? 5 : 3}
                hide={hiddenSeries.has(`${team.team} Bugs`)}
                dot={{
                  r: 4,
                  fill: customColors[`${team.team} Bugs`] || COLORS.primary[i]
                }}
                activeDot={{ r: 8 }}
                isAnimationActive={false}
                onMouseEnter={() => handleLineHover(`${team.team} Bugs`)}
                onMouseLeave={handleLineLeave}
              />
            ))}
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {coffeeConsumption?.teams?.map((team: any, i: number) => (
              <Line
                key={`${team.team}-productivity`}
                yAxisId="right"
                type="monotone"
                dataKey={`${team.team} Productivity`}
                name={`${team.team} Productivity`}
                stroke={customColors[`${team.team} Productivity`] || COLORS.primary[i]}
                strokeWidth={hoveredTeam === team.team ? 5 : 3}
                strokeDasharray="5 5"
                hide={hiddenSeries.has(`${team.team} Productivity`)}
                dot={<SquareDot fill={customColors[`${team.team} Productivity`] || COLORS.primary[i]} />}
                activeDot={{ r: 8 }}
                isAnimationActive={false}
                onMouseEnter={() => handleLineHover(`${team.team} Productivity`)}
                onMouseLeave={handleLineLeave}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-card rounded-lg border p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Snack Impact on Meetings & Morale</h3>
        <ResponsiveContainer
          width="100%"
          height={400}
        >
          <LineChart
            data={snackChartData}
            onMouseLeave={handleLineLeave}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              opacity={0.3}
            />
            <XAxis
              dataKey="snacks"
              type="number"
              label={{
                value: 'Snacks per Day',
                position: 'insideBottom',
                offset: -5
              }}
            />
            <YAxis
              yAxisId="left"
              label={{
                value: 'Meetings Missed',
                angle: -90,
                position: 'insideLeft'
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{
                value: 'Morale',
                angle: 90,
                position: 'insideRight'
              }}
            />
            <Tooltip
              content={
                <CustomDualAxisTooltip
                  xAxisLabel="Snacks"
                  hoveredTeam={hoveredTeam}
                />
              }
              shared={true}
              trigger="hover"
              isAnimationActive={false}
            />
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
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {snackImpact?.departments?.map((dept: any, i: number) => (
              <Line
                key={`${dept.name}-missed`}
                yAxisId="left"
                type="monotone"
                dataKey={`${dept.name} Meetings`}
                name={`${dept.name} Meetings`}
                stroke={customColors[`${dept.name} Meetings`] || COLORS.primary[i]}
                strokeWidth={hoveredTeam === dept.name ? 5 : 3}
                hide={hiddenSeries.has(`${dept.name} Meetings`)}
                dot={{
                  r: 4,
                  fill: customColors[`${dept.name} Meetings`] || COLORS.primary[i]
                }}
                activeDot={{ r: 8 }}
                onMouseEnter={() => handleLineHover(`${dept.name} Meetings`)}
                onMouseLeave={handleLineLeave}
              />
            ))}
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {snackImpact?.departments?.map((dept: any, i: number) => (
              <Line
                key={`${dept.name}-morale`}
                yAxisId="right"
                type="monotone"
                dataKey={`${dept.name} Morale`}
                name={`${dept.name} Morale`}
                stroke={customColors[`${dept.name} Morale`] || COLORS.primary[i]}
                strokeWidth={hoveredTeam === dept.name ? 5 : 3}
                strokeDasharray="5 5"
                hide={hiddenSeries.has(`${dept.name} Morale`)}
                dot={<SquareDot fill={customColors[`${dept.name} Morale`] || COLORS.primary[i]} />}
                activeDot={{ r: 8 }}
                onMouseEnter={() => handleLineHover(`${dept.name} Morale`)}
                onMouseLeave={handleLineLeave}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
