"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpsertKeyValue = void 0;
function UpsertKeyValue(obj, keyToChange, value) {
    var keyToChangeLower = keyToChange.toLowerCase();
    for (var _i = 0, _a = Object.keys(obj); _i < _a.length; _i++) {
        var key = _a[_i];
        if (key.toLowerCase() === keyToChangeLower) {
            // Reassign old key
            obj[key] = value;
            // Done
            return;
        }
    }
    // Insert at end instead
    obj[keyToChange] = value;
}
exports.UpsertKeyValue = UpsertKeyValue;
