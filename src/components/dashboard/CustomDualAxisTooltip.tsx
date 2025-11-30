// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CustomDualAxisTooltip = ({
  active,
  payload,
  label,
  xAxisLabel,
}: any) => {
  if (active && payload && payload.length) {
    // With shared={false}, payload[0] is the specific hovered item.
    // However, we should be careful.
    const item = payload[0];
    const data = item.payload; // The full data object for this X point
    const name = item.name; // The name of the series, e.g. "Frontend Bugs"
    const color = item.color;

    let teamName = name;
    let type = "coffee";

    if (name.includes("Bugs")) {
      teamName = name.replace(" Bugs", "");
      type = "coffee";
    } else if (name.includes("Productivity")) {
      teamName = name.replace(" Productivity", "");
      type = "coffee";
    } else if (name.includes("Meetings")) {
      teamName = name.replace(" Meetings", "");
      type = "snack";
    } else if (name.includes("Morale")) {
      teamName = name.replace(" Morale", "");
      type = "snack";
    }

    if (type === "coffee") {
      // We want to show the data for THIS team only.
      // The data object contains ALL teams' data.
      const bugs = data[`${teamName} Bugs`];
      const productivity = data[`${teamName} Productivity`];

      return (
        <div className="bg-popover border rounded-md p-3 shadow-md text-sm min-w-[150px]">
          <div className="font-bold mb-1" style={{ color }}>
            {teamName}
          </div>
          <div className="text-muted-foreground mb-2 text-xs">
            {xAxisLabel}: {label}
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: color }}
                />
                Bugs
              </span>
              <span className="font-mono">{bugs}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2" style={{ backgroundColor: color }} />
                Productivity
              </span>
              <span className="font-mono">{productivity}</span>
            </div>
          </div>
        </div>
      );
    } else {
      const meetings = data[`${teamName} Meetings`];
      const morale = data[`${teamName} Morale`];

      return (
        <div className="bg-popover border rounded-md p-3 shadow-md text-sm min-w-[150px]">
          <div className="font-bold mb-1" style={{ color }}>
            {teamName}
          </div>
          <div className="text-muted-foreground mb-2 text-xs">
            {xAxisLabel}: {label}
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: color }}
                />
                Meetings Missed
              </span>
              <span className="font-mono">{meetings}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2" style={{ backgroundColor: color }} />
                Morale
              </span>
              <span className="font-mono">{morale}</span>
            </div>
          </div>
        </div>
      );
    }
  }
  return null;
};
