import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CloudSun,
  ShieldCheck,
  Sparkles,
  Workflow,
  Users,
  Wallet,
} from "lucide-react";

const featureSections = [
  {
    title: "Expense Intelligence",
    description: "Track every rupee invested into crops, irrigation, fertilizers, and labor with automated categorization and real-time variance alerts.",
    icon: Wallet,
    bullets: [
      "Smart tagging for fixed, variable, and seasonal costs",
      "Budget vs. actual performance at field and crop level",
      "AI-powered savings recommendations updated daily",
    ],
  },
  {
    title: "Weather-Aligned Decisions",
    description: "Blend hyperlocal weather intelligence with agronomic insights to plan interventions when they matter most.",
    icon: CloudSun,
    bullets: [
      "Hyperlocal 7-day forecasts with agronomic risk scoring",
      "Irrigation and spraying windows based on humidity & wind",
      "Seasonal anomalies detected early to adjust planting plans",
    ],
  },
  {
    title: "Yield & Market Foresight",
    description: "Combine operational inputs with market signals to project yields, margins, and pricing opportunities before harvest.",
    icon: BarChart3,
    bullets: [
      "Predictive yield modeling with historical benchmarking",
      "Regional price intelligence across key mandis",
      "Profitability scenarios to guide crop mix decisions",
    ],
  },
  {
    title: "Team Collaboration",
    description: "Keep agronomists, field officers, and finance teams aligned with secure access to unified farm data.",
    icon: Users,
    bullets: [
      "Role-based dashboards and mobile-friendly workflows",
      "Automated reports for stakeholders and investors",
      "Audit trails for compliance and certification needs",
    ],
  },
];

const metrics = [
  { label: "Farms Onboarded(Testing)", value: "320+", detail: "Across horticulture, grains, and pulses" },
  { label: "Expense Visibility", value: "98%", detail: "Of monthly spends captured within 48 hours" },
  { label: "Decision Speed", value: "4× faster", detail: "From data collection to board-ready insights" },
];

