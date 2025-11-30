interface TooltipProps {
  active?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any[]
  label?: string | number
  xAxisLabel?: string
  hoveredTeam?: string | null
}

export const CustomDualAxisTooltip = ({ active, payload, label, xAxisLabel, hoveredTeam }: TooltipProps) => {
  if (active && payload && payload.length) {
    // If no team is hovered, don't show tooltip (or show all? Requirement says "hovered team only")
    // If we strictly follow "show only hovered team data", we should return null if no team is hovered.
    // However, usually tooltips show something. But let's stick to the requirement:
    // "tooltip should show data for the hovered line's team"
    if (!hoveredTeam) return null

    // Group payload items by team
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const teamDataMap = new Map<string, any>()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload.forEach((item: any) => {
      const name = item.name || ''
      let teamName = ''

      // Extract team name from the dataKey
      if (name.includes(' Bugs')) {
        teamName = name.replace(' Bugs', '')
      } else if (name.includes(' Productivity')) {
        teamName = name.replace(' Productivity', '')
      } else if (name.includes(' Meetings')) {
        teamName = name.replace(' Meetings', '')
      } else if (name.includes(' Morale')) {
        teamName = name.replace(' Morale', '')
      }

      // Only process data for the hovered team
      if (teamName && teamName === hoveredTeam) {
        if (!teamDataMap.has(teamName)) {
          teamDataMap.set(teamName, {
            teamName,
            color: item.color || item.stroke,
            data: {}
          })
        }

        const teamData = teamDataMap.get(teamName)

        if (name.includes(' Bugs')) {
          teamData.data.bugs = item.value
        } else if (name.includes(' Productivity')) {
          teamData.data.productivity = item.value
        } else if (name.includes(' Meetings')) {
          teamData.data.meetings = item.value
        } else if (name.includes(' Morale')) {
          teamData.data.morale = item.value
        }
      }
    })

    const teams = Array.from(teamDataMap.values())
    if (teams.length === 0) return null

    const hasCoffeeData = teams.some((t) => t.data.bugs !== undefined)

    return (
      <div className="bg-popover border rounded-md p-3 shadow-md text-sm min-w-[180px]">
        <div className="text-muted-foreground mb-2 text-xs font-medium">
          {xAxisLabel}: {label}
        </div>
        <div className="space-y-3">
          {teams.map((team, index) => (
            <div
              key={index}
              className="border-t pt-2 first:border-t-0 first:pt-0"
            >
              <div
                className="font-bold mb-1.5"
                style={{ color: team.color }}
              >
                {team.teamName}
              </div>
              <div className="flex flex-col gap-1">
                {hasCoffeeData ? (
                  <>
                    {team.data.bugs !== undefined && (
                      <div className="flex items-center justify-between gap-4">
                        <span className="flex items-center gap-2">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: team.color }}
                          />
                          <span className="text-xs">Bugs</span>
                        </span>
                        <span className="font-mono text-xs font-semibold">{team.data.bugs}</span>
                      </div>
                    )}
                    {team.data.productivity !== undefined && (
                      <div className="flex items-center justify-between gap-4">
                        <span className="flex items-center gap-2">
                          <span
                            className="w-2 h-2"
                            style={{ backgroundColor: team.color }}
                          />
                          <span className="text-xs">Productivity</span>
                        </span>
                        <span className="font-mono text-xs font-semibold">{team.data.productivity}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {team.data.meetings !== undefined && (
                      <div className="flex items-center justify-between gap-4">
                        <span className="flex items-center gap-2">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: team.color }}
                          />
                          <span className="text-xs">Meetings Missed</span>
                        </span>
                        <span className="font-mono text-xs font-semibold">{team.data.meetings}</span>
                      </div>
                    )}
                    {team.data.morale !== undefined && (
                      <div className="flex items-center justify-between gap-4">
                        <span className="flex items-center gap-2">
                          <span
                            className="w-2 h-2"
                            style={{ backgroundColor: team.color }}
                          />
                          <span className="text-xs">Morale</span>
                        </span>
                        <span className="font-mono text-xs font-semibold">{team.data.morale}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  return null
}
