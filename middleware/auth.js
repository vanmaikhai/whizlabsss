export function requireAuth(handler) {
    return async (req, res) => {
        const apiKey = req.headers['x-api-key'];
        if (!apiKey || apiKey !== process.env.API_SECRET_KEY) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        return handler(req, res);
    };
}

export function rateLimit(handler, maxRequests = 5, windowMs = 60000) {
    const requests = new Map();

    return async (req, res) => {
        const ip =
            req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const now = Date.now();
        const windowStart = now - windowMs;

        if (!requests.has(ip)) {
            requests.set(ip, []);
        }

        const userRequests = requests
            .get(ip)
            .filter((time) => time > windowStart);

        if (userRequests.length >= maxRequests) {
            return res.status(429).json({ error: 'Too many requests' });
        }

        userRequests.push(now);
        requests.set(ip, userRequests);

        return handler(req, res);
    };
}
