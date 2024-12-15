/** @param {NS} ns */
export async function main(ns, target = ns.args[0], percent = ns.args[1]) {
  const localHost = ns.getHostname();
  const instanceNum = 4;

  while (true) {
    const longestTime = Math.max(ns.getGrowTime(target), ns.getHackTime(target), ns.getWeakenTime(target));
    const ramAvailiable = ns.getServerMaxRam(localHost) - ns.getServerUsedRam(localHost);

    if (ramAvailiable > 10) {
      ns.exec("Scripts/do_weaken.js", localHost, getThreadCount("weaken"), target);
      ns.exec("Scripts/do_grow.js", localHost, getThreadCount("grow"), target);
      ns.exec("Scripts/do_hack.js", localHost, getThreadCount("hack"), target);
    }

    await ns.sleep(longestTime / instanceNum);
  }

  function getThreadCount(service) {
    const ram = Math.floor(ns.getServerMaxRam(localHost) * (percent / 100));
    const maxThreads = service == "hack" ? ram / 1.70 : ram / 1.75;
    const threadsPerInstance = maxThreads / instanceNum;
    let threads = threadsPerInstance / 13;
    if (service === "hack") threads = Math.floor(threads);
    if (service === "grow") threads = Math.floor(threads * 2);
    if (service === "weaken") threads = Math.floor(threads * 10);
    return threads;
  }
}