const workflow = [
  {
    title: "Sync Your Operations",
    description: "Upload or connect existing spreadsheets, ERP feeds, and IoT data streams in minutes.",
  },
  {
    title: "Equip Your Team",
    description: "Invite collaborators with tailored permissions and guided onboarding playbooks.",
  },
  {
    title: "Run Continuous Intelligence",
    description: "Monitor crops, expenses, and weather in one HQ with proactive recommendations.",
  },
  {
    title: "Scale Confidently",
    description: "Forecast profit, align capital, and standardize best practices across farms.",
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-(--background) text-(--foreground)">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[420px] w-[420px] translate-x-1/3 translate-y-1/3 rounded-full bg-teal-400/10 blur-3xl" />
      </div>

      <header className="sticky top-0 z-30 border-b border-(--border)/70 backdrop-blur-md bg-(--background)/85">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-6">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 shadow-sm">
              <Sparkles className="h-5 w-5" />
            </span>
            QUANTQUEST Farm Expense HQ
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-(--muted-strong) md:flex">
            <a href="#features" className="transition hover:text-emerald-500">
              Features
            </a>
            <a href="#workflow" className="transition hover:text-emerald-500">
              How it works
            </a>
            <a href="#benefits" className="transition hover:text-emerald-500">
              Why choose us
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-xl border border-(--border) px-4 py-2 text-sm font-semibold text-(--muted-strong) transition hover:border-emerald-500/60 hover:text-emerald-500"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-600"
            >
              Start free trial
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-18 lg:pb-24 lg:pt-24">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-center">
            <div className="w-full space-y-6 text-center lg:w-[52%] lg:text-left">
              <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-500 sm:text-sm lg:mx-0">
                <ShieldCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Trusted Farm Finance Intelligence
              </div>
              <h1 className="mx-auto max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-(--foreground) sm:text-4xl md:text-[2.75rem] md:leading-[1.15] lg:mx-0">
                One command center for farm expenses, yields, and AI-powered insight.
              </h1>
              <p className="mx-auto max-w-xl text-base leading-relaxed text-(--muted-strong) sm:text-lg sm:leading-[1.6] lg:mx-0">
                QuantQuest Farm Expense HQ keeps your teams in sync and decisions grounded in real-time crop, weather,
                and financial intelligence—all in a single, ergonomic workspace designed for busy agribusiness leaders.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-4 lg:justify-start">
                <Link
                  href="/register"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:ring-offset-2 sm:w-auto"
                >
                  Launch your HQ
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="#features"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-transparent px-4 py-3 text-sm font-semibold text-emerald-500 transition hover:text-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30 focus-visible:ring-offset-2 sm:w-auto"
                >
                  Explore capabilities
                </Link>
              </div>
              <div className="mx-auto flex flex-col gap-3 text-sm text-(--muted-strong) sm:flex-row sm:items-center sm:justify-center sm:gap-6 lg:mx-0 lg:justify-start">
                <div className="flex items-center justify-center gap-2 lg:justify-start">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  Bank-grade security & role-based access
                </div>
                <div className="flex items-center justify-center gap-2 lg:justify-start">
                  <Workflow className="h-4 w-4 text-emerald-500" />
                  AI copilots trained on agronomy & finance
                </div>
              </div>
            </div>

            <div className="w-full lg:w-[48%]">
              <div className="relative h-full rounded-[24px] border border-(--border) bg-(--card)/95 p-5 shadow-xl sm:p-6">
                <div className="absolute -inset-4 hidden rounded-[28px] bg-linear-to-br from-emerald-500/20 via-transparent to-transparent blur-2xl sm:block" />
                <div className="relative grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-(--border) bg-white/70 p-4 shadow-sm sm:p-5">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-(--muted) sm:text-sm">Projected Seasonal Margin</p>
                      <span className="rounded-lg bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-500">
                        +18.6%
                      </span>
                    </div>
                    <p className="mt-3 text-2xl font-semibold text-(--foreground) sm:text-3xl">₹48,50,000</p>
                    <p className="text-xs text-(--muted)">Across integrated agronomy programs</p>
                  </div>
                  <div className="rounded-2xl border border-(--border) bg-white/70 p-4 shadow-sm sm:p-5">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-(--muted) sm:text-sm">Expense Efficiency</p>
                      <Sparkles className="h-4 w-4 text-emerald-500" />
                    </div>
                    <p className="mt-3 text-2xl font-semibold text-(--foreground) sm:text-3xl">72%</p>
                    <p className="text-xs text-(--muted)">Benchmarked vs. top-performing farms</p>
                  </div>
                  <div className="rounded-2xl border border-(--border) bg-white/70 p-4 shadow-sm sm:p-5">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-(--muted) sm:text-sm">Risk Alerts</p>
                      <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    </div>
                    <p className="mt-3 text-2xl font-semibold text-(--foreground) sm:text-3xl">3 active</p>
                    <p className="text-xs text-(--muted)">Rainfall & humidity watch for maize</p>
                  </div>
                  <div className="rounded-2xl border border-(--border) bg-white/70 p-4 shadow-sm sm:p-5">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-(--muted) sm:text-sm">Team Alignment</p>
                      <Users className="h-4 w-4 text-emerald-500" />
                    </div>
                    <p className="mt-3 text-2xl font-semibold text-(--foreground) sm:text-3xl">24 members</p>
                    <p className="text-xs text-(--muted)">Operations, finance, and agronomy synced</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="benefits" className="bg-(--card) py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-8 sm:grid-cols-3">
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-3xl border border-(--border) bg-white/70 p-8 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <p className="text-sm font-semibold uppercase tracking-wide text-emerald-500">
                    {metric.label}
                  </p>
                  <p className="mt-3 text-3xl font-semibold text-(--foreground)">{metric.value}</p>
                  <p className="mt-2 text-sm text-(--muted-strong)">{metric.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-6xl px-6 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-(--foreground) sm:text-4xl">
              Built for resilient, data-driven farm enterprises.
            </h2>
            <p className="mt-4 text-lg text-(--muted-strong)">
              Replace fragmented spreadsheets with a unified HQ that learns from every season and amplifies what works.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2">
            {featureSections.map((feature) => (
              <article
                key={feature.title}
                className="group flex flex-col rounded-3xl border border-(--border) bg-(--card) p-8 shadow-sm transition hover:-translate-y-1 hover:border-emerald-400/60 hover:shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <span className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-500">
                    <feature.icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-xl font-semibold text-(--foreground)">{feature.title}</h3>
                </div>
                <p className="mt-4 text-(--muted-strong)">{feature.description}</p>
                <ul className="mt-6 space-y-3 text-sm text-(--muted-strong)">
                  {feature.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2">
                      <div className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="workflow" className="bg-linear-to-br from-emerald-500/10 via-transparent to-transparent py-20">
          <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 lg:flex-row lg:items-center">
            <div className="lg:max-w-md">
              <p className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1 text-sm font-medium text-emerald-600">
                <Workflow className="h-4 w-4" />
                Launch in under a week
              </p>
              <h2 className="mt-6 text-3xl font-semibold tracking-tight text-(--foreground) sm:text-4xl">
                Turn operational data into predictive decisions.
              </h2>
              <p className="mt-4 text-lg text-(--muted-strong)">
                Our specialists support your onboarding, data cleanup, and training. Within days, every stakeholder
                accesses the same source of truth and guided actions.
              </p>
            </div>

            <div className="grid flex-1 gap-6 sm:grid-cols-2">
              {workflow.map((step, index) => (
                <div
                  key={step.title}
                  className="relative rounded-3xl border border-(--border) bg-(--card) p-6 shadow-sm"
                >
                  <span className="absolute -top-4 left-6 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-base font-semibold text-emerald-600">
                    {index + 1}
                  </span>
                  <h3 className="pt-6 text-lg font-semibold text-(--foreground)">{step.title}</h3>
                  <p className="mt-3 text-sm text-(--muted-strong)">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="relative overflow-hidden rounded-3xl border border-emerald-500/40 bg-linear-to-br from-emerald-500 via-emerald-500 to-emerald-600 p-10 text-white shadow-2xl">
            <div className="absolute right-10 top-10 hidden h-32 w-32 rounded-full border border-white/30 opacity-30 lg:block" />
            <div className="absolute -bottom-16 -left-12 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="relative">
              <p className="text-sm font-semibold uppercase tracking-widest text-white/80">Ready to transform</p>
              <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
                Bring AI-assisted visibility to every acre you manage.
              </h2>
              <p className="mt-4 max-w-2xl text-lg text-white/85">
                Start with a guided onboarding sprint and unlock unified dashboards for finance, agronomy, supply chain,
                and leadership. When your team logs in, they land inside the productivity workspace you just saw.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-base font-semibold text-emerald-600 transition hover:bg-white/90"
                >
                  Create your account
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/40 px-5 py-3 text-base font-semibold text-white transition hover:bg-white/10"
                >
                  Already onboard? Log in
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-(--border)/70 bg-(--card)/80">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-(--muted) sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} QuantQuest Technologies. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#features" className="transition hover:text-emerald-500">
              Platform
            </a>
            <Link href="/login" className="transition hover:text-emerald-500">
              Customer log in
            </Link>
            <Link href="/register" className="transition hover:text-emerald-500">
              Start free trial
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

