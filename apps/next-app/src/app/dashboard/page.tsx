import { getServerApi } from '../../api/client'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const api = await getServerApi()

  const [
    weeklyMoodRes,
    coffeeConsumptionRes,
    topCoffeeBrandsRes,
    snackImpactRes,
    weeklyWorkoutRes,
    popularSnackBrandsRes
  ] = await Promise.all([
    api.mock.weeklyMoodTrendList(),
    api.mock.coffeeConsumptionList(),
    api.mock.topCoffeeBrandsList(),
    api.mock.snackImpactList(),
    api.mock.weeklyWorkoutTrendList(),
    api.mock.popularSnackBrandsList()
  ])

  return (
    <DashboardClient
      weeklyMood={weeklyMoodRes.data}
      coffeeConsumption={coffeeConsumptionRes.data}
      topCoffeeBrands={topCoffeeBrandsRes.data}
      snackImpact={snackImpactRes.data}
      weeklyWorkout={weeklyWorkoutRes.data}
      popularSnackBrands={popularSnackBrandsRes.data}
    />
  )
}
