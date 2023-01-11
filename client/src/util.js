const Util = {
  getTimeFromNow(timestamp) {
    const timeUnitValues = [
      ["second", 60],
      ["minute", 60],
      ["hours", 24],
      ["days", 7],
      ["months", 30],
      ["years", 12],
    ];
    const date = new Date(timestamp);
    const now = new Date();
    let time = parseInt((now.getTime() - date.getTime()) / 1000);
    for (let i = 0; i < timeUnitValues.length; i++) {
      let unit = timeUnitValues[i][0];
      const value = timeUnitValues[i][1];
      const temp = parseInt(time / value);
      if (temp === 0) {
        if (time > 1) {
          unit = unit + "s";
        }
        return time ? time + " " + unit + " ago" : "a moment ago";
      } else if (
        i < timeUnitValues.length - 1 &&
        temp < timeUnitValues[i + 1][1]
      ) {
        return time ? time + " " + unit + " ago" : "a moment ago";
      } else {
        time = temp;
      }
    }
  },
};

export default Util;
