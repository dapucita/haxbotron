export interface BrowserHostConfig {
    roomName: string
    playerName: string
    password: string | null
    maxPlayers: number
    public: boolean
    token: string
    noPlayer: boolean
    geo?: {
        code: string
        lat: number
        lon: number
    }
}
