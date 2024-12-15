/** @param {NS} ns */
export async function main(ns) {
  const jsonData = ns.read("lib/colors.json");
  const colors = JSON.parse(jsonData)["colors"];

  const symbols = ns.stock.getSymbols();
  ns.tail();

  const symServer = {
    "WDS": "watchdog-sec",
    "ECP": "ecorp",
    "MGCP": "megacorp",
    "BLD": "blade",
    "CLRK": "clarkinc",
    "OMTK": "omnitek",
    "FSIG": "4sigma",
    "KGI": "kuai-gong",
    "DCOMM": "defcomm",
    "VITA": "vitalife",
    "ICRS": "icarus",
    "UNV": "univ-energy",
    "AERO": "aerocorp",
    "SLRS": "solaris",
    "GPH": "global-pharm",
    "NVMD": "nova-med",
    "LXO": "lexo-corp",
    "RHOC": "rho-construction",
    "APHE": "alpha-ent",
    "SYSC": "syscore",
    "CTK": "comptek",
    "NTLK": "netlink",
    "OMGA": "omega-net",
    "JGN": "joesguns",
    "SGC": "sigma-cosmetics",
    "CTYS": "catalyst",
    "MDYN": "microdyne",
    "TITN": "titan-labs",
    "FLCM": "fulcrumtech",
    "STM": "stormtech",
    "HLS": "helios",
    "OMN": "omnia",
    "FNS": "foodnstuff"
  }

  function getTime() {
    return ns.read("var/time.txt");
  }

  while (true) {
    const playerCash = ns.getPlayer().money;
    //const day = Math.floor(ns.getPlayer().totalPlaytime / 3600 / 24);
    let totalAssetValue = 0;
    let totalGains = 0;
    let ownedNum = 0;

    ns.print(`${colors.yellow}           Positions`);

    for (const symbol of symbols) {
      const [shares, avgPrice] = ns.stock.getPosition(symbol);
      if (shares > 0) {
        const stockPrice = ns.stock.getPrice(symbol);
        const forecast = ns.stock.getForecast(symbol);
        const invested = shares * avgPrice;
        const value = shares * stockPrice;
        const gains = ((stockPrice - avgPrice) * shares) - 100000;
        const percentChange = ns.formatPercent((value - invested) / invested, 1);
        const resolvedSym = symServer[symbol];

        totalAssetValue += value;
        totalGains += gains;
        ownedNum++;

        ns.print(" ------------------------------");
        ns.print(`${colors.cyan}    Symbol: ${colors.white}${symbol} (${resolvedSym})`);

        const forecastColor = forecast < 0.5 ? colors.red : colors.green;
        ns.print(`${colors.cyan}  Forecast: ${forecastColor}${ns.formatPercent(forecast)} ${forecast < 0.5 ? '📉' : '📈'}${colors.reset}`);

        ns.print(`${colors.cyan} Principal: ${colors.white}$` + ns.formatNumber(invested, 2));
        ns.print(`${colors.cyan}     Value: ${colors.white}$` + ns.formatNumber(value, 2));

        const gainsColor = gains < 0 ? colors.red : colors.green;
        ns.print(`${colors.cyan}     Gains: ${gainsColor}$${ns.formatNumber(gains, 1)} ${colors.white}| ${gainsColor}${percentChange} ${gains < 0 ? ' 🤬' : ' 🚀'}${colors.reset}`);
      }
    }

    ns.print("\n================================");
    ns.print(`${colors.cyan} Asset Value: ${colors.white}$${ns.formatNumber(totalAssetValue, 2)}`);
    ns.print(`${colors.cyan}   Net Gains: ${colors.white}$${ns.formatNumber(totalGains, 2)}`);
    ns.print(`${colors.cyan}  Net Wealth: ${colors.white}$${ns.formatNumber(totalAssetValue + playerCash, 2)}`);
    ns.print(`\n ${getTime()}\n`);
    ns.print("================================");

    scaleUI(ownedNum);
    await ns.stock.nextUpdate();
  }

  function scaleUI(stocksOwned) {
    let height = 252 + (146 * stocksOwned);
    let width = 320;
    ns.resizeTail(width, height > 1085 ? 1085 : height);
  }
}