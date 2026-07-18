export function SidebarOverviewMetric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div>
      <dt>{label}</dt>
      <dd className="mt-1 text-base font-semibold text-foreground">{value}</dd>
    </div>
  );
}
