/** @param {NS} ns */
export async function main(ns, file = ns.args[0], sourceHost = ns.args[1]) {
  let hosts = ns.scan();
  let localhost = ns.getHostname();
  let scriptName = ns.getScriptName();

  if (file == null) {
    ns.tprint(`Usage: destroy [file name]\n\n`);
    ns.exit();
  }

  if (sourceHost == null) sourceHost = localhost;

  if (sourceHost == localhost) {
    const result = await ns.prompt(`Confirm\n Do you want to remove ${file}`, { type: "boolean" });
    if (!result) {
      ns.exit();
    }
  }

  if (localhost != "home") {
    var result = ns.rm(file);
    if (result)
      ns.tprint(`Removed ${file} from ${localhost} - ${result}`);
    else
      ns.tprint(`\u001b[33m${file} does not exist on ${localhost}`);
  }

  for (let host of hosts) {
    if (host != sourceHost) {
      ns.scp(scriptName, host, localhost);
      ns.exec(scriptName, host, 1, file, localhost);
    }
  }
}