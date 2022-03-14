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
    return params;
};