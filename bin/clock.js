/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog("sleep");
  ns.disableLog("exec");
  ns.tail();

  const monthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const padZero = (num) => num < 10 ? '0' + num : num;

  while (true) {
    let date = getDateTime();
    let formattedDate = (`${date[6]} ${padZero(date[2])},${date[0]}`);
    let formattedTime = (`${padZero(date[3])}:${padZero(date[4])}:${padZero(date[5])} ${date[7]}`);
    ns.print(formattedDate + "  " + formattedTime);

    const oldSecond = date[5];
    while (oldSecond == date[5]) {
      date = getDateTime();
      await ns.sleep(10);
    }

    ns.write("var/time.txt", (formattedDate + "  " + formattedTime), "w")
    ns.exec("bin/scp.worm.js", "home", 1, "var/time.txt")
    ns.clearLog();
  }

  function getDateTime() {
    const timeMod = -1177360000;  //3758752234
    let timestamp = Date.now() + timeMod;
    let secondsSinceEnoch = timestamp / 1000;

    let years = secondsSinceEnoch / 60 / 60 / 24 / 365;
    let currentYear = Math.floor(years + 2020);
    let yearMod = years - Math.floor(years);

    let months = yearMod * 12;
    let currentMonth = Math.floor(months);
    let monthMod = months - Math.floor(months);

    let days = monthMod * 31;
    let currentDay = Math.floor(days);
    let dayMod = days - Math.floor(days);

    let hours = dayMod * 24;
    let currentHour = Math.floor(hours);
    let hourMod = hours - Math.floor(hours);

    let minutes = hourMod * 60;
    let currentMinute = Math.floor(minutes);
    let minuteMod = minutes - Math.floor(minutes);

    let seconds = minuteMod * 60;
    let currentSecond = Math.floor(seconds);

    let am_pm = currentHour <= 12 ? "AM" : "PM";
    let formattedHour = currentHour % 12 || 12;

    return [currentYear, currentMonth, currentDay, formattedHour, currentMinute, currentSecond, monthName[currentMonth], am_pm]
  }
}