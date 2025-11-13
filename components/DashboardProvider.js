"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  DEMO_USER,
  DEMO_CROPS,
  DEMO_EXPENSES,
  DEMO_YIELDS,
  DEMO_WEATHER,
  DEMO_FORECAST,
  DEMO_TOTALS,
  DEMO_CROP_SUMMARIES,
  DEMO_INSIGHTS,
} from "@/lib/demoData";

async function fetchJSON(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    let message = `Request failed: ${res.status}`;
    try {
      const text = await res.text();
      // Try to parse as JSON first
      try {
        const json = JSON.parse(text);
        message = json.message || json.error || text || message;
      } catch {
        // If not JSON, check if it's HTML
        if (text.trim().startsWith("<!DOCTYPE") || text.trim().startsWith("<html")) {
          message = `Server error: ${res.status}. Please check your API configuration.`;
        } else {
          message = text || message;
        }
      }
    } catch (err) {
      console.error("Error parsing error response:", err);
    }
    throw new Error(message);
  }

  return res.json();
}

const DashboardContext = createContext(null);

export function DashboardProvider({ children }) {
  const [demoMode, setDemoMode] = useState(false); // Demo mode off by default
  const [user, setUser] = useState(null);
  const [crops, setCrops] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [yields, setYields] = useState([]);
  const [totals, setTotals] = useState({ expense: 0, revenue: 0, profit: 0 });
  const [cropSummaries, setCropSummaries] = useState([]);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [insights, setInsights] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [error, setError] = useState("");
  const [initializing, setInitializing] = useState(true);
  const [reportLoading, setReportLoading] = useState(false);

  const loadInsights = useCallback(async (userId, { silent = false } = {}) => {
    if (!userId) return;
    setInsightsLoading(true);
    try {
      const data = await fetchJSON("/api/insights", {
        method: "POST",
        body: JSON.stringify({ userId }),
      });
      setInsights(data.insights || "");
      if (data.cropSummaries) setCropSummaries(data.cropSummaries);
      if (data.totals) setTotals(data.totals);
      if (data.weather) setWeather(data.weather);
      if (data.forecast) setForecast(data.forecast);
      if (!silent) setError("");
    } catch (err) {
      console.error(err);
      if (!silent) {
        setError(err.message || "Gemini could not produce insights right now.");
      }
    } finally {
      setInsightsLoading(false);
    }
  }, []);

  const loadWeather = useCallback(async (pincode) => {
    if (!pincode) {
      setWeather(null);
      setForecast([]);
      return;
    }
    setWeatherLoading(true);
    try {
      const data = await fetchJSON(`/api/weather?pincode=${pincode}`);
      setWeather(data.current || null);
      setForecast(data.forecast || []);
      if (data.message && !data.current) {
        console.warn("Weather API:", data.message);
      }
    } catch (err) {
      console.error("Weather loading error:", err);
      setWeather(null);
      setForecast([]);
    } finally {
      setWeatherLoading(false);
    }
  }, []);

  const loadSummary = useCallback(
    async (userId, options = {}) => {
      if (!userId) return;
      setSummaryLoading(true);
      try {
        const summary = await fetchJSON(`/api/summary?userId=${userId}`);
        setCrops(summary.crops || []);
        setExpenses(summary.expenses || []);
        setYields(summary.yields || []);
        setTotals(summary.totals || { expense: 0, revenue: 0, profit: 0 });
        setCropSummaries(summary.cropSummaries || []);
        if (options.withInsights) {
          await loadInsights(userId, { silent: true });
        }
        setError("");
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to refresh summary");
      } finally {
        setSummaryLoading(false);
      }
    },
    [loadInsights]
  );

  const enableDemoMode = useCallback(() => {
    setDemoMode(true);
    setUser(DEMO_USER);
    setCrops(DEMO_CROPS);
    setExpenses(DEMO_EXPENSES);
    setYields(DEMO_YIELDS);
    setWeather(DEMO_WEATHER);
    setForecast(DEMO_FORECAST);
    setTotals(DEMO_TOTALS);
    setCropSummaries(DEMO_CROP_SUMMARIES);
    setInsights(DEMO_INSIGHTS);
    setError("");
    setInitializing(false);
  }, []);

  const disableDemoMode = useCallback(async () => {
    setDemoMode(false);
    setUser(null);
    setCrops([]);
    setExpenses([]);
    setYields([]);
    setWeather(null);
    setForecast([]);
    setTotals({ expense: 0, revenue: 0, profit: 0 });
    setCropSummaries([]);
    setInsights("");
    setInitializing(true);
    try {
      const currentUser = await fetchJSON("/api/auth/me");
      if (currentUser) {
        setUser(currentUser);
        await Promise.all([
          loadSummary(currentUser._id, { withInsights: true }),
          loadWeather(currentUser.pincode),
        ]);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to load initial data");
    } finally {
      setInitializing(false);
    }
  }, [loadSummary, loadWeather]);

  // Initialize demo mode on mount
  useEffect(() => {
    if (demoMode) {
      setUser(DEMO_USER);
      setCrops(DEMO_CROPS);
      setExpenses(DEMO_EXPENSES);
      setYields(DEMO_YIELDS);
      setWeather(DEMO_WEATHER);
      setForecast(DEMO_FORECAST);
      setTotals(DEMO_TOTALS);
      setCropSummaries(DEMO_CROP_SUMMARIES);
      setInsights(DEMO_INSIGHTS);
      setError("");
      setInitializing(false);
      return;
    }
    
    async function bootstrap() {
      try {
        // Get authenticated user
        const currentUser = await fetchJSON("/api/auth/me");
        if (currentUser) {
          setUser(currentUser);
          await Promise.all([
            loadSummary(currentUser._id, { withInsights: true }),
            loadWeather(currentUser.pincode),
          ]);
        }
      } catch (err) {
        console.error(err);
        setError(err.message || "Unable to load initial data");
      } finally {
        setInitializing(false);
      }
    }

    bootstrap();
  }, [loadSummary, loadWeather, demoMode]);

  const handleSaveUser = useCallback(
    async (payload) => {
      setProfileLoading(true);
      try {
        const method = payload._id ? "PUT" : "POST";
        const userResponse = await fetchJSON("/api/users", {
          method,
          body: JSON.stringify(payload),
        });
        setUser(userResponse);
        await Promise.all([
          loadSummary(userResponse._id, { withInsights: true }),
          loadWeather(userResponse.pincode),
        ]);
        setError("");
      } catch (err) {
        console.error(err);
        setError(err.message || "Unable to save user profile");
      } finally {
        setProfileLoading(false);
      }
    },
    [loadSummary, loadWeather]
  );

  const handleAddCrop = useCallback(
    async (data) => {
      if (!user) return;
      try {
        await fetchJSON("/api/crops", {
          method: "POST",
          body: JSON.stringify({ ...data, userId: user._id }),
        });
        await loadSummary(user._id, { withInsights: true });
        setError("");
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to add crop");
      }
    },
    [user, loadSummary]
  );

  const handleAddExpense = useCallback(
    async (data) => {
      if (!user) return;
      try {
        await fetchJSON("/api/expenses", {
          method: "POST",
          body: JSON.stringify({ ...data, userId: user._id }),
        });
        await loadSummary(user._id, { withInsights: true });
        setError("");
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to add expense");
      }
    },
    [user, loadSummary]
  );

  const handleAddYield = useCallback(
    async (data) => {
      if (!user) return;
      try {
        await fetchJSON("/api/yields", {
          method: "POST",
          body: JSON.stringify({ ...data, userId: user._id }),
        });
        await loadSummary(user._id, { withInsights: true });
        setError("");
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to add yield");
      }
    },
    [user, loadSummary]
  );

  const handleGenerateReport = useCallback(async () => {
    if (!user) return;
    setReportLoading(true);
    try {
      const url = demoMode 
        ? `/api/reports?demo=true`
        : `/api/reports?userId=${user._id}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to generate report");
      }
      const blob = await response.blob();
      const contentType = response.headers.get("Content-Type") || "";
      const extension = contentType.includes("application/pdf") ? "pdf" : "zip";
      
      if (typeof window === "undefined" || typeof document === "undefined") {
        throw new Error("Browser environment required");
      }
      
      const urlObj = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = urlObj;
      link.download = `farm-report.${extension}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(urlObj);
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to download report");
    } finally {
      setReportLoading(false);
    }
  }, [user, demoMode]);

  const handleRefreshFarmData = useCallback(async () => {
    if (!user) return;
    await Promise.all([
      loadSummary(user._id, { withInsights: true }),
      loadWeather(user.pincode),
    ]);
  }, [user, loadSummary, loadWeather]);

  const disableForms = !user || summaryLoading || initializing || demoMode;

  const value = useMemo(
    () => ({
      demoMode,
      user,
      crops,
      expenses,
      yields,
      totals,
      cropSummaries,
      weather,
      forecast,
      insights,
      profileLoading,
      summaryLoading,
      insightsLoading,
      weatherLoading,
      error,
      setError,
      initializing,
      reportLoading,
      disableForms,
      loadInsights,
      loadSummary,
      loadWeather,
      handleSaveUser,
      handleAddCrop,
      handleAddExpense,
      handleAddYield,
      handleGenerateReport,
      handleRefreshFarmData,
      enableDemoMode,
      disableDemoMode,
    }),
    [
      demoMode,
      user,
      crops,
      expenses,
      yields,
      totals,
      cropSummaries,
      weather,
      forecast,
      insights,
      profileLoading,
      summaryLoading,
      insightsLoading,
      weatherLoading,
      error,
      initializing,
      reportLoading,
      disableForms,
      loadInsights,
      loadSummary,
      loadWeather,
      handleSaveUser,
      handleAddCrop,
      handleAddExpense,
      handleAddYield,
      handleGenerateReport,
      handleRefreshFarmData,
      enableDemoMode,
      disableDemoMode,
    ]
  );

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}


