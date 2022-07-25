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

export const ClassTeacherGenerator = (item) => {
    if (item.TeachingRejectIDs || item.TeachingStatus === "TU_CHOI") {
        return "bg-danger";
    }
    if ((item.UserID > 0 || item.TeacherID) && item.TeachingStatus !== "HOAN_THANH") {
        return "bg-warning";
    }
    if (item.TeachingStatus === "HOAN_THANH") {
        return "bg-success";
    }
    return "bg-primary";
}