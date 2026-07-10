import {
  getDashboardStats,
  getMonthlyRevenue,
  getOrdersByStatus,
} from "@/lib/admin/dashboard";
import {
  DollarSign,
  ShoppingBag,
  Package,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();
  const monthlyRevenue = await getMonthlyRevenue(6);
  const ordersByStatus = await getOrdersByStatus();

  const statCards = [
    {
      title: "Chiffre d'affaires",
      value: `${stats.totalRevenue.toLocaleString()} DA`,
      icon: DollarSign,
      change: stats.revenueChangePercent,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
    },
    {
      title: "Commandes actives",
      value: stats.activeOrders,
      icon: ShoppingBag,
      change: null,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      title: "En attente",
      value: stats.pendingOrders,
      icon: Clock,
      change: null,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
    {
      title: "Produits",
      value: stats.totalProducts,
      icon: Package,
      change: null,
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
  ];

  const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.revenue), 1);
  const maxOrders = Math.max(...ordersByStatus.map((o) => o.count), 1);

  return (
    <div className="p-6 sm:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl text-ink sm:text-3xl">Tableau de bord</h1>
        <p className="mt-1 text-sm text-ink/50">
          Vue d'ensemble de votre boutique
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="rounded-xl border border-powder/30 bg-white/50 p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className={`rounded-full ${card.bg} p-2.5`}>
                  <Icon size={18} className={card.color} strokeWidth={1.5} />
                </div>
                {card.change !== null && (
                  <div
                    className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                      card.change > 0
                        ? "text-emerald-600 bg-emerald-50"
                        : card.change < 0
                        ? "text-red-600 bg-red-50"
                        : "text-ink/40 bg-powder/20"
                    }`}
                  >
                    {card.change > 0 ? (
                      <TrendingUp size={12} />
                    ) : card.change < 0 ? (
                      <TrendingDown size={12} />
                    ) : (
                      <Minus size={12} />
                    )}
                    {card.change !== null && `${Math.abs(Math.round(card.change))}%`}
                  </div>
                )}
              </div>
              <p className="mt-3 text-2xl font-semibold text-ink">{card.value}</p>
              <p className="text-xs uppercase tracking-widest text-ink/40">{card.title}</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <div className="rounded-xl border border-powder/30 bg-white/50 p-6 shadow-sm">
          <h2 className="font-display text-lg text-ink">Revenus mensuels</h2>
          <p className="text-sm text-ink/40">6 derniers mois</p>

          <div className="mt-6 h-48">
            <div className="flex h-full items-end justify-between gap-2">
              {monthlyRevenue.map((item) => (
                <div key={item.month} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t bg-navy/20 transition-all hover:bg-navy/30"
                    style={{
                      height: `${(item.revenue / maxRevenue) * 100}%`,
                      minHeight: item.revenue > 0 ? "8px" : "0",
                    }}
                  />
                  <span className="text-[10px] uppercase text-ink/40">{item.month}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex justify-between border-t border-powder/30 pt-3 text-xs text-ink/40">
            <span>0 DA</span>
            <span>Ce mois: {stats.revenueThisMonth.toLocaleString()} DA</span>
            <span>{maxRevenue.toLocaleString()} DA</span>
          </div>
        </div>

        {/* Orders by Status */}
        <div className="rounded-xl border border-powder/30 bg-white/50 p-6 shadow-sm">
          <h2 className="font-display text-lg text-ink">Commandes par statut</h2>
          <p className="text-sm text-ink/40">Répartition actuelle</p>

          <div className="mt-6 space-y-3">
            {ordersByStatus.map((item) => {
              const percentage = (item.count / maxOrders) * 100;
              const colors = {
                PENDING: "bg-amber-500",
                PROCESSING: "bg-blue-500",
                SHIPPED: "bg-purple-500",
                DELIVERED: "bg-emerald-500",
                CANCELLED: "bg-red-400",
              };

              return (
                <div key={item.status} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-ink/60">{item.label}</span>
                    <span className="font-medium text-ink">{item.count}</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-powder/20">
                    <div
                      className={`h-full rounded-full ${colors[item.status]}`}
                      style={{ width: `${Math.max(percentage, 0.5)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 border-t border-powder/30 pt-3 text-xs text-ink/40">
            Total: {ordersByStatus.reduce((acc, o) => acc + o.count, 0)} commandes
          </div>
        </div>
      </div>
    </div>
  );
}