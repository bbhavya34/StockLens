export type SignalTone = "positive" | "negative" | "neutral" | "warning";

export interface ChartPoint {
  date: string;
  price: number;
}

export interface AgentSignal {
  label: string;
  status: string;
  tone: SignalTone;
  explanation: string;
}

export interface DemoStock {
  company: string;
  ticker: string;
  exchange: string;
  price: number;
  change: number;
  changePercent: number;
  chartData: ChartPoint[];
  technicalStatus: AgentSignal;
  fundamentalStatus: AgentSignal;
  newsStatus: AgentSignal;
  valuationStatus: AgentSignal;
  riskStatus: AgentSignal;
  overall: string;
  overallTone: SignalTone;
  signalsAnalyzed: number;
}

function genSeries(base: number, drift: number, volatility: number, points = 26): ChartPoint[] {
  let value = base;
  const out: ChartPoint[] = [];
  const now = new Date();
  for (let i = points - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i * 7);
    const noise = (Math.sin(i * 1.7) + Math.sin(i * 0.6)) * volatility;
    value = value + drift + noise;
    out.push({
      date: d.toLocaleDateString("en-IN", { month: "short", day: "2-digit" }),
      price: Math.round(value * 100) / 100,
    });
  }
  return out;
}

export const demoStocks: Record<string, DemoStock> = {
  TCS: {
    company: "Tata Consultancy Services",
    ticker: "TCS",
    exchange: "NSE",
    price: 3842.7,
    change: 50.4,
    changePercent: 1.34,
    chartData: genSeries(3550, 12, 18),
    technicalStatus: {
      label: "Technical",
      status: "Positive",
      tone: "positive",
      explanation: "Price remains above its 50-day moving average.",
    },
    fundamentalStatus: {
      label: "Fundamentals",
      status: "Strong",
      tone: "positive",
      explanation: "Revenue growth and ROE remain healthy.",
    },
    newsStatus: {
      label: "News",
      status: "Moderately Positive",
      tone: "positive",
      explanation: "Recent coverage shows moderately positive sentiment.",
    },
    valuationStatus: {
      label: "Valuation",
      status: "Elevated",
      tone: "warning",
      explanation: "P/E remains above the sector median.",
    },
    riskStatus: {
      label: "Risk",
      status: "Medium",
      tone: "warning",
      explanation: "Volatility is slightly elevated versus peers.",
    },
    overall: "Moderately Bullish",
    overallTone: "positive",
    signalsAnalyzed: 12,
  },
  RELIANCE: {
    company: "Reliance Industries",
    ticker: "RELIANCE",
    exchange: "NSE",
    price: 2984.15,
    change: -18.25,
    changePercent: -0.61,
    chartData: genSeries(2850, 6, 22),
    technicalStatus: {
      label: "Technical",
      status: "Neutral",
      tone: "neutral",
      explanation: "Price is consolidating near its 20-day average.",
    },
    fundamentalStatus: {
      label: "Fundamentals",
      status: "Strong",
      tone: "positive",
      explanation: "Diversified segment growth supports stable margins.",
    },
    newsStatus: {
      label: "News",
      status: "Mixed",
      tone: "neutral",
      explanation: "Coverage is split between retail growth and capex concerns.",
    },
    valuationStatus: {
      label: "Valuation",
      status: "Fair",
      tone: "positive",
      explanation: "P/E is broadly in line with its 5-year average.",
    },
    riskStatus: {
      label: "Risk",
      status: "Low",
      tone: "positive",
      explanation: "Volatility remains below sector average.",
    },
    overall: "Neutral",
    overallTone: "neutral",
    signalsAnalyzed: 15,
  },
  INFY: {
    company: "Infosys",
    ticker: "INFY",
    exchange: "NSE",
    price: 1512.9,
    change: -9.8,
    changePercent: -0.64,
    chartData: genSeries(1560, -4, 16),
    technicalStatus: {
      label: "Technical",
      status: "Weak",
      tone: "negative",
      explanation: "Price has slipped below its 50-day moving average.",
    },
    fundamentalStatus: {
      label: "Fundamentals",
      status: "Stable",
      tone: "neutral",
      explanation: "Margins are steady but revenue growth has slowed.",
    },
    newsStatus: {
      label: "News",
      status: "Neutral",
      tone: "neutral",
      explanation: "Coverage has been largely event-driven this month.",
    },
    valuationStatus: {
      label: "Valuation",
      status: "Attractive",
      tone: "positive",
      explanation: "P/E trades at a discount to its historical median.",
    },
    riskStatus: {
      label: "Risk",
      status: "Medium",
      tone: "warning",
      explanation: "Currency exposure adds moderate earnings volatility.",
    },
    overall: "Cautiously Neutral",
    overallTone: "neutral",
    signalsAnalyzed: 11,
  },
  HDFCBANK: {
    company: "HDFC Bank",
    ticker: "HDFCBANK",
    exchange: "NSE",
    price: 1698.35,
    change: 21.6,
    changePercent: 1.28,
    chartData: genSeries(1590, 9, 14),
    technicalStatus: {
      label: "Technical",
      status: "Positive",
      tone: "positive",
      explanation: "Momentum has turned upward after basing near support.",
    },
    fundamentalStatus: {
      label: "Fundamentals",
      status: "Strong",
      tone: "positive",
      explanation: "Deposit growth and asset quality remain healthy.",
    },
    newsStatus: {
      label: "News",
      status: "Positive",
      tone: "positive",
      explanation: "Coverage reflects confidence in credit growth outlook.",
    },
    valuationStatus: {
      label: "Valuation",
      status: "Fair",
      tone: "positive",
      explanation: "P/B is close to its long-term historical average.",
    },
    riskStatus: {
      label: "Risk",
      status: "Low",
      tone: "positive",
      explanation: "Volatility remains contained relative to the index.",
    },
    overall: "Bullish",
    overallTone: "positive",
    signalsAnalyzed: 13,
  },
};

