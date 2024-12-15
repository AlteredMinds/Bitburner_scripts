/** @param {NS} ns */
export async function main(ns, file = ns.args[0], sourceHost = ns.args[1], verbose = ns.args[1]) {
  let hosts = ns.scan();
  let localhost = ns.getHostname();
  let scriptName = ns.getScriptName();

  if (sourceHost == null) sourceHost = localhost;

  for (let host of hosts) {
    if (host != sourceHost && host != "darkweb") {
      await ns.scp(file, host, localhost);
      await ns.scp(scriptName, host, localhost);
      await ns.exec(scriptName, host, 1, file, localhost);
      if (verbose == true) ns.tprint(`Successfully copied ${file} to ${host}`);
    }
  }
}