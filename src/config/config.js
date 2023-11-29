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
        storageFolder: process.env.FBOT_STORAGE_FOLDER ? process.env.FBOT_STORAGE_FOLDER : "/tmp",
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
        postProcessDelay: 10000
    },
    bus: new EventEmitter(),
}

exports.config = config;
