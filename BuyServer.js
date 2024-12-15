/** @param {NS} ns */
export async function main(ns) {
  const jsonData = ns.read("lib/colors.json");
  const colors = JSON.parse(jsonData)["colors"];
  const args = ns.flags([['name', ''], ['ram', 0], ['help', false]]);

  if (args.help) {
    ns.tprint(`
Usage: buyserver [Options]

TARGET SPECIFICATION:
  --name <server name>: Name of the server to create.
  --ram <ram amt>: Amount of ram to purchase for the server.
  --help Print this help summary page.

EXAMPLES:
  buyserver --name server-1
  buyserver --ram 1024
    `);
    ns.exit();
  }

  let serverName = args.name == "" ? await ns.prompt('Enter the name of the new server:', { type: "text" }) : args.name;
  let ram = args.ram == 0 ? await ns.prompt('Enter the RAM amount in GB:', { type: "text" }) : args.ram;
  const decommafiedRam = ram.toString().replace(/\,/g, "");
  ram = parseInt(decommafiedRam);

  if (ns.serverExists(serverName)) {
    ns.tprint(`${colors.yellow}Failed to create ${serverName}, server already exists!`);
    ns.exit();
  }
  else if (serverName == '') {
    ns.tprint(`${colors.yellow}Server name was not specified!`);
    ns.exit();
  }
  else if (isNaN(ram)) {
    ns.tprint(`${colors.yellow}Ram amount was not specified!`);
    ns.exit();
  }
  else if (!isPowerOfTwo(ram)) {
    ns.tprint(`${colors.yellow}Failed to create ${serverName}, Invalid RAM amount!`);
    ns.exit();
  }
  const purchaseCost = ns.getPurchasedServerCost(ram);
  if (purchaseCost > ns.getPlayer().money) {
    ns.tprint(`${colors.yellow}Failed to create ${serverName}, Cannot afford $${ns.formatNumber(purchaseCost, 2)}!`);
    ns.exit();
  }

  ns.purchaseServer(serverName, ram);


  if (ns.serverExists(serverName))
    ns.tprint(`${serverName} (${ns.getServer(serverName).ip}) was created successfully.\nCost: $${ns.formatNumber(purchaseCost)}`);
  else
    ns.tprint(`${colors.yellow}Failed to create ${serverName}`);

  function isPowerOfTwo(n) {
    if (n <= 0) {
      return false;
    }
    return (n & (n - 1)) === 0;
  }
}

