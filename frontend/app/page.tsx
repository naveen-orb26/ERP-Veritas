

import { AppShell } from "@/components/layout/app-shell"

import { KPIWidget } from "@/components/dashboard/kpi-widget"

import { DashboardWidget } from "@/components/dashboard/dashboard-widget"

import { AnalyticsChart } from "@/components/dashboard/analytics-chart"

import { getDashboardOverview } from "@/lib/api/dashboard"

import { requireAuth,} from "@/lib/auth/require-auth"


export default async function HomePage() {

  const user =
  await requireAuth()
  
  const dashboardData =
    await getDashboardOverview()

  const metrics = dashboardData.metrics

  const activity = dashboardData.activity

  return (
    <AppShell user={user}>

      {/* KPI GRID */}

      <section
        className="
          grid
          gap-6
          sm:grid-cols-2
          2xl:grid-cols-4
        "
      >

        <KPIWidget
          title="Active Orders"
          subtitle="Current live customer orders"
          value={String(metrics.active_orders)}
          trend="+12.4% this week"
          icon="orders"
          delay={0}
        />

        <KPIWidget
          title="Production Running"
          subtitle="Batches currently active"
          value={String(metrics.production_running)}
          trend="4 new batches today"
          icon="production"
          delay={0.08}
        />

        <KPIWidget
          title="Dispatch Pending"
          subtitle="Ready for shipment"
          value={String(metrics.dispatch_pending)}
          trend="2 urgent dispatches"
          icon="dispatch"
          delay={0.16}
        />

        <KPIWidget
          title="Operational Efficiency"
          subtitle="Overall system throughput"
          value={`${metrics.efficiency}%`}
          trend="+1.8% improvement"
          icon="efficiency"
          delay={0.24}
        />

      </section>

      {/* LOWER GRID */}

      <section
        className="
          mt-6
          grid
          gap-6
          xl:grid-cols-3
        "
      >

        {/* Analytics */}

        <DashboardWidget
          title="Production Overview"
          subtitle="Real-time production intelligence"
          className="xl:col-span-2 min-h-[420px]"
          delay={0.35}
        >

          <AnalyticsChart />

        </DashboardWidget>

        {/* Activity */}

        <DashboardWidget
          title="System Activity"
          subtitle="Live operational events"
          className="min-h-[420px]"
          delay={0.42}
        >

          <div className="space-y-4">

            {activity.map(
              (
                event: {
                  module: string
                  action: string
                  description: string
                  timestamp: string
                },
                index: number
              ) => (

                <div
                  key={index}
                  className="
                    rounded-2xl
                    border
                    border-white/5
                    bg-white/5
                    p-4
                    transition-all
                    duration-300
                    hover:bg-white/[0.07]
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      gap-4
                    "
                  >

                    <div>

                      <p
                        className="
                          font-medium
                          text-zinc-200
                        "
                      >
                        {event.description}
                      </p>

                      <p
                        className="
                          mt-1
                          text-sm
                          text-zinc-500
                        "
                      >
                        {event.module}
                        {" • "}
                        {event.action}
                      </p>

                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        </DashboardWidget>

      </section>

    </AppShell>
  )
}