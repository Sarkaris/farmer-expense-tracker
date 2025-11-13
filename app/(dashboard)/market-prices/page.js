"use client";

import { useDashboard } from "@/components/DashboardProvider";
import SectionCard from "@/components/SectionCard";

export default function MarketPricesPage() {
  const { user } = useDashboard();

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-heading text-xl sm:text-2xl md:text-3xl font-bold mb-2">Market Prices</h1>
        <p className="text-muted text-xs sm:text-sm md:text-base">
          Track live crop prices and market trends to optimize your selling decisions
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6">
        {/* Quick Price Reference - Moved to top */}
        <SectionCard title="Quick Price Reference" description="Compare your crop prices with market rates">
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <div className="card-surface p-3 sm:p-4">
              <h3 className="font-semibold text-heading text-sm sm:text-base mb-2">Wheat</h3>
              <p className="text-xl sm:text-2xl font-bold text-accent mb-1">₹2,200-2,500</p>
              <p className="text-xs text-muted">per quintal</p>
              <p className="text-xs text-muted mt-2">Source: Agmarknet</p>
            </div>
            <div className="card-surface p-3 sm:p-4">
              <h3 className="font-semibold text-heading text-sm sm:text-base mb-2">Rice</h3>
              <p className="text-xl sm:text-2xl font-bold text-accent mb-1">₹2,800-3,200</p>
              <p className="text-xs text-muted">per quintal</p>
              <p className="text-xs text-muted mt-2">Source: Agmarknet</p>
            </div>
            <div className="card-surface p-3 sm:p-4">
              <h3 className="font-semibold text-heading text-sm sm:text-base mb-2">Sugarcane</h3>
              <p className="text-xl sm:text-2xl font-bold text-accent mb-1">₹3,100-3,400</p>
              <p className="text-xs text-muted">per quintal</p>
              <p className="text-xs text-muted mt-2">Source: Agmarknet</p>
            </div>
            <div className="card-surface p-3 sm:p-4">
              <h3 className="font-semibold text-heading text-sm sm:text-base mb-2">Cotton</h3>
              <p className="text-xl sm:text-2xl font-bold text-accent mb-1">₹7,000-8,500</p>
              <p className="text-xs text-muted">per quintal</p>
              <p className="text-xs text-muted mt-2">Source: Agmarknet</p>
            </div>
            <div className="card-surface p-3 sm:p-4">
              <h3 className="font-semibold text-heading text-sm sm:text-base mb-2">Soybean</h3>
              <p className="text-xl sm:text-2xl font-bold text-accent mb-1">₹4,200-4,800</p>
              <p className="text-xs text-muted">per quintal</p>
              <p className="text-xs text-muted mt-2">Source: Agmarknet</p>
            </div>
            <div className="card-surface p-3 sm:p-4">
              <h3 className="font-semibold text-heading text-sm sm:text-base mb-2">Maize</h3>
              <p className="text-xl sm:text-2xl font-bold text-accent mb-1">₹2,000-2,300</p>
              <p className="text-xs text-muted">per quintal</p>
              <p className="text-xs text-muted mt-2">Source: Agmarknet</p>
            </div>
          </div>
          <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-[rgba(148,163,184,0.08)] rounded-xl">
            <p className="text-xs text-muted leading-relaxed">
              <strong>Note:</strong> Prices are indicative and vary by location, quality, and market conditions. 
              Always check current rates on official platforms before making selling decisions. 
              Prices shown are approximate ranges and should be verified from official sources.
            </p>
          </div>
        </SectionCard>

        {/* Agmarknet - Redesigned to match image */}
        <div className="card-surface p-4 sm:p-6">
          <div className="mb-4">
            <h2 className="text-heading text-lg sm:text-xl md:text-2xl font-bold mb-2">
              Agmarknet - Agricultural Marketing Information Network
              <span className="ml-2 px-2 py-1 bg-[rgba(34,197,94,0.15)] text-[rgba(34,197,94,0.9)] text-xs sm:text-sm font-normal rounded">
                Information Network
              </span>
            </h2>
            <p className="text-muted text-xs sm:text-sm md:text-base">
              Government portal for agricultural commodity prices and market information.
            </p>
          </div>
          
          <div className="bg-[rgba(14,165,233,0.08)] border border-blue-500/20 rounded-xl p-4 sm:p-5">
            <p className="text-xs sm:text-sm text-muted mb-4 leading-relaxed">
              Agmarknet provides daily market prices, arrivals, and market trends for agricultural commodities across India.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <a
                href="http://agmarknet.gov.in/home"
                target="_blank"
                rel="noopener noreferrer"
                className="primary-button text-center text-xs sm:text-sm px-4 py-2.5 sm:py-3"
              >
                Visit Agmarknet Home
              </a>
              <a
                href="https://agmarknet.gov.in/marketarrivalsmonthanalysis"
                target="_blank"
                rel="noopener noreferrer"
                className="secondary-button text-center text-xs sm:text-sm px-4 py-2.5 sm:py-3"
              >
                Market Arrivals Analysis
              </a>
              <a
                href="https://agmarknet.gov.in/statewise-wholesale-month-arrival-table?commodity=122&year=2025&month=10"
                target="_blank"
                rel="noopener noreferrer"
                className="secondary-button text-center text-xs sm:text-sm px-4 py-2.5 sm:py-3"
              >
                State-wise Prices
              </a>
            </div>
          </div>
        </div>

        {/* Additional Resources */}
        <SectionCard title="Additional Resources" description="More platforms for market information and farmer services">
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <a
              href="https://pmfby.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="card-surface p-3 sm:p-4 hover:border-accent transition-colors block"
            >
              <h3 className="font-semibold text-heading text-sm sm:text-base mb-2">PMFBY - Crop Insurance</h3>
              <p className="text-xs sm:text-sm text-muted">Pradhan Mantri Fasal Bima Yojana - Apply for crop insurance and check application status</p>
            </a>
            <a
              href="https://farmer.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="card-surface p-3 sm:p-4 hover:border-accent transition-colors block"
            >
              <h3 className="font-semibold text-heading text-sm sm:text-base mb-2">Farmer Portal</h3>
              <p className="text-xs sm:text-sm text-muted">Government portal for farmers with market information and schemes</p>
            </a>
            <a
              href="https://www.kisanmitr.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="card-surface p-3 sm:p-4 hover:border-accent transition-colors block"
            >
              <h3 className="font-semibold text-heading text-sm sm:text-base mb-2">Kisan Mitr</h3>
              <p className="text-xs sm:text-sm text-muted">Agricultural information and market price updates</p>
            </a>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

