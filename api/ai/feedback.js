// In-memory storage for serverless functions
const storage = {
    aiQueries: new Map()
};

// Validation function
const validateFeedback = (body) => {
    const { id, isHelpful } = body;

    if (typeof id !== 'number' || id <= 0) {
        throw new Error("Invalid query ID");
    }

    if (typeof isHelpful !== 'boolean') {
        throw new Error("isHelpful must be a boolean");
    }

    return { id, isHelpful };
};

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { id, isHelpful } = validateFeedback(req.body);

        const query = storage.aiQueries.get(id);
        if (!query) {
            return res.status(404).json({ error: "Query not found" });
        }

        query.isHelpful = isHelpful;
        storage.aiQueries.set(id, query);

        res.status(200).json({ success: true, isHelpful });
    } catch (error) {
        console.error('Feedback error:', error);
        res.status(500).json({
            error: error.message || 'Failed to submit feedback'
        });
    }
}
