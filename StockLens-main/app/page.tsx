import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { StockSearch } from "@/components/landing/stock-search";
import { StockDashboardPreview } from "@/components/landing/stock-dashboard-preview";
import { Explainability } from "@/components/landing/explainability";
import { AgentNetwork } from "@/components/landing/agent-network";
import { FeaturesBento } from "@/components/landing/features-bento";
import { ComparisonSection } from "@/components/landing/comparison-section";
import { PortfolioSection } from "@/components/landing/portfolio-section";
import { BacktestingSection } from "@/components/landing/backtesting-section";
import { Workflow } from "@/components/landing/workflow";
import { FinalCta } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <StockSearch />
      <StockDashboardPreview />
      <Explainability />
      <AgentNetwork />
      <FeaturesBento />
      <ComparisonSection />
      <PortfolioSection />
      <BacktestingSection />
      <Workflow />
      <FinalCta />
      <Footer />
    </main>
  );
}
