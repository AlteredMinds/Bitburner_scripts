/** @param {NS} ns */
export async function main(ns, service = ns.args[0]) {
  const localhost = ns.getHostname();
  ns.scriptKill(service, localhost);
  ns.exec(service, localhost);
}