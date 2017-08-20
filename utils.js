(function (global) {
    global.utils = {
        clearHeld,
    };

    function clearHeld() {
        for (const key in held) {
            held[key] = false;
        }
    }
})(window);
