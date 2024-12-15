/** @param {NS} ns */
export async function main(ns, levelGrowth = ns.args[0]) {
  if (levelGrowth == null) {
    ns.alert("ERROR: growth level undefined")
    ns.exit()
  }

  const numnodes = ns.hacknet.numNodes()
  for (let i = 0; i < numnodes; i++) {
    let nodeStats = ns.hacknet.getNodeStats(i)
    for (let level = nodeStats.level; level < levelGrowth; level++) {
      ns.hacknet.upgradeLevel(i, 1)
    }
  }
  ns.printf("Completed")
}