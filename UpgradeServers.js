/** @param {NS} ns */
export async function main(ns) {
  for (var i = 1; i < ns.getPurchasedServerLimit(); i++) {
    let serverName = `server-${i}`;
    if (ns.serverExists(serverName)) {
      var result = ns.upgradePurchasedServer(serverName, ns.args[0]);
      ns.tprint(serverName + " " + result)
    }
  }
}