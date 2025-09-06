function wrap(level) {
    return (...args) => console[level](new Date().toISOString(), ...args);
}

module.exports = {
    info: wrap('log'),
    warn: wrap('warn'),
    error: wrap('error'),
    debug: wrap('debug')
};
