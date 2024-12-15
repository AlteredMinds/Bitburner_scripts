/** @param {NS} ns */
export async function main(ns, target = ns.args[0]) {
  if (target == null) {
    ns.alert("ERROR: hostname undefined \nUSE: run hack.js hostname")
    ns.exit()
  }
  const moneyThresh = ns.getServerMaxMoney(target);
  const securityThresh = ns.getServerMinSecurityLevel(target);

  while (true) {
    let secLevel = ns.getServerSecurityLevel(target)
    let cashLevel = ns.getServerMoneyAvailable(target)

    if (secLevel > securityThresh * 1.25) {
      ns.print("----------- WEAKENING -----------");
      ns.print(ns.formatNumber(secLevel, 1) + ' / ' + ns.formatNumber((securityThresh * 1.25), 1));
      await ns.weaken(target);
    }
    else if (cashLevel < moneyThresh * 0.9) {
      ns.print("----------- GROWING -----------");
      ns.print("$" + ns.formatNumber(cashLevel) + ' / $' + ns.formatNumber(moneyThresh * 0.9));
      await ns.grow(target);
    }
    else {
      ns.print("----------- HACKING -----------");
      await ns.hack(target);
    }
  }
}