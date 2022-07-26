export const ClassSchoolGenerator = (item) => {
    if (item.TeachingRejectIDs || item.TeachingStatus === "TU_CHOI") {
        return "bg-danger h-20px";
    }
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