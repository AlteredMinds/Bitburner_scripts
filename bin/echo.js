/** @param {NS} ns */
export async function main(ns) {
  let string = new String;
  for (var i = 0; i < ns.args.length; i++) {
    string += ns.args[i] + " ";
  }
  ns.tprint(string);
}