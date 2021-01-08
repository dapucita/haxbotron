export interface ResponseError extends Error {
    status?: number
    data?: any
}