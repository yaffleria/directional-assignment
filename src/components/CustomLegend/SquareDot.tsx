interface SquareDotProps {
  cx?: number;
  cy?: number;
  fill?: string;
}

export const SquareDot = (props: SquareDotProps) => {
  const { cx = 0, cy = 0, fill = "#000" } = props;
  return (
    <rect
      x={cx - 4}
      y={cy - 4}
      width={8}
      height={8}
      fill={fill}
      stroke={fill}
      strokeWidth={0}
    />
  );
};
