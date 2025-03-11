var jsonMessage = "";
function reviver(key, value) {
    if (typeof value !== 'number' || Number.MAX_SAFE_INTEGER > value) {
        return value;
    }
    const maxLen = Number.MAX_SAFE_INTEGER.toString().length - 1;

    const needle = String(value).substr(0, maxLen);

    const re = new RegExp(`${needle}\\d+`);
    const matches = jsonMessage.match(re);
    if (matches) {
        return BigInt(matches[0]);
    }
    return value;
}