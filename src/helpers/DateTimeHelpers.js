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

const getMaxHourS = (arrays) => {
    if (!arrays) return "11:59:00";
    const newTimeTo = arrays.map(item => item.To)
    let timeDiff = "";
    for (let time of newTimeTo) {
        if (!timeDiff) {
            timeDiff = time
        } else {
            var TotalNext = moment(time, "HH:mm:ss").diff(moment(timeDiff, "HH:mm:ss"), "seconds");
            var TotalMax = moment(time, "HH:mm:ss").diff(moment("12:00:00", "HH:mm:ss"), "seconds");
            if (TotalNext > 0 && TotalMax < 0) {
                timeDiff = time
            }
        }
    }
    return timeDiff;
}

const getMinHourC = (arrays) => {
    if (!arrays) return "12:00:00";
    const newTimeTo = arrays.map(item => item.From);
    return newTimeTo.find((time) => {
        const diff = moment(time, 'HH:mm').diff(moment("12:00:00", "HH:mm:ss"), 'minutes');
        return diff >= 0;
    })
}

export const getStyleSchool = (item, type, {
    HourMax,
    HourMin
}, HourScheduleList) => {
    let newHourMin = HourMin;
    let newHourMax = HourMax;
    let styles = {}
    if (item) {
        if (type === "S") {
            newHourMax = getMaxHourS(HourScheduleList);
        } else {
            newHourMin = getMinHourC(HourScheduleList)
        }
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
        styles.left = `${(TotalStart / TotalSeconds) * 100}%`;
    }
    if (item?.MajorID) {
        styles.borderBottom = "2px solid #f64e60"
    }
    return styles;
}