export const demoTickers = ["TCS", "RELIANCE", "INFY", "HDFCBANK"] as const;
export type DemoTicker = (typeof demoTickers)[number];

export const timeframes = ["1D", "1W", "1M", "3M", "6M", "1Y"] as const;
export type Timeframe = (typeof timeframes)[number];

export const indicators = ["SMA", "EMA", "RSI", "MACD"] as const;
export type Indicator = (typeof indicators)[number];

export const fundamentalMetrics: Record<DemoTicker, { pe: number; eps: number; roe: number; revGrowth: number; debtEquity: number }> = {
  TCS: { pe: 29.8, eps: 129.1, roe: 46.2, revGrowth: 8.4, debtEquity: 0.02 },
  RELIANCE: { pe: 24.1, eps: 123.7, roe: 9.8, revGrowth: 6.1, debtEquity: 0.35 },
  INFY: { pe: 22.6, eps: 66.9, roe: 29.4, revGrowth: 4.2, debtEquity: 0.06 },
  HDFCBANK: { pe: 19.3, eps: 88.1, roe: 17.1, revGrowth: 11.2, debtEquity: 0.88 },
};

export const mockNews = [
  { headline: "IT majors see steady deal pipeline heading into earnings season", sentiment: "Positive" as const, source: "Market Wire" },
  { headline: "Analysts flag currency headwinds for export-heavy sectors", sentiment: "Negative" as const, source: "Business Daily" },
  { headline: "Sector rotation into financials continues for third week", sentiment: "Neutral" as const, source: "Desk Notes" },
];

export const comparisonData = {
  TCS: {
    revenueGrowth: "8.4%",
    profitGrowth: "6.9%",
    pe: "29.8",
    roe: "46.2%",
    debt: "Minimal",
    newsSentiment: "Moderately Positive",
    volatility: "Medium",
  },
  INFY: {
    revenueGrowth: "4.2%",
    profitGrowth: "3.1%",
    pe: "22.6",
    roe: "29.4%",
    debt: "Low",
    newsSentiment: "Neutral",
    volatility: "Medium",
  },
};

export const portfolioAllocation = [
  { name: "TCS", value: 35, color: "#10b981" },
  { name: "RELIANCE", value: 25, color: "#22d3ee" },
  { name: "INFY", value: 25, color: "#f59e0b" },
  { name: "HDFCBANK", value: 15, color: "#8b8b93" },
];

export const backtestResult = {
  totalTrades: 18,
  winners: 11,
  losers: 7,
  winRate: 61,
  returnPct: 24.3,
  maxDrawdown: -12.1,
};
