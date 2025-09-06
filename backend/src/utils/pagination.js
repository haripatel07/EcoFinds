const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

function parsePagination(query) {
    const page = Math.max(1, parseInt(query.page || '1', 10));
    let limit = Math.max(1, parseInt(query.limit || String(DEFAULT_LIMIT), 10));
    limit = Math.min(limit, MAX_LIMIT);
    const skip = (page - 1) * limit;
    return { page, limit, skip };
}

module.exports = { parsePagination };
