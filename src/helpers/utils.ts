export function generateShortCode(num: number): string {
    const chars: string = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    let encoded: string = ""
    while (num > 0) {
        encoded = chars[num % chars.length] + encoded
        num = Math.floor(num / chars.length)
    }
    return encoded
}