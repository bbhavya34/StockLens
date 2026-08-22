import { create } from "zustand";
import { DemoTicker, Indicator, Timeframe } from "@/data/demo-stocks";

interface DemoState {
  selectedStock: DemoTicker;
  selectedTimeframe: Timeframe;
  selectedIndicators: Indicator[];
  setSelectedStock: (stock: DemoTicker) => void;
  setSelectedTimeframe: (timeframe: Timeframe) => void;
  toggleIndicator: (indicator: Indicator) => void;
}

export const useDemoStore = create<DemoState>((set) => ({
  selectedStock: "TCS",
  selectedTimeframe: "6M",
  selectedIndicators: ["SMA"],
  setSelectedStock: (stock) => set({ selectedStock: stock }),
  setSelectedTimeframe: (timeframe) => set({ selectedTimeframe: timeframe }),
  toggleIndicator: (indicator) =>
    set((state) => ({
      selectedIndicators: state.selectedIndicators.includes(indicator)
        ? state.selectedIndicators.filter((i) => i !== indicator)
        : [...state.selectedIndicators, indicator],
    })),
}));
