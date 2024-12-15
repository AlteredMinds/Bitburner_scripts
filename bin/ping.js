/** @param {NS} ns */
export async function main(ns, dest = ns.args[0]) {
  const success = ns.serverExists(dest)

  if (success) {
    const ipaddr = ns.getServer(dest).ip;
    const latancy = parseFloat(ns.formatNumber(1000 * Math.random() / 100, 1));
    ns.tprint(`PING ${dest} (${ipaddr}) 56(84) bytes of data.`);

    for (var i = 0; i < 4; i++) {
      let coinFlip = Math.random();
      let pingLatancy = coinFlip < 0.2 ? latancy - 0.1 : coinFlip > 0.8 ? latancy + 0.1 : latancy;
      ns.tprint(`64 bytes from ${dest} (${ipaddr}): icmp_seq=3 ttl=57 time=${ns.formatNumber(pingLatancy, 1)} ms`);
      await ns.sleep(800);
    }
    ns.tprint(`\n\nPing statistics for ${ipaddr}:\nPackets: Sent = 4, Received = 4, Lost = 0 (0% loss),\nApproximate round trip times in milli-seconds:\nMinimum = ${ns.formatNumber(latancy - 0.1, 1)}ms, Maximum = ${ns.formatNumber(latancy + 0.1, 1)}ms, Average = ${latancy}ms`);
  }
  else {
    ns.tprint(`Ping request could not find host ${dest}. Please check the name and try again.`);
  }
}