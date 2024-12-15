/** @param {NS} ns */
export async function main(ns) {
  const jsonData = ns.read("lib/colors.json");
  const colors = JSON.parse(jsonData)["colors"];
  const tickers = ns.stock.getSymbols();
  ns.tail();
  ns.resizeTail(500, 950);

  async function main() {
    let jsonData = ns.read("var/stock_history.json");
    const initialData = jsonData ? JSON.parse(jsonData) : {};

    let currentPercentages = [];

    ns.print(`\n\n SYML    PRICE SPREAD          CURRENT     STRENGTH`);
    ns.print(` -----   -------------------   ---------   --------`);
    for (var ticker of tickers) {
      let stockPrice = ns.stock.getPrice(ticker);
      let lowPrice = initialData[ticker]?.lowPrice || Infinity;
      let highPrice = initialData[ticker]?.highPrice || -Infinity;

      if (stockPrice > highPrice) highPrice = stockPrice;
      if (stockPrice < lowPrice) lowPrice = stockPrice;

      initialData[ticker] = {
        highPrice: highPrice,
        lowPrice: lowPrice,
      };

      //Display Stats
      const priceRange = highPrice - lowPrice;
      let currentPricePercentage = (((stockPrice - lowPrice) / priceRange) * 100).toFixed(2);

      const spreadString = `${colors.white}$${ns.formatNumber(lowPrice, 2)}${colors.reset} - ${colors.white}$${ns.formatNumber(highPrice, 2)}${colors.reset}`;
      const priceString = `$${ns.formatNumber(stockPrice, 2)}`;
      const ratingColor = getRatingColor(currentPricePercentage);
      currentPercentages.push(parseInt(currentPricePercentage));

      ns.print(` ${ticker.padEnd(5)}${colors.reset} | ${spreadString.padEnd(37)} | ${priceString.padEnd(8)}  | ${ratingColor}${currentPricePercentage}%`);
    }

    //Market Cap
    const marketCap = calculateMarketCap();
    let lowPrice = initialData["MarketCap"]?.lowPrice || Infinity;
    let highPrice = initialData["MarketCap"]?.highPrice || -Infinity;

    if (marketCap > highPrice) highPrice = marketCap;
    if (marketCap < lowPrice) lowPrice = marketCap;
    initialData["MarketCap"] = {
      highPrice: highPrice,
      lowPrice: lowPrice,
    };

    //Display Stats
    const priceRange = highPrice - lowPrice;
    let currentCapPercentage = (((marketCap - lowPrice) / priceRange) * 100).toFixed(2);

    const spreadString = `${colors.white}$${ns.formatNumber(lowPrice, 2)}${colors.reset} - ${colors.white}$${ns.formatNumber(highPrice, 2)}${colors.reset}`;
    const priceString = `$${ns.formatNumber(marketCap, 2)}`;
    const ratingColor = getRatingColor(currentCapPercentage);

    const marketStrength = calculateMarketStrength(currentPercentages, marketCap, parseInt(currentCapPercentage));

    ns.print(` TOTAL${colors.reset} | ${spreadString.padEnd(37)} | ${priceString.padEnd(8)}  | ${ratingColor}${currentCapPercentage}%`);
    ns.print(` ------------------------------------------------\n`);
    ns.print(`                         ${colors.white}Market Strength:  ${getRatingColor(marketStrength)}${marketStrength.toFixed(2)}%\n`);

    ns.write("var/stock_history.json", JSON.stringify(initialData, null, 2), "w");
  }

  function getRatingColor(percentage) {

    percentage = Math.max(0, Math.min(percentage, 100));
    const b = 0;
    let r, g;

    if (percentage <= 50) {
      r = 255;
      g = Math.round((percentage / 50) * 255);
    }
    else {
      r = Math.round(((100 - percentage) / 50) * 255);
      g = 255;
    }
    return `\u001b[38;2;${r};${g};${b}m`;
  }

  function calculateMarketStrength(percentagesList, marketCap, capPercentage) {
    let totalWeightedStrength = 0;

    tickers.forEach((ticker, index) => {
      const stockMarketCap = ns.stock.getMaxShares(ticker) * ns.stock.getPrice(ticker);
      const stockPercentage = percentagesList[index];
      const weight = (stockMarketCap / marketCap);

      totalWeightedStrength += stockPercentage * weight;
    });

    return ((totalWeightedStrength * 1.4) + (capPercentage * 0.6)) / 2;
  }

  function calculateMarketCap() {
    let total = 0;
    for (var ticker of tickers) {
      const maxShares = ns.stock.getMaxShares(ticker);
      const shareCost = ns.stock.getPrice(ticker);
      total += (maxShares * shareCost);
    }
    return total;
  }

  while (true) {
    await ns.stock.nextUpdate();
    main();
  }
}