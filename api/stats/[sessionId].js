// In-memory storage for serverless functions
const storage = {
    sessionStats: new Map(),
    currentStatsId: 1
};

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { sessionId } = req.query;

    // GET request - retrieve stats
    if (req.method === 'GET') {
        try {
            const stats = storage.sessionStats.get(sessionId);

            if (!stats) {
                return res.json({
                    queriesCount: 0,
                    helpfulCount: 0,
                    successRate: 0
                });
            }

            const successRate = (stats.queriesCount || 0) > 0
                ? Math.round(((stats.helpfulCount || 0) / (stats.queriesCount || 0)) * 100)
                : 0;

            res.json({
                queriesCount: stats.queriesCount || 0,
                helpfulCount: stats.helpfulCount || 0,
                successRate
            });
        } catch (error) {
            console.error('Stats error:', error);
            res.status(500).json({
                error: error.message || 'Failed to fetch stats'
            });
        }
    }
    // POST request - update stats
    else if (req.method === 'POST') {
        try {
            const { queriesCount, helpfulCount } = req.body;

            const existing = storage.sessionStats.get(sessionId);
            if (existing) {
                existing.queriesCount = queriesCount;
                existing.helpfulCount = helpfulCount;
                existing.timestamp = new Date();
                storage.sessionStats.set(sessionId, existing);
            } else {
                const id = storage.currentStatsId++;
                const stats = {
                    id,
                    sessionId,
                    queriesCount,
                    helpfulCount,
                    timestamp: new Date()
                };
                storage.sessionStats.set(sessionId, stats);
            }

            const stats = storage.sessionStats.get(sessionId);
            const successRate = (stats.queriesCount || 0) > 0
                ? Math.round(((stats.helpfulCount || 0) / (stats.queriesCount || 0)) * 100)
                : 0;

            res.json({
                queriesCount: stats.queriesCount || 0,
                helpfulCount: stats.helpfulCount || 0,
                successRate
            });
        } catch (error) {
            console.error('Update Stats error:', error);
            res.status(500).json({
                error: error.message || 'Failed to update stats'
            });
        }
    }
    // Method not allowed
    else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
