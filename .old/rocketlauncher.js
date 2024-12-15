/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog("sleep");
  const localHost = ns.getHostname();
  let traderfail = 0;
  let trackerfail = 0;
  const traderPID = 0;
  const trackerPID = 0;

  ns.tprint("Rocket Launcher and Watchdog Started..")

  startService("stockTrader.js");
  startService("stockTracker.js");

  while (true) {

    if (!ns.isRunning("stockTrader.js")) {
      if (traderfail < 5) {
        traderPID = startService("stockTrader.js");
        if (traderPID == 0) traderfail++;
        if (traderfail >= 5) ns.tprint(`\u001b[31mFailed to restart the Trader Script after 5 attempts. Terminating watchdog.`);
      }
    }
    else if (ns.isRunning("stockTrader.js") && traderfail >= 5) {
      traderfail = 0;
      ns.tprint(`\u001b[32mTracker Script service was restored manually. Resuming watchdog.`);
    }

    if (!ns.isRunning("stockTracker.js")) {
      if (trackerfail < 5) {
        trackerPID = startService("stockTracker.js");
        if (trackerPID == 0) trackerfail++;
        if (trackerfail >= 5) ns.tprint(`\u001b[31mFailed to restart the Trader Script after 5 attempts. Terminating watchdog.`);
      }
    }
    else if (ns.isRunning("stockTracker.js") && trackerfail >= 5) {
      trackerfail = 0;
      ns.tprint(`\u001b[32mTracker Script service was restored manually. Resuming watchdog.`);
    }
    await ns.sleep(5000);
  }

  function startService(service) {
    const serviceName = service == "stockTracker.js" | "stockTrader.js" ? "Tracker" : "Trader";
    const servicePID = ns.exec(service, localHost);
    if (servicePID != 0) ns.tprint(`\u001b[32m${serviceName} Script service was restored successfully.`);
    return servicePID;
  }
}