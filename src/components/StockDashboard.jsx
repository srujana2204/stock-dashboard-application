import { useEffect, useMemo, useState } from "react";

const SUPPORTED_STOCKS = ["GOOG", "TSLA", "AMZN", "META", "NVDA"];

function createInitialPrices() {
  return {
    GOOG: 150,
    TSLA: 250,
    AMZN: 180,
    META: 500,
    NVDA: 120,
  };
}

// Random-walk price update
function tickPrice(oldPrice) {
  const maxMovePercent = 0.02; // ±2% per second
  const randomFactor = (Math.random() * 2 - 1) * maxMovePercent;
  const newPrice = Math.max(1, oldPrice * (1 + randomFactor));
  const change = newPrice - oldPrice;
  const changePercent = (change / oldPrice) * 100;
  return {
    price: parseFloat(newPrice.toFixed(2)),
    change: parseFloat(change.toFixed(2)),
    changePercent: parseFloat(changePercent.toFixed(2)),
  };
}

export default function StockDashboard({ currentUser }) {
  const storageKey = useMemo(
    () => `subscriptions_${currentUser}`,
    [currentUser]
  );

  const [subscriptions, setSubscriptions] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed)
        ? parsed.filter((s) => SUPPORTED_STOCKS.includes(s))
        : [];
    } catch {
      return [];
    }
  });

  const [stocks, setStocks] = useState(() => {
    const base = createInitialPrices();
    const obj = {};
    SUPPORTED_STOCKS.forEach((s) => {
      const p = base[s];
      obj[s] = { price: p, change: 0, changePercent: 0 };
    });
    return obj;
  });

  // history[symbol] = [price1, price2, ...]
  const [history, setHistory] = useState(() => {
    const h = {};
    SUPPORTED_STOCKS.forEach((s) => {
      h[s] = [];
    });
    return h;
  });

  const [selectedSymbol, setSelectedSymbol] = useState(null);

  // Persist subscriptions per user
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(subscriptions));
  }, [subscriptions, storageKey]);

  // Live price updates + history
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks((prevStocks) => {
        const nextStocks = { ...prevStocks };
        setHistory((prevHistory) => {
          const nextHistory = { ...prevHistory };
          SUPPORTED_STOCKS.forEach((symbol) => {
            const result = tickPrice(prevStocks[symbol].price);
            nextStocks[symbol] = result;

            const prevArr = nextHistory[symbol] || [];
            nextHistory[symbol] = [...prevArr, result.price].slice(-60);
          });
          return nextHistory;
        });
        return nextStocks;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // const handleSubscribe = (symbol) => {
  //   setSubscriptions((prev) =>
  //     prev.includes(symbol) ? prev : [...prev, symbol]
  //   );
  // };

  // const handleUnsubscribe = (symbol) => {
  //   setSubscriptions((prev) => prev.filter((s) => s !== symbol));
  //   setSelectedSymbol((cur) => (cur === symbol ? null : cur));
  // };
  const handleToggleSubscription = (symbol) => {
  setSubscriptions((prev) => {
    if (prev.includes(symbol)) {
      // unsubscribe
      return prev.filter((s) => s !== symbol);
    }
    // subscribe
    return [...prev, symbol];
  });

  // if you were viewing this symbol in the chart and unsubscribe it,
  // optionally clear the selection:
  setSelectedSymbol((cur) => (cur === symbol ? null : cur));
};


  const trendData =
    selectedSymbol && history[selectedSymbol]
      ? history[selectedSymbol]
      : [];

  return (
    <>
      {/* LEFT PANEL – SUPPORTED STOCKS */}
      <section className="panel">
        <h2 className="panel-title">Supported stocks</h2>
        <div className="stock-buttons">
          {SUPPORTED_STOCKS.map((symbol) => {
            const subscribed = subscriptions.includes(symbol);
            return (
              <div className="stock-row" key={symbol}>
                <div className="stock-row-left">
                  {/* <div
                    className={
                      "stock-checkbox " + (subscribed ? "checked" : "")
                    }
                  >
                    {subscribed ? "✓" : ""}
                  </div> */}
                  <span className="stock-chip">{symbol}</span>
                </div>
                {/* <button
                  className={
                    "stock-btn " +
                    (subscribed ? "subscribed" : "not-subscribed")
                  }
                  disabled={subscribed}
                  onClick={() => handleSubscribe(symbol)}
                >
                  {subscribed ? "Subscribed" : "Subscribe"}
                </button> */}
                <button
  className={
    "stock-btn " + (subscribed ? "subscribed" : "not-subscribed")
  }
  onClick={() => handleToggleSubscription(symbol)}
>
  {subscribed ? "Subscribed" : "Subscribe"}
</button>

              </div>
            );
          })}
        </div>
      </section>

      {/* RIGHT PANEL – SUBSCRIBED PRICES TABLE */}
      <section className="panel">
        <h2 className="panel-title">Subscribed prices</h2>

        <div className="subscribed-header-row">
          <div className="subscribed-header-cell">Symbol</div>
          <div className="subscribed-header-cell">Last price</div>
        </div>

        <div className="subscribed-list">
          {subscriptions.length === 0 && (
            <div className="subscribed-row">
              <span>No subscriptions</span>
              <span className="subscribed-price-pill">
                Subscribe on the left →
              </span>
            </div>
          )}

          {subscriptions.map((symbol) => {
            const data = stocks[symbol];
            return (
              <div
                key={symbol}
                className={
                  "subscribed-row" +
                  (selectedSymbol === symbol ? " subscribed-row--active" : "")
                }
                onClick={() => setSelectedSymbol(symbol)}
                style={{ cursor: "pointer" }}
              >
                <span>{symbol}</span>
                <span className="subscribed-price-pill">
                  ${data.price.toFixed(2)}
                </span>
              </div>
            );
          })}
        </div>

        {/* optional: small inline unsubscribe icon in table (if you want) */}
        {/* you can add a tiny "×" button per row that calls handleUnsubscribe(symbol) */}
      </section>

      {/* TREND PANEL – LINE CHART */}
      <section className="panel trend-panel-outer">
        <h2 className="panel-title">
          {selectedSymbol
            ? `${selectedSymbol} – intraday trend`
            : "Price trend"}
        </h2>
        <p className="trend-subtitle">
          Click a stock in the **Subscribed prices** table above to view its live intraday trend.
        </p>
        <TrendChart data={trendData} />
      </section>
    </>
  );
}


function TrendChart({ data }) {
  const width = 700;
  const height = 220;
  const paddingLeft = 44;  // extra space for y labels
  const paddingRight = 20;
  const paddingTop = 16;
  const paddingBottom = 30;

  if (!data || data.length < 2) {
    return (
      <div className="trend-empty">
        Subscribe to a stock and click it in the table above to see its trend.
      </div>
    );
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX =
    (width - paddingLeft - paddingRight) / (data.length - 1);

  const points = data.map((value, index) => {
    const x = paddingLeft + stepX * index;
    const y =
      height -
      paddingBottom -
      ((value - min) / range) * (height - paddingTop - paddingBottom);
    return { x, y };
  });

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  return (
    <svg
      className="trend-chart"
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
    >
      {/* X axis line */}
      <line
        x1={paddingLeft}
        y1={height - paddingBottom}
        x2={width - paddingRight}
        y2={height - paddingBottom}
        className="trend-axis-line"
      />

      {/* Y axis line */}
      <line
        x1={paddingLeft}
        y1={paddingTop}
        x2={paddingLeft}
        y2={height - paddingBottom}
        className="trend-axis-line"
      />

      {/* Y axis labels: min and max */}
      <text
        x={paddingLeft - 6}
        y={paddingTop + 4}
        textAnchor="end"
        className="trend-axis-label"
      >
        {max.toFixed(2)}
      </text>
      <text
        x={paddingLeft - 6}
        y={height - paddingBottom}
        dy="0.35em"
        textAnchor="end"
        className="trend-axis-label"
      >
        {min.toFixed(2)}
      </text>

      {/* X axis label */}
      <text
        x={(paddingLeft + (width - paddingRight)) / 2}
        y={height - 8}
        textAnchor="middle"
        className="trend-axis-label"
      >
        Time → (last 60 ticks)
      </text>

      {/* Line path */}
      <path
        d={pathD}
        className="trend-line"
        fill="none"
      />
    </svg>
  );
}
