const Util = {
  getTimeFromNow(timestamp) {
    const timeUnitValues = [
      ["second", 60],
      ["minute", 60],
      ["hour", 24],
      ["day", 30],
      ["month", 30],
      ["year", 12],
    ];
    const date = new Date(timestamp);
    const now = new Date();
    let time = parseInt((now.getTime() - date.getTime()) / 1000);
    for (let i = 0; i < timeUnitValues.length; i++) {
      let unit = timeUnitValues[i][0];
      let value = timeUnitValues[i][1];
      if (time >= value) {
        time = parseInt(time / value);
      } else if (time === 1) {
        return `1 ${unit} ago`;
      } else {
        return `${time} ${unit}s ago`;
      }
      // const temp = parseInt(time / value);
      // if (temp === 0) {
      //   if (time > 1) {
      //     unit = unit + "s";
      //   }
      //   return time ? time + " " + unit + " ago" : "a moment ago";
      // } else if (
      //   i < timeUnitValues.length - 1 &&
      //   temp < timeUnitValues[i + 1][1]
      // ) {
      //   return time ? time + " " + unit + " ago" : "a moment ago";
      // } else {
      //   time = temp;
      // }
    }
  },
};

export default Util;
