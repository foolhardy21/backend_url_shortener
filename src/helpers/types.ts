export type Url = {
    id: number
    originalUrl: string
    shortUrl: string
    createdAt: string
    visitCount: number
    accessedAt: Date
    userId: number
    deletedAt: Date
    expiryDate?: string
}

export type User = {
    id: number
    name: string
    email: string
    createdAt: string
    apiKey: string
}

export type BulkShortenUrlObj = {
    originalUrl: string
    expiryDate: Date
    customCode: string
}