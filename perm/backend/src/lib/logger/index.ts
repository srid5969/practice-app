

class Logger{
    info(message: string, ...args: any[]): void {
        console.info(`[INFO] ${message}`, ...args);
    }

    debug(message: string, ...args: any[]): void {
        console.debug(`[DEBUG] ${message}`, ...args);
    }

    error(message: string, ...args: any[]): void {
        console.error(`[ERROR] ${message}`, ...args);
    }

    fatal(message: string, ...args: any[]): void {
        console.error(`[FATAL] ${message}`, ...args);
    }

    trace(message: string, ...args: any[]): void {
        console.trace(`[TRACE] ${message}`, ...args);
    }
}
const logger = new Logger();
export default logger;