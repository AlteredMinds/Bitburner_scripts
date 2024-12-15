/** @param {NS} ns */
export async function main(ns) {
  const jsonData = ns.read("lib/colors.json");
  const colors = JSON.parse(jsonData)["colors"];
  const symMap = {
    "WDS": "",
    "ECP": "ECorp",
    "MGCP": "MegaCorp",
    "BLD": "Blade Industries",
    "CLRK": "Clarke Inc",
    "OMTK": "OmniTek Inc",
    "FSIG": "Four Sigma",
    "KGI": "KuaiGong",
    "DCOMM": "DefComm",
    "VITA": "VitaLife",
    "ICRS": "Icarus Micro",
    "UNV": "Universal Energy",
    "AERO": "AeroCorp",
    "SLRS": "Solaris Space",
    "GPH": "Global Pharma",
    "NVMD": "Nova Medical",
    "LXO": "LexoCorp",
    "RHOC": "Rho Construction",
    "APHE": "Alpha Enterprises",
    "SYSC": "SysCore Securities",
    "CTK": "CompuTek",
    "NTLK": "NetLink Tech",
    "OMGA": "Omega Software",
    "JGN": "Joe's Guns",
    "SGC": "Sigma Cosmetics",
    "CTYS": "Catalyst Ventures",
    "MDYN": "Microdyne Tech",
    "TITN": "Titan Labs",
    "FLCM": "Fulcrum Tech",
    "STM": "Storm Tech",
    "HLS": "Helios Labs",
    "OMN": "Omnia Cybersystems",
    "FNS": "FoodNStuff"
  }

  let input = ns.args[0].toUpperCase();
  const resolvedSym = symMap[input];

  if (resolvedSym != undefined)
    ns.tprint(`${colors.yellow}Non-authoritative answer: ${resolvedSym}`);
  else ns.tprint(`${colors.red}No matching symbol found for input: ${resolvedSym}`);
}
