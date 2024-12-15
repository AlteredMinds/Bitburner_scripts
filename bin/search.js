/** @param {NS} ns */
export async function main(ns, search = ns.args[0]) {
  const files = ns.ls(ns.getHostname());
  const regex = new RegExp(search, "i");
  for (var file of files)
    if (regex.test(file))
      ns.tprint(`\u001b[33m${file}`);
}