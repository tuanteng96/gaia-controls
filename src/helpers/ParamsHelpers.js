export const getRequestParams = (filters) => {
    let params = {};
    if (filters.Type) {
        params.Type = Number(filters.Type);
    }
    if (filters._pi) {
        params._pi = filters._pi;
    }
    if (filters._ps) {
        params._ps = filters._ps;
    }
    if (filters._orders) {
        params._orders = filters._orders;
    }
    if (filters._appends) {
        params._appends = filters._appends;
    }
    if (filters._key) {
        params._key = filters._key;
    }
    if (filters.PID) {
        params.PID = filters.PID;
    }
    if (filters.DID) {
        params.DID = filters.DID;
    }
    if (filters.LevelJson) {
        params.LevelJson = filters.LevelJson;
    }
    if (filters.SchoolID) {
        params.SchoolID = filters.SchoolID;
    }
    if (filters.Status || filters.Status === 0) {
        params.Status = filters.Status;
    }
    if (filters._ignoredf) {
        params._ignoredf = filters._ignoredf;
    }
    return params;
};