import moment from "moment";
import "moment/locale/vi";
moment.locale("vi");

export const getCurrentDate = (date) => {
  const now = date ? moment(date) : moment();
  var From = now
    .clone()
    .weekday(0)
    .toDate();
  var To = now
    .clone()
    .weekday(6)
    .toDate();
  return {
    From,
    To,
  };
};

export const getStyleSchool = (item, type, {
  HourMax,
  HourMin
}) => {
  let newHourMin = HourMin;
  let newHourMax = HourMax;
  let styles = {}
  if (type === "S") {
    newHourMax = "11:59:00"
  } else {
    newHourMin = "12:00:00"
  }
  if (item) {
    const {
      From,
      To
    } = item;
    var TotalSeconds = moment(newHourMax, "HH:mm:ss").diff(
      moment(newHourMin, "HH:mm:ss"),
      "seconds"
    );
    const TotalTime = moment(moment(To).format("HH:mm:ss"), "HH:mm:ss").diff(moment(moment(From).format("HH:mm:ss"), "HH:mm:ss"), "seconds");
    const TotalStart = moment(moment(From).format("HH:mm:ss"), "HH:mm:ss").diff(moment(newHourMin, "HH:mm:ss"), "seconds");

    styles.width = `${(TotalTime / TotalSeconds) * 100}%`;
    styles.top = 0;
    styles.left = `${(TotalStart / TotalSeconds) * 100}%`;;
  }
  return styles;
}