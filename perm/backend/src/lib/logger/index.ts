class Logger {
    private colors = {
        reset: '\x1b[0m',
        bright: '\x1b[1m',
        red: '\x1b[31m',
        green: '\x1b[32m',
        yellow: '\x1b[33m',
        blue: '\x1b[34m',
        magenta: '\x1b[35m',
        cyan: '\x1b[36m',
        white: '\x1b[37m'
    };

    info(message: string, ...args: any[]): void {
        console.info(`${this.colors.green}[INFO]${this.colors.reset} ${message}`, ...args);
    }

    debug(message: string, ...args: any[]): void {
        console.debug(`${this.colors.cyan}[DEBUG]${this.colors.reset} ${message}`, ...args);
    }

    error(message: string, ...args: any[]): void {
        console.error(`${this.colors.red}[ERROR]${this.colors.reset} ${message}`, ...args);
    }

    fatal(message: string, ...args: any[]): void {
        console.error(`${this.colors.red}${this.colors.bright}[FATAL]${this.colors.reset} ${message}`, ...args);
    }

    trace(message: string, ...args: any[]): void {
        console.trace(`${this.colors.magenta}[TRACE]${this.colors.reset} ${message}`, ...args);
    }
}

const logger = new Logger();
export default logger;