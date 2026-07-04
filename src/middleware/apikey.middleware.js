export const apiKeyMiddleware = (req, res, next) => {
    const apiKey = req.headers['x-api-key']
    const validApiKey = process.env.API_KEY || process.env.APIKEY

    if (!validApiKey) {
        return next()
    }

    if (apiKey && apiKey === validApiKey) {
        return next()
    }

    return res.status(401).json({ message: 'Unauthorized: Invalid API Key' })
}

