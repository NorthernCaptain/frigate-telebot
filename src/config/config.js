/**
 *  The MIT License (MIT)
 *  Copyright (c) 2023 Northern Captain
 */


const EventEmitter = require('node:events')

const config = {
    mqtt: {
        url: process.env.FBOT_MQTT_URL ? process.env.FBOT_MQTT_URL : "mqtt://localhost:1883",
        username: process.env.FBOT_MQTT_USERNAME ? process.env.FBOT_MQTT_USERNAME : "admin",
        password: process.env.FBOT_MQTT_PASSWORD ? process.env.FBOT_MQTT_PASSWORD : "admin",
    },
    local: {
        storageFolder: process.env.FBOT_STORAGE_FOLDER ? process.env.FBOT_STORAGE_FOLDER : "/storage",
        dbFile: () => {
            return `${config.local.storageFolder}/db.sqlite`
        }
    },
    telegram: {
        token: process.env.FBOT_TELEGRAM_TOKEN ? process.env.FBOT_TELEGRAM_TOKEN : "",
        chatIdFile: () => {
            return `${config.local.storageFolder}/telegram_chat_id.txt`
        },
        botPassword: process.env.FBOT_BOT_PASSWORD ? process.env.FBOT_BOT_PASSWORD : "unsecure",
    },
    frigate: {
        url: process.env.FBOT_FRIGATE_URL ? process.env.FBOT_FRIGATE_URL : "http://localhost:5000",
        postProcessDelay: 10000 //wait 10 seconds before sending video to telegram, NVR needs time to process it
    },
    bot: {
        notifyOn: {
            new: true, //notify on every new event, send snapshot
            update: false, //notify on every update of the existing event, send snapshot
            end: true, //notify when event ends, send snapshot
            video: true, //send video clip when event ends and the video is ready
        }
    },
    bus: new EventEmitter(),
    db: null //database instance will be set in app.js
}

exports.config = config;
