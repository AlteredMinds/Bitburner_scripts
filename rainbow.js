/** @param {NS} ns */
export async function main(ns, char = ns.args[0], speed = ns.args[1], interval = ns.args[2]) {
  let r = 255;
  let g = 0;
  let b = 0;

  if (char == undefined) char = '=';
  if (speed == undefined) speed = 100;
  if (interval == undefined) interval = 5;

  const printColoredString = (r, g, b, char) => {
    const color = `\u001b[38;2;${r};${g};${b}m`;
    let string = char.repeat(100);
    ns.tprint(`${color}${string}`);
  };


  while (true) {
    while (r > 0 && g < 255) {
      r -= interval;
      g += interval;
      printColoredString(r, g, b, char);
      await ns.sleep(speed);
    }
    while (g > 0 && b < 255) {
      g -= interval;
      b += interval;
      printColoredString(r, g, b, char);
      await ns.sleep(speed);
    }
    while (b > 0 && r < 255) {
      b -= interval;
      r += interval;
      printColoredString(r, g, b, char);
      await ns.sleep(speed);
    }
  }
}