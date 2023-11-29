/**
 *  Authors: Northern Captain
 */

const { clog } = require("./utils/logs")
const { FBot } = require("./bot/bot")
const { MQTTListener } = require("./mqtt/mqtt")
const { config } = require("./config/config")

clog("Starting the bot...")
const mqtt = new MQTTListener(config)
const bot = new FBot(config)
bot.start()
mqtt.start()
