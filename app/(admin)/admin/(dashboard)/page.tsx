// path: app/admin/page.tsx (or your dashboard layout route path)
import React from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  DollarSign, 
  ShoppingCart, 
  Clock, 
  Package 
} from "lucide-react";
import { 
  getDashboardStats, 
  getMonthlyRevenue, 
  getOrdersByStatus 
} from "@/lib/admin/dashboard"; // Update this import match path to your actual query file

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();
  const monthlyRevenue = await getMonthlyRevenue(6);
  const ordersByStatus = await getOrdersByStatus();

  const statCards = [
    {
      title: "Chiffre d'affaires global",
      value: `${stats.totalRevenue.toLocaleString()} DA`,
      icon: DollarSign,
      color: "text-blue-600",
      bg: "bg-blue-50",
      change: null,
    },
    {
      title: "Revenus du mois",
      value: `${stats.revenueThisMonth.toLocaleString()} DA`,
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      change: stats.revenueChangePercent,
    },
    {
      title: "Commandes actives",
      value: stats.activeOrders.toString(),
      icon: ShoppingCart,
      color: "text-purple-600",
      bg: "bg-purple-50",
      change: null,
    },
    {
      title: "En attente",
      value: stats.pendingOrders.toString(),
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
      change: null,
    },
  ];

  const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.revenue), 1);
  const maxOrders = Math.max(...ordersByStatus.map((o) => o.count), 1);

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto">
      {/* Header Info */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Tableau de bord</h1>
        <p className="mt-1 text-sm text-gray-500">Vue d'ensemble en temps réel de votre boutique</p>
      </div>

      {/* Stats KPI Cards Grid */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className={`rounded-full ${card.bg} p-2.5`}>
                  <Icon size={18} className={card.color} strokeWidth={2} />
                </div>
                {card.change !== null && (
                  <div
                    className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      card.change > 0
                        ? "text-emerald-700 bg-emerald-50"
                        : card.change < 0
                        ? "text-red-700 bg-red-50"
                        : "text-gray-500 bg-gray-50"
                    }`}
                  >
                    {card.change > 0 ? (
                      <TrendingUp size={12} />
                    ) : card.change < 0 ? (
                      <TrendingDown size={12} />
                    ) : (
                      <Minus size={12} />
                    )}
                    {`${Math.abs(Math.round(card.change))}%`}
                  </div>
                )}
              </div>
              <p className="mt-4 text-2xl font-bold tracking-tight text-gray-900">{card.value}</p>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mt-1">{card.title}</p>
            </div>
          );
        })}
      </div>

      {/* Main Charts Containers section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue Chart Component Card */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Revenus mensuels</h2>
            <p className="text-sm text-gray-400">Suivi sur les 6 derniers mois d'activité</p>
          </div>

          {/* Interactive CSS Tooltip Chart Structure Layout */}
          <div className="mt-8 h-48 flex items-end justify-between gap-3 px-2">
            {monthlyRevenue.map((item) => (
              <div key={item.month} className="group relative flex flex-1 flex-col items-center gap-2 h-full justify-end">
                
                {/* CSS Tooltip visible dynamically on Hover */}
                <div className="absolute -top-8 scale-0 transition-all rounded bg-gray-900 px-2 py-1 text-[10px] font-medium text-white shadow group-hover:scale-100 z-10 whitespace-nowrap">
                  {item.revenue.toLocaleString()} DA
                </div>
                
                <div
                  className="w-full rounded-t bg-blue-600/20 transition-all group-hover:bg-blue-600/50 cursor-pointer"
                  style={{
                    height: `${(item.revenue / maxRevenue) * 100}%`,
                    minHeight: item.revenue > 0 ? "6px" : "2px",
                  }}
                />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mt-1 capitalize">
                  {item.month}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between border-t border-gray-100 pt-4 text-xs font-medium text-gray-400">
            <span>0 DA</span>
            <span className="text-blue-600 font-semibold">Ce mois: {stats.revenueThisMonth.toLocaleString()} DA</span>
            <span>{maxRevenue.toLocaleString()} DA</span>
          </div>
        </div>

        {/* Orders Status Tracking Card */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Commandes par statut</h2>
            <p className="text-sm text-gray-400">Répartition actuelle du flux de commandes</p>
          </div>

          <div className="mt-6 space-y-4 my-auto">
            {ordersByStatus.map((item) => {
              const percentage = (item.count / maxOrders) * 100;
              const colors = {
                PENDING: "bg-amber-500",
                PROCESSING: "bg-blue-500",
                SHIPPED: "bg-purple-500",
                DELIVERED: "bg-emerald-500",
                CANCELLED: "bg-red-500",
              };

              return (
                <div key={item.status} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 font-medium">{item.label}</span>
                    <span className="font-bold text-gray-900">{item.count}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${colors[item.status]}`}
                      style={{ width: `${item.count > 0 ? Math.max(percentage, 2) : 0}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 border-t border-gray-100 pt-4 text-xs font-semibold text-gray-400">
            Total global: {ordersByStatus.reduce((acc, o) => acc + o.count, 0).toLocaleString()} commandes
          </div>
        </div>
      </div>
    </div>
  );
}