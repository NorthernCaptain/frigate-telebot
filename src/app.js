/**
 *  The MIT License (MIT)
 *  Copyright (c) 2023 Northern Captain
 */

const { clog } = require("./utils/logs")
const { FBot } = require("./bot/bot")
const { MQTTListener } = require("./mqtt/mqtt")
const { config } = require("./config/config")
const { db } = require("./db/db")
const { Frigate } = require("./frigate/frigate")

clog("Starting the bot...")

const mqtt = new MQTTListener(config)
const frigate = new Frigate(config)
const bot = new FBot(config, frigate)

async function start() {
    await db.start()
    await mqtt.start()
    await frigate.start()
    await bot.start()
}

start().then(() => {
    clog("Bot started")
}).catch((err) => {
    clog("Bot failed to start", err)
})
