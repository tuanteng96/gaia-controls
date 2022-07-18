export const ClassSchoolGenerator = (item) => {
    if (item.Rejects && item.Rejects.length > 0) {
        return "bg-danger h-20px";
    }
    if (!item.Teaching || item.Teaching.Status === "" || item.UserID > 0) {
        return "bg-warning h-20px";
    }
    if (item.Teaching.Status === "NHAN_TIET") {
        return "bg-success h-20px";
    }
    return "bg-primary h-38px";
}