import pkg from 'winston';
const { format } = pkg;
import 'winston-daily-rotate-file';

/**
 * Logger handles all logs in the application
 */
const logger = pkg.createLogger({
    format: format.combine(format.timestamp(), format.simple()),
    colorize: true,
    transports: [
        new pkg.transports.File({
            filename: 'logs/server/error.log',
            level: 'error',
            handleExceptions: true
        }),
        new pkg.transports.File({
            filename: 'logs/server/all.log',
            level: 'info',
            handleExceptions: true
        }),
        new pkg.transports.DailyRotateFile({
            maxFiles: '14d',
            level: 'info',
            dirname: 'logs/server/daily',
            datePattern: 'YYYY-MM-DD',
            filename: '%DATE%.log'
        }),
        new pkg.transports.Console({
            level: 'debug',
            json: false,
            handleExceptions: true
        })
    ]
});

/**
 * morganLogger logs all http request in a dedicated file and on console
 */
const morganLogger = pkg.createLogger({
    format: format.combine(format.simple()),
    transports: [
        new pkg.transports.File({
            filename: 'logs/requests/all.log',
            level: 'debug',
            handleExceptions: true
        }),
        new pkg.transports.Console({
            level: 'debug',
            json: false,
            handleExceptions: true
        }),
        new pkg.transports.DailyRotateFile({
            maxFiles: '14d',
            level: 'info',
            dirname: 'logs/requests/daily',
            datePattern: 'YYYY-MM-DD',
            filename: '%DATE%.log'
        })
    ]
});

export const logStream = {
    /**
     * A writable stream for pkg logger.
     *
     * @param {any} message
     */
    write(message) {
        morganLogger.info(message.toString());
    }
};

export default logger;