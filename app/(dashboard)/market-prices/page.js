"use client";

import { useDashboard } from "@/components/DashboardProvider";
import SectionCard from "@/components/SectionCard";

export default function MarketPricesPage() {
  const { user } = useDashboard();

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-heading text-2xl sm:text-3xl font-bold mb-2">Market Prices</h1>
        <p className="text-muted text-sm sm:text-base">
          Track live crop prices and market trends to optimize your selling decisions
        </p>
      </div>

      <div className="grid gap-6">
        {/* eNAM - National Agriculture Market */}
        <SectionCard title="eNAM - National Agriculture Market" description="Official government platform for agricultural commodity prices across India">
          <div className="space-y-4">
            <div className="bg-[rgba(16,185,129,0.08)] border border-emerald-500/20 rounded-xl p-4">
              <p className="text-sm text-muted mb-3">
                eNAM (Electronic National Agriculture Market) is India's unified national market for agricultural commodities.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="https://www.enam.gov.in/web/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="primary-button text-center"
                >
                  Visit eNAM Website
                </a>
                <a
                  href="https://www.enam.gov.in/web/mandi-price"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="secondary-button text-center"
                >
                  View Price Dashboard
                </a>
              </div>
            </div>
            <div className="border surface-border rounded-xl overflow-hidden bg-[rgba(148,163,184,0.05)]" style={{ minHeight: "400px" }}>
              <div className="flex items-center justify-center h-full p-8 text-center">
                <div>
                  <p className="text-muted mb-4">Click the buttons above to view eNAM in a new tab</p>
                  <p className="text-xs text-muted">This website cannot be embedded due to security restrictions</p>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Agmarknet */}
        <SectionCard title="Agmarknet - Agricultural Marketing Information Network" description="Government portal for agricultural commodity prices and market information">
          <div className="space-y-4">
            <div className="bg-[rgba(14,165,233,0.08)] border border-blue-500/20 rounded-xl p-4">
              <p className="text-sm text-muted mb-3">
                Agmarknet provides daily market prices, arrivals, and market trends for agricultural commodities across India.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="http://agmarknet.gov.in/home"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="primary-button text-center"
                >
                  Visit Agmarknet Home
                </a>
                <a
                  href="http://agmarknet.gov.in/PriceAndArrivals/CommodityDailyReport.aspx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="secondary-button text-center"
                >
                  Daily Price Reports
                </a>
                <a
                  href="http://agmarknet.gov.in/PriceAndArrivals/StateWisePrice.aspx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="secondary-button text-center"
                >
                  State-wise Prices
                </a>
              </div>
            </div>
            <div className="border surface-border rounded-xl overflow-hidden bg-[rgba(148,163,184,0.05)]" style={{ minHeight: "400px" }}>
              <div className="flex items-center justify-center h-full p-8 text-center">
                <div>
                  <p className="text-muted mb-4">Click the buttons above to view Agmarknet in a new tab</p>
                  <p className="text-xs text-muted">This website cannot be embedded due to security restrictions</p>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Market Price Comparison Widget */}
        <SectionCard title="Quick Price Reference" description="Compare your crop prices with market rates">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="card-surface p-4">
              <h3 className="font-semibold text-heading mb-2">Wheat</h3>
              <p className="text-2xl font-bold text-accent mb-1">₹2,200-2,500</p>
              <p className="text-xs text-muted">per quintal</p>
              <p className="text-xs text-muted mt-2">Source: eNAM</p>
            </div>
            <div className="card-surface p-4">
              <h3 className="font-semibold text-heading mb-2">Rice</h3>
              <p className="text-2xl font-bold text-accent mb-1">₹2,800-3,200</p>
              <p className="text-xs text-muted">per quintal</p>
              <p className="text-xs text-muted mt-2">Source: eNAM</p>
            </div>
            <div className="card-surface p-4">
              <h3 className="font-semibold text-heading mb-2">Sugarcane</h3>
              <p className="text-2xl font-bold text-accent mb-1">₹3,100-3,400</p>
              <p className="text-xs text-muted">per quintal</p>
              <p className="text-xs text-muted mt-2">Source: Agmarknet</p>
            </div>
            <div className="card-surface p-4">
              <h3 className="font-semibold text-heading mb-2">Cotton</h3>
              <p className="text-2xl font-bold text-accent mb-1">₹7,000-8,500</p>
              <p className="text-xs text-muted">per quintal</p>
              <p className="text-xs text-muted mt-2">Source: eNAM</p>
            </div>
            <div className="card-surface p-4">
              <h3 className="font-semibold text-heading mb-2">Soybean</h3>
              <p className="text-2xl font-bold text-accent mb-1">₹4,200-4,800</p>
              <p className="text-xs text-muted">per quintal</p>
              <p className="text-xs text-muted mt-2">Source: Agmarknet</p>
            </div>
            <div className="card-surface p-4">
              <h3 className="font-semibold text-heading mb-2">Maize</h3>
              <p className="text-2xl font-bold text-accent mb-1">₹2,000-2,300</p>
              <p className="text-xs text-muted">per quintal</p>
              <p className="text-xs text-muted mt-2">Source: eNAM</p>
            </div>
          </div>
          <div className="mt-4 p-4 bg-[rgba(148,163,184,0.08)] rounded-xl">
            <p className="text-xs text-muted">
              <strong>Note:</strong> Prices are indicative and vary by location, quality, and market conditions. 
              Always check current rates on official platforms before making selling decisions. 
              Prices shown are approximate ranges and should be verified from official sources.
            </p>
          </div>
        </SectionCard>

        {/* Additional Resources */}
        <SectionCard title="Additional Resources" description="More platforms for market information">
          <div className="grid gap-4 sm:grid-cols-2">
            <a
              href="https://farmer.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="card-surface p-4 hover:border-accent transition-colors"
            >
              <h3 className="font-semibold text-heading mb-2">Farmer Portal</h3>
              <p className="text-sm text-muted">Government portal for farmers with market information and schemes</p>
            </a>
            <a
              href="https://www.kisanmitr.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="card-surface p-4 hover:border-accent transition-colors"
            >
              <h3 className="font-semibold text-heading mb-2">Kisan Mitr</h3>
              <p className="text-sm text-muted">Agricultural information and market price updates</p>
            </a>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

