export interface LogMessage {
    // Log Level (lower level means more high priority)
    // error 0, warn 1, info 2, http 3, verbose 4, debug 5, silly 6
    type: number;
    // message text
    context: string;
}

// USAGE
// this.push({type: 2, context: msg});