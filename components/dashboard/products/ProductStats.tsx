import DashboardCard from "../ui/DashboardCard";

const stats = [
  {
    label: "Total Products",
    value: "124",
  },
  {
    label: "Active Products",
    value: "118",
  },
  {
    label: "Member Discounts",
    value: "24",
  },
  {
    label: "Average Price",
    value: "$28",
  },
];

export default function ProductStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <DashboardCard key={stat.label} className="p-6">
          <p className="text-sm text-brand-muted mb-2">
            {stat.label}
          </p>

          <h3 className="text-3xl font-serif font-bold text-brand-brown">
            {stat.value}
          </h3>
        </DashboardCard>
      ))}
    </div>
  );
}