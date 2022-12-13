const Util = {
  TIME_MAP: {
    seconds: 60,
    minutes: 60,
    hours: 24,
    days: 7,
    months: 30,
    years: 12,
  },
  getTimeFromNow(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    let time = parseInt((now.getTime() - date.getTime()) / 1000);
    for (let [unit, value] of Object.entries(this.TIME_MAP)) {
      const temp = parseInt(time / value);
      if (temp === 0) {
        if (time === 1) {
          unit = unit.substring(0, unit.length - 1);
        }
        return {
          unit: unit,
          value: time,
        };
      } else {
        time = temp;
      }
    }
  },
};

export default Util;
