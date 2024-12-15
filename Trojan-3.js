/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog("getServerMaxRam");
  ns.disableLog("exec");
  const jsonData = ns.read("lib/colors.json");
  const colors = JSON.parse(jsonData)["colors"];
  const args = ns.flags([['d', ''], ['u', 0], ['help', false]]);

  if (args.help) {
    ns.tprint(`
Usage: trojan3.js [Options]

TARGET SPECIFICATION:
  -d <target name>: Name of the server you are targeting.
  -u <ram use>: Percentage of ram to use on the server.
  --help Print this help summary page.

EXAMPLES:
  trojan3.js -d n00dles
  trojan3.js -u 50
    `);
    exitScript();
  }

  let i = 1;
  let target = args.d == "" ? await ns.prompt('Enter the name of the target:', { type: "text" }) : args.d;
  let memoryPercentage = parseInt(args.u == 0 ? await ns.prompt('Enter the percentage of RAM to use:', { type: "text" }) : args.u);
  const localHost = ns.getHostname();
  const instanceCount = 2;

  validateTarget(target);
  validateMemoryPercentage(memoryPercentage);

  while (true) {
    let weakenTime = ns.getWeakenTime(target) / instanceCount;
    let growTime = ns.getGrowTime(target) / instanceCount;
    let hackTime = ns.getHackTime(target) / instanceCount;

    ns.print("----------- WEAKENING -----------");
    ns.exec("bin/exploits/do_weaken.js", localHost, getThreadCount("weaken"), target, i);

    await ns.sleep(weakenTime);

    ns.print("----------- GROWING -----------");
    ns.exec("bin/exploits/do_grow.js", localHost, getThreadCount("grow"), target, i);

    await ns.sleep(growTime);

    ns.print("----------- HACKING -----------");
    ns.exec("bin/exploits/do_hack.js", localHost, getThreadCount("hack"), target, i);

    await ns.sleep(hackTime + 100);
    i++;
  }

  function getThreadCount(service) {
    let threads = 0;
    const totalParts = 13;
    const ram = Math.floor(ns.getServerMaxRam(localHost) * (memoryPercentage / 100));
    let weakenPercentage = 100 / totalParts;
    const maxThreads = ram / weakenPercentage;

    if (service === "hack") threads = Math.floor(maxThreads * (1 / totalParts) * 6);
    else if (service === "grow") threads = Math.floor(maxThreads * (2 / totalParts) * 6);
    else if (service === "weaken") threads = Math.floor(maxThreads * (10 / totalParts) * 6);

    return Math.floor(threads / instanceCount < 1 ? 1 : threads);
  }

  function validateTarget(target) {
    if (!target) {
      logError('Target was not specified!');
      exitScript();
    }

    if (!ns.serverExists(target)) {
      logError(`Specified server '${target}' does not exist!`);
      exitScript();
    }
  }

  function validateMemoryPercentage(memoryPercentage) {
    if (isNaN(memoryPercentage)) {
      logError('Ram percentage was not specified!');
      exitScript();
    }

    if (memoryPercentage <= 0 || memoryPercentage > 100) {
      logError(`Invalid percentage: ${memoryPercentage}%`);
      exitScript();
    }
  }

  function logError(message) {
    ns.tprint(`${colors.yellow}${message}`);
  }

  function exitScript() {
    ns.exit();
  }
}