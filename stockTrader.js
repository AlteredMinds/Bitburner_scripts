/** @param {NS} ns */
export async function main(ns) {
  const tickers = ns.stock.getSymbols();
  const blackListed = [];
  const bearCount = new Map();
  const minPurchaseAmt = 50_000_000;
  const cashReserve = 1_000_000_000;
  let last_topTicker = "";
  let top_Ticker = "";

  while (true) {
    top_Ticker = getTopTicker();
    if (top_Ticker != last_topTicker) ns.print(`Top Ticker: ${top_Ticker} (forecast: ${ns.formatPercent(ns.stock.getForecast(top_Ticker), 1)})`);
    
    for (const ticker of tickers) {
      const [myShares, avgPrice] = ns.stock.getPosition(ticker);
      const stockPrice = ns.stock.getPrice(ticker);
      const playerMoney = ns.getPlayer().money - cashReserve;
      const forecast = ns.stock.getForecast(ticker);
      const maxShares = ns.stock.getMaxShares(ticker) * 0.6;
      let cost = maxShares * stockPrice;
      let purchaseAmount = maxShares - myShares;
      const currentValue = myShares * stockPrice;
      const profit = currentValue - (myShares * avgPrice);

      if (myShares !== maxShares) {
        if (blackListed.includes(ticker)) continue;

        if (cost > playerMoney) purchaseAmount = Math.floor((playerMoney / stockPrice) * 0.9);

        cost = purchaseAmount * stockPrice;
        if (forecast >= 0.58 && cost >= minPurchaseAmt && ticker == getTopTicker()) {
          buyStock(ticker, purchaseAmount, cost);
        }
      }

      if (forecast < 0.50 && myShares > 0) {
        if (blackListed.includes(ticker)) continue;

        const currentBearCount = bearCount.get(ticker) || 0;
        bearCount.set(ticker, currentBearCount + 1);
        if (currentBearCount >= 3) {
          sellStock(ticker, myShares, currentValue, profit);
          bearCount.delete(ticker);
        }
      }
    }
    last_topTicker = top_Ticker;
    await ns.stock.nextUpdate();
  }

  function getTime() {
    return ns.read("var/time.txt");
  }

  function buyStock(ticker, purchaseAmount, cost) {
    ns.stock.buyStock(ticker, purchaseAmount);
    logTransaction("Bought", ticker, purchaseAmount, cost);
  }

  function sellStock(ticker, shares, currentValue, profit) {
    ns.stock.sellStock(ticker, shares);
    logTransaction("Sold", ticker, shares, currentValue);
    logProfit(profit);
  }

  function logTransaction(action, ticker, amount, value) {
    const time = getTime();
    ns.write("var/tradelog.txt", `${action} ${amount} shares of ${ticker} for $${ns.formatNumber(value)} (${time})\n`, "a");
  }

  function logProfit(profit) {
    ns.write("var/tradelog.txt", `Profit: $${ns.formatNumber(profit)}\n\n`, "a");
  }

  function getTopTicker() {
    let bestTicker = "";
    let bestScore = -Infinity;

    for (const ticker of tickers) {
      const forecast = ns.stock.getForecast(ticker);
      const [shares] = ns.stock.getPosition(ticker);
      const positionVal = shares * ns.stock.getPrice(ticker);
      const maxShares = ns.stock.getMaxShares(ticker) / 2;

      if (shares >= maxShares) continue;

      const weightFactor = 1e14;
      let score = forecast - (Math.sqrt(positionVal / weightFactor));

      if (score > bestScore) {
        bestScore = score;
        bestTicker = ticker;
      }
    }
    return bestTicker;
  }
}