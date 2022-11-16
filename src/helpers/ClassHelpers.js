export const ClassSchoolGenerator = (item) => {
    // if (item.TeachingRejectIDs || item.TeachingStatus === "TU_CHOI") {
    //     return "bg-danger h-20px";
    // }
    if ((item.UserID > 0 || item.TeacherID) && item.TeachingStatus !== "HOAN_THANH") {
        return "bg-warning h-20px";
    }
    if (item.TeachingStatus === "HOAN_THANH") {
        return "bg-success h-20px";
    }
    return "bg-primary h-38px";
}

export const ClassTeacherGenerator = (item, Teacher) => {
    if ((item.UserID > 0 || item.TeacherID) && item.TeacherID === Teacher.TeacherID) {
        return `bg-warning ${item.TeachingStatus === "HOAN_THANH" ? "bg-stripes" : ""}`;
    } else {
        return `bg-primary ${item.TeachingStatus === "HOAN_THANH" ? "bg-stripes" : ""}`;
    }
}

export const getNameLast = (name) => {
    if (!name) return 'Chưa có tên';
    const nameSplit = name.split(' ');
    if (nameSplit.length > 1) {
        const nameCharAt = nameSplit.map((o, index) => {
            if (index === nameSplit.length - 1 || index === nameSplit.length - 2) {
                return o
            }
            //return o.charAt()
            return ''
        })
        return nameCharAt.join(' ')
    }
    return name;
}