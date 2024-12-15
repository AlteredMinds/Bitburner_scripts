/** @param {NS} ns */
export async function main(ns) {
  const opt = ns.flags([['help', false]]);

  if (opt.help || ns.args[0] == null) {
    ns.tprint(`
Usage: hackhost [target]
Attempt to hack a server automatically if the required open ports can be satisfied.

EXAMPLE:
  hackhost n00dles
    `);
    ns.exit();
  }

  const host = ns.args[0];
  let open_ports = 0;

  if (ns.fileExists("BruteSSH.exe", "home")) {
    ns.brutessh(host);
    open_ports++;
  }
  if (ns.fileExists("FTPCrack.exe", "home")) {
    ns.ftpcrack(host,);
    open_ports++;
  }
  if (ns.fileExists("relaySMTP.exe", "home")) {
    ns.relaysmtp(host);
    open_ports++;
  }
  if (ns.fileExists("HTTPWorm.exe", "home")) {
    ns.httpworm(host);
    open_ports++;
  }
  if (ns.fileExists("SQLInject.exe", "home")) {
    ns.sqlinject(host);
    open_ports++;
  }

  if (ns.getServerNumPortsRequired(host) <= open_ports) {
    ns.nuke(host);
    ns.tprint(`Hacked ${host} Successfully`);
  }
}