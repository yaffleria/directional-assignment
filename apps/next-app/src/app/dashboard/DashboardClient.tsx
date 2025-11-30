'use client'

import { useState, useMemo } from 'react'
import { PageHeader } from '../../components/layout/PageHeader/PageHeader'
import { Button } from '@repo/components'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { BarDonutView } from '../../components/dashboard/BarDonutView'
import { StackedView } from '../../components/dashboard/StackedView'
import { DualAxisView } from '../../components/dashboard/DualAxisView'
import type {
  WeeklyMoodTrendResponse,
  CoffeeConsumptionResponse,
  TopCoffeeBrandsResponse,
  SnackImpactResponse,
  WeeklyWorkoutTrendResponse,
  PopularSnackBrandsResponse
} from '../../api/data-contracts'

interface DashboardClientProps {
  weeklyMood: WeeklyMoodTrendResponse
  coffeeConsumption: CoffeeConsumptionResponse
  topCoffeeBrands: TopCoffeeBrandsResponse
  snackImpact: SnackImpactResponse
  weeklyWorkout: WeeklyWorkoutTrendResponse
  popularSnackBrands: PopularSnackBrandsResponse
}

const COLORS = {
  primary: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'],
  mood: { happy: '#10b981', tired: '#f59e0b', stressed: '#ef4444' },
  workout: { running: '#3b82f6', cycling: '#8b5cf6', stretching: '#ec4899' }
}

export default function DashboardClient({
  weeklyMood,
  coffeeConsumption,
  topCoffeeBrands,
  snackImpact,
  weeklyWorkout,
  popularSnackBrands
}: DashboardClientProps) {
  const router = useRouter()
  const [activeView, setActiveView] = useState<1 | 2 | 3>(1)
  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set())
  const [customColors, setCustomColors] = useState<Record<string, string>>({})

  const handleColorChange = (dataKey: string, color: string) => {
    setCustomColors((prev) => ({
      ...prev,
      [dataKey]: color
    }))
  }

  const toggleSeries = (dataKey: string) => {
    setHiddenSeries((prev) => {
      const next = new Set(prev)
      if (next.has(dataKey)) {
        next.delete(dataKey)
      } else {
        next.add(dataKey)
      }
      return next
    })
  }

  const combinedData = useMemo(() => {
    return weeklyMood?.map((mood, index) => ({
      ...mood,
      running: weeklyWorkout?.[index]?.running || 0,
      cycling: weeklyWorkout?.[index]?.cycling || 0,
      stretching: weeklyWorkout?.[index]?.stretching || 0
    }))
  }, [weeklyMood, weeklyWorkout])

  const coffeeChartData = useMemo(() => {
    if (!coffeeConsumption?.teams) return []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataMap = new Map<number, any>()
    coffeeConsumption.teams.forEach((team) => {
      team.series.forEach((point) => {
        const existing = dataMap.get(point.cups) || { cups: point.cups }
        existing[`${team.team} Productivity`] = point.productivity
        existing[`${team.team} Bugs`] = point.bugs
        dataMap.set(point.cups, existing)
      })
    })
    return Array.from(dataMap.values()).sort((a, b) => a.cups - b.cups)
  }, [coffeeConsumption])

  const snackChartData = useMemo(() => {
    if (!snackImpact?.departments) return []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataMap = new Map<number, any>()
    snackImpact.departments.forEach((dept) => {
      dept.metrics.forEach((point) => {
        const existing = dataMap.get(point.snacks) || { snacks: point.snacks }
        existing[`${dept.name} Morale`] = point.morale
        existing[`${dept.name} Meetings`] = point.meetingsMissed
        dataMap.set(point.snacks, existing)
      })
    })
    return Array.from(dataMap.values()).sort((a, b) => a.snacks - b.snacks)
  }, [snackImpact])

  return (
    <div className="min-h-screen bg-background">
      <PageHeader>
        <Button
          variant="ghost"
          onClick={() => router.push('/posts')}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          Back to Posts
        </Button>
        <h1 className="text-xl font-bold">Dashboard</h1>
        <div className="w-20"></div>
      </PageHeader>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex gap-2 flex-wrap">
          <Button
            variant={activeView === 1 ? 'default' : 'outline'}
            onClick={() => setActiveView(1)}
          >
            Bar & Donut
          </Button>
          <Button
            variant={activeView === 2 ? 'default' : 'outline'}
            onClick={() => setActiveView(2)}
          >
            Stacked
          </Button>
          <Button
            variant={activeView === 3 ? 'default' : 'outline'}
            onClick={() => setActiveView(3)}
          >
            Dual Axis
          </Button>
        </div>

        {activeView === 1 && (
          <BarDonutView
            coffeeBrands={topCoffeeBrands}
            snackBrands={popularSnackBrands}
            customColors={customColors}
            hiddenSeries={hiddenSeries}
            toggleSeries={toggleSeries}
            handleColorChange={handleColorChange}
            COLORS={COLORS}
          />
        )}

        {activeView === 2 && (
          <StackedView
            moodTrend={weeklyMood}
            combinedData={combinedData}
            customColors={customColors}
            hiddenSeries={hiddenSeries}
            toggleSeries={toggleSeries}
            handleColorChange={handleColorChange}
            COLORS={COLORS}
          />
        )}

        {activeView === 3 && (
          <DualAxisView
            coffeeChartData={coffeeChartData}
            snackChartData={snackChartData}
            coffeeConsumption={coffeeConsumption}
            snackImpact={snackImpact}
            customColors={customColors}
            hiddenSeries={hiddenSeries}
            toggleSeries={toggleSeries}
            handleColorChange={handleColorChange}
            COLORS={COLORS}
          />
        )}
      </div>
    </div>
  )
}
