/** @param {NS} ns */
export async function main(ns) {
  const allHosts = hostScan();

  function hostScan() {
    let foundHosts = [];
    let nextHops = ["home"];
    let buffer = [];

    while (nextHops != null && nextHops.length > 0) {

      for (var hop of nextHops) {
        let scannedHosts = ns.scan(hop);
        for (var host of scannedHosts) {
          if (!nextHops.includes(host) && !foundHosts.includes(host)) {
            buffer.push(host);
          }
        }
        foundHosts.push(hop);
      }
      nextHops = buffer;
      buffer = [];
    }
    return foundHosts;
  }

  function bruteForce(hosts) {

    for (var host of hosts) {
      var open_ports = 0;
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
  }
  bruteForce(hostScan());
}