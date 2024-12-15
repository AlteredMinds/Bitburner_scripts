/** @param {NS} ns */
export async function main(ns) {
  let files = [];
  let maxLength = 0;
  for (var i = 0; i < ns.args.length; i++) files.push(ns.args[i]);

  for (var i = 0; i < ns.getPurchasedServerLimit(); i++) {
    let serverName = `server-${i}`;
    if (ns.serverExists(serverName)) {
      for (var file of files) {
        let maxLength = Math.max(...files.map(file => file.length));
        var result = ns.scp(file, serverName);
        ns.tprint(`${result ? "Successfully copied" : "Failed to copy"} ${file.padEnd(maxLength)} to   ${serverName}`);
      }
      ns.tprint(`------------------------------------------------------------------`);
    }
  }
}