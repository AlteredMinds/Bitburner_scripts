/** @param {NS} ns */
export async function main(ns) {
  const allHosts = hostScan();
  const opt = ns.flags([['l', Infinity], ['p', 5], ['help', false], ['v', false]]);
  
  if (opt.help) {
    ns.tprint(`
Usage: nmap [Options]

TARGET SPECIFICATION:
  -l <hack level>: Maximum hacking level required to hack target.
  -p <num ports>: Maximum number of required open ports to hack target.
  -v show a verbose output.
  --help Print this help summary page.

EXAMPLES:
  nmap -v -l 100 
  nmap -p 4
    `);
    ns.exit();
  }

  class HostStat {
    constructor(name = "", nexthop = "", openports = '', nuked = '', backdoor = false, hacklevel = 0, maxmoney = 0) {
      this.name = name;
      this.nexthop = nexthop;
      this.openports = openports;
      this.nuked = nuked;
      this.backdoor = backdoor;
      this.hacklevel = hacklevel;
      this.maxmoney = maxmoney;
    }
  }

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

  function getStats(hosts) {
    let statsArray = [];

    for (var host of hosts) {
      let server = ns.getServer(host);
      let maxMoney = ns.getServerMaxMoney(host);
      let hacklevel = ns.getServerRequiredHackingLevel(host);
      let hopScan = ns.scan(host);
      let hostObj = new HostStat(
        host,
        hopScan,
        server.numOpenPortsRequired,
        server.hasAdminRights,
        server.backdoorInstalled,
        hacklevel,
        maxMoney
      );

      statsArray.push(hostObj);
    }
    return statsArray;
  }

  let hostStats = getStats(hostScan()).sort((a, b) => a.maxmoney - b.maxmoney);

  for (var host of hostStats) {
    if (host.hacklevel <= opt.l && host.openports <= opt.p) {
      ns.tprint(`Name: ${host.name}`);
      if(opt.v) ns.tprint(`Next Hops: (${host.nexthop})`);
      if(opt.v) ns.tprint(`Req Ports: ${host.openports}`);
      if(opt.v) ns.tprint(`Root Access: ${host.nuked}`);
      if(opt.v) ns.tprint(`Backdoor: ${host.backdoor}`);
      ns.tprint(`Hack Level: ${host.hacklevel}`);
      ns.tprint(`Max Money: $${ns.formatNumber(host.maxmoney)}\n\n`);
    }
  }
}