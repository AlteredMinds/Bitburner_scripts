/** @param {NS} ns */
export async function main(ns) {
const symbols = ns.stock.getSymbols();
let myCash = ns.getPlayer().money;
let myPositions = ns.stock.getOrders();
ns.tprint(symbols);
ns.tprint(myCash);
ns.tprint(myPositions);
}