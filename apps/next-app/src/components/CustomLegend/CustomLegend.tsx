import { useState } from 'react'
import { Circle, Square } from 'lucide-react'
import { Button } from '@repo/components'

interface LegendItem {
  value: string
  type?: 'line' | 'monotone' | 'area' | 'bar'
  color?: string
  payload?: {
    strokeDasharray?: string
    value: string
    dataKey?: string
    color?: string
  }
  dataKey?: string
}

interface CustomLegendProps {
  payload?: LegendItem[]
  onToggle?: (dataKey: string) => void
  hiddenSeries?: Set<string>
  markerShape?: 'circle' | 'square' | 'auto'
  onColorChange?: (dataKey: string, color: string) => void
}

export function CustomLegend({
  payload = [],
  onToggle,
  hiddenSeries = new Set(),
  markerShape = 'auto',
  onColorChange
}: CustomLegendProps) {
  const [colorPicker, setColorPicker] = useState<string | null>(null)

  const getShape = (item: LegendItem) => {
    if (markerShape === 'circle')
      return (
        <Circle
          size={12}
          fill="currentColor"
        />
      )
    if (markerShape === 'square')
      return (
        <Square
          size={12}
          fill="currentColor"
        />
      )

    // Auto: Use dash array to determine shape
    const isDashed = item.payload?.strokeDasharray === '5 5'
    return isDashed ? (
      <Square
        size={12}
        fill="currentColor"
      />
    ) : (
      <Circle
        size={12}
        fill="currentColor"
      />
    )
  }

  return (
    <div className="flex flex-wrap gap-4 justify-center mt-4">
      {payload.map((entry, index) => {
        const dataKey = entry.dataKey || entry.payload?.dataKey || entry.value
        const isHidden = hiddenSeries.has(dataKey)
        const color = entry.color || entry.payload?.color || '#8884d8'

        return (
          <div
            key={`legend-item-${index}`}
            className="flex items-center gap-2 cursor-pointer select-none"
            onClick={() => onToggle?.(dataKey)}
          >
            <div
              className="relative"
              style={{
                color: isHidden ? '#ccc' : color,
                opacity: isHidden ? 0.5 : 1
              }}
            >
              {getShape(entry)}
            </div>
            <span className={`text-sm ${isHidden ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
              {entry.value}
            </span>
            {!isHidden && (
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1"
                onClick={(e) => {
                  e.stopPropagation()
                  setColorPicker(colorPicker === dataKey ? null : dataKey)
                }}
              >
                <div
                  className="w-3 h-3 rounded-full border border-border"
                  style={{ backgroundColor: color }}
                />
              </Button>
            )}
            {colorPicker === dataKey && (
              <div className="absolute z-10 bg-popover border rounded-md p-2 shadow-lg mt-8">
                <input
                  type="color"
                  defaultValue={color}
                  onChange={(e) => {
                    onColorChange?.(dataKey, e.target.value)
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
