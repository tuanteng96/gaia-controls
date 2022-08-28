import moment from "moment";
import "moment/locale/vi";
moment.locale("vi");

export const getArrayChildren = (arrays, type, { HourMax, HourMin }) => {
    let newHourMin = HourMin;
    let newHourMax = HourMax;
    if (type === "S") {
        newHourMax = "11:59:00";
    } else {
        newHourMin = "12:00:00";
    }
    const newSchedule = [];
    for (let schedulte of arrays) {
        if (schedulte.dayItems) {
            for (let item of schedulte.dayItems) {
                newSchedule.push({...item, IndexParent: schedulte.Index });
            }
        }
        if (!schedulte.dayItems && schedulte.CalendarItem) {
            newSchedule.push({
                ...schedulte.CalendarItem,
                IndexParent: schedulte.Index,
                TeacherTitle: schedulte.CalendarItem.UserTitle,
                TeacherID: schedulte.CalendarItem.UserID,
                isCalendarItem: true,
            });
        }
        
        if(!schedulte.dayItems && !schedulte.CalendarItem && schedulte) {
            newSchedule.push({...schedulte});
        }
    }
    return newSchedule.filter((item) => {
        let TimeFrom = moment(moment(item.From).format("HH:mm:ss"), "HH:mm:ss");
        let TimeTo = moment(moment(item.To).format("HH:mm:ss"), "HH:mm:ss");
        let TimeMin = moment(newHourMin, "HH:mm:ss");
        let TimeMx = moment(newHourMax, "HH:mm:ss");
        return TimeTo.isSameOrBefore(TimeMx) && TimeFrom.isSameOrAfter(TimeMin);
    });
};

export const getArrayChildrenAll = (arrays, { HourMax, HourMin }) => {
    let newHourMin = HourMin;
    let newHourMax = HourMax;
    const newSchedule = [];
    for (let schedulte of arrays) {
        if (schedulte.dayItems) {
            for (let item of schedulte.dayItems) {
                newSchedule.push({...item, IndexParent: schedulte.Index });
            }
        }
        if (!schedulte.dayItems && schedulte.CalendarItem) {
            newSchedule.push({
                ...schedulte.CalendarItem,
                IndexParent: schedulte.Index,
                TeacherTitle: schedulte.CalendarItem.UserTitle,
                TeacherID: schedulte.CalendarItem.UserID,
                isCalendarItem: true,
            });
        }
    }

    return newSchedule.filter((item) => {
        let TimeFrom = moment(moment(item.From).format("HH:mm:ss"), "HH:mm:ss");
        let TimeTo = moment(moment(item.To).format("HH:mm:ss"), "HH:mm:ss");
        let TimeMin = moment(newHourMin, "HH:mm:ss");
        let TimeMx = moment(newHourMax, "HH:mm:ss");
        return TimeTo.isSameOrBefore(TimeMx) && TimeFrom.isSameOrAfter(TimeMin);
    });
};

export const getMaxSession = (Dates, HourSchool) => {
    let Max = 0
    for (let date of Dates) {
        if (date?.IndexList?.length > 0 || date?.DayItems?.length > 0) {
            let MaxItem = 0
            if (getArrayChildren(date?.IndexList || date?.DayItems, "S", HourSchool).length > getArrayChildren(date?.IndexList || date?.DayItems, "C", HourSchool).length) {
                MaxItem = getArrayChildren(date?.IndexList || date?.DayItems, "S", HourSchool).length
            } else {
                MaxItem = getArrayChildren(date?.IndexList || date?.DayItems, "C", HourSchool).length
            }
            if (MaxItem > Max) Max = MaxItem;
        }
    }
    return Max;
}