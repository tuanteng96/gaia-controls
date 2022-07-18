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
