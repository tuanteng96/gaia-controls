import moment from "moment";
import "moment/locale/vi";
moment.locale("vi");

export const ArrayTimeSchool = () => {
    const newInitial = [];
    var initialTime = moment({ h: 7, m: 10, s: 0 }).format("YYYY/MM/DD HH:mm");
    var TimeStart,
        TimeEnd = null;
    var LessonMinute = 40;
    var BreakTime = 5;
    for (var i = 1; i <= 12; i++) {

        if (!TimeEnd) {
            TimeStart = moment(initialTime)
                .add({ minute: BreakTime })
                .format("YYYY/MM/DD HH:mm");
            TimeEnd = moment(TimeStart)
                .add({ minute: LessonMinute })
                .format("YYYY/MM/DD HH:mm");
        } else {
            if (i === 7) {
                TimeEnd = moment({ h: 13, m: 25, s: 0 }).format("YYYY/MM/DD HH:mm");
            }
            TimeStart = moment(TimeEnd)
                .add({ minute: BreakTime })
                .format("YYYY/MM/DD HH:mm");
            TimeEnd = moment(TimeStart)
                .add({ minute: LessonMinute })
                .format("YYYY/MM/DD HH:mm");
        }
        newInitial.push({
            Title: `Tiết ${i}`,
            From: moment(TimeStart).format("HH:mm:ss"),
            To: moment(TimeEnd).format("HH:mm:ss"),
        });

    }
    return newInitial;
}