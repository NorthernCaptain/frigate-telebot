/**
 *  The MIT License (MIT)
 *  Copyright (c) 2023 Northern Captain
 */

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, simple } = format;

const log = createLogger({
    format: combine(
        timestamp(),
        printf(
            info => `[${info.timestamp}]:${('   ' + process.pid).substr(-5)} ${info.level.substr(0, 4)}: ${info.message}`
        )
    ),
    transports: [new transports.Console()]
})

function createLog(fileName) {
    const { createLogger, format, transports } = require('winston');
    const { combine, timestamp, printf, simple } = format;

    const pid = ('    ' + process.pid).substr(-5);
    const log = createLogger({
        format: combine(
            timestamp(),
            printf(
                info => `[${info.timestamp}]:${pid}: ${info.level.substr(0, 4)}: ${info.message}`
            )
        ),
        transports: [
            new transports.Console(),
            new transports.File({ filename: fileName })
        ]
    })
    log.on('error', function (err) { /* Do Something */ });
    return log;
}

function p2string(params) {
    return params.map((p) => {
        if(p === null) return "null"
        if(p === undefined) return "undefined"
        return p.toString()
    }).join(" ")
}
function clog(...params) {
    log.info(p2string(params))
}

function cerr(...params) {
    log.error(p2string(params))
}

function parseFloatDef(value, def) {
    let parsed = parseFloat(value)
    if(isNaN(parsed)) {
        return def
    } else {
        return parsed
    }
}

exports.log = log;
exports.createLog = createLog;
exports.clog = clog;
exports.cerr = cerr;
exports.parseFloatDef = parseFloatDef;
