interface TooltipProps {
  active?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any[];
  label?: string | number;
  xAxisLabel?: string;
}

export const CustomDualAxisTooltip = ({
  active,
  payload,
  label,
  xAxisLabel,
}: TooltipProps) => {
  if (active && payload && payload.length) {
    // With shared={false}, payload[0] is the specific hovered item.
    const item = payload[0];
    // The full data object for this X point (contains all teams' data)
    const data = item.payload;
    const name = item.name || "";
    const color = item.color || item.stroke;

    let teamName = "";
    let chartType: "coffee" | "snack" = "coffee";

    // Extract team name and chart type from the dataKey
    if (name.includes(" Bugs")) {
      teamName = name.replace(" Bugs", "");
      chartType = "coffee";
    } else if (name.includes(" Productivity")) {
      teamName = name.replace(" Productivity", "");
      chartType = "coffee";
    } else if (name.includes(" Meetings")) {
      teamName = name.replace(" Meetings", "");
      chartType = "snack";
    } else if (name.includes(" Morale")) {
      teamName = name.replace(" Morale", "");
      chartType = "snack";
    }

    if (!teamName) return null;

    return (
      <div className="bg-popover border rounded-md p-3 shadow-md text-sm min-w-[150px]">
        <div className="font-bold mb-1" style={{ color }}>
          {teamName}
        </div>
        <div className="text-muted-foreground mb-2 text-xs">
          {xAxisLabel}: {label}
        </div>
        <div className="flex flex-col gap-1">
          {chartType === "coffee" ? (
            <>
              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs">Bugs</span>
                </span>
                <span className="font-mono text-xs font-semibold">
                  {data[`${teamName} Bugs`]}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-2">
                  <span
                    className="w-2 h-2"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs">Productivity</span>
                </span>
                <span className="font-mono text-xs font-semibold">
                  {data[`${teamName} Productivity`]}
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs">Meetings Missed</span>
                </span>
                <span className="font-mono text-xs font-semibold">
                  {data[`${teamName} Meetings`]}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-2">
                  <span
                    className="w-2 h-2"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs">Morale</span>
                </span>
                <span className="font-mono text-xs font-semibold">
                  {data[`${teamName} Morale`]}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
  return null;
};
