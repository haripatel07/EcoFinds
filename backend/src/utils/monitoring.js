const perf = require('perf_hooks').performance;

function markStart(label) {
    const key = `${label}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    return { key, label, start: perf.now() };
}

function markEnd(handle, logger = console) {
    if (!handle) return; const duration = perf.now() - handle.start;
    logger.info ? logger.info({ metric: handle.label, durationMs: duration.toFixed(2) }) : logger.log(handle.label, duration.toFixed(2) + 'ms');
    return duration;
}

async function timed(label, fn, logger = console) {
    const h = markStart(label); try { return await fn(); } finally { markEnd(h, logger); }
}

module.exports = { markStart, markEnd, timed };
