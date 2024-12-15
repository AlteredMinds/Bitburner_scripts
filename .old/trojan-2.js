/** @param {NS} ns */
export async function main(ns, target = ns.args[0], percent = ns.args[1]) {
  ns.disableLog("getServerMaxRam");
  ns.disableLog("getServerMoneyAvailable");
  ns.disableLog("getServerMinSecurityLevel");
  ns.disableLog("getServerMaxMoney");
  ns.disableLog("getServerSecurityLevel");
  if (target == null) {
    ns.alert("ERROR: hostname undefined \nUSE: run hack.js hostname");
    ns.exit();
  }

  const localHost = ns.getHostname();
  const moneyThresh = ns.getServerMaxMoney(target);
  const securityThresh = ns.getServerMinSecurityLevel(target);

  while (true) {
    let secLevel = ns.getServerSecurityLevel(target);
    let cashLevel = ns.getServerMoneyAvailable(target);
    let hackChance = ns.hackAnalyzeChance(target);
    let waitTime = 0;

    if (cashLevel < moneyThresh * 0.9) {
      ns.print("----------- GROWING -----------");
      waitTime = ns.getGrowTime(target);
      ns.exec("Scripts/do_grow.js", localHost, getThreadCount("grow"), target);
      ns.print(`$${ns.formatNumber(cashLevel)} / $${ns.formatNumber(moneyThresh * 0.9)}`);
    }
    else if (secLevel <= securityThresh * 1.1 || hackChance > 0.75) {
      ns.print("----------- HACKING -----------");
      waitTime = ns.getHackTime(target);
      ns.exec("Scripts/do_hack.js", localHost, getThreadCount("hack"), target);
      ns.print(`Chance: ${ns.formatPercent(hackChance, 0)}`)
    }
    else {
      ns.print("----------- WEAKENING -----------");
      waitTime = ns.getWeakenTime(target);
      ns.exec("Scripts/do_weaken.js", localHost, getThreadCount("weaken"), target);
      ns.print(`SecLevel: ${ns.formatNumber(secLevel, 1)} / ${ns.formatNumber((securityThresh * 1.1), 1)}`);
    }
    await ns.sleep(waitTime + 100);
  }

  function getThreadCount(service) {
    let threads = 0;
    const totalParts = 13;
    const ram = Math.floor(ns.getServerMaxRam(localHost) * (percent / 100));
    let weakenPercentage = 100 / totalParts;
    const maxThreads = ram / weakenPercentage;

    if (service === "hack") threads = Math.floor(maxThreads * (1 / totalParts) * 4.2);
    else if (service === "grow") threads = Math.floor(maxThreads * 4.2);
    else if (service === "weaken") threads = Math.floor(maxThreads * 4.2);

    return threads;
  }
}