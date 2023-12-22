/**
 *  The MIT License (MIT)
 *  Copyright (c) 2023 Northern Captain
 */

const mqtt = require("mqtt")
const {clog} = require("../utils/logs")

class MQTTListener {
    constructor(config) {
        this.config = config
        this.bus = config.bus
    }

    async start() {
        this.client = await mqtt.connectAsync(this.config.mqtt.url, {
            username: this.config.mqtt.username,
            password: this.config.mqtt.password,
        })

        await this.client.subscribeAsync("frigate/events")
        await this.client.subscribeAsync("frigate/stats")

        this.client.on("message", this.onMessage.bind(this))

        clog("Connected to mqtt server at ", this.config.mqtt.url)
    }

    onMessage(topic, message) {
        switch(topic) {
            case "frigate/events":
                this.onFrigateEvent(message.toString())
                break
            case "frigate/stats":
                this.onFrigateStats(message.toString())
                break
        }
    }

    onFrigateEvent(message) {
        clog("MQTT: Got event: ", message)
        let event = JSON.parse(message)
        this.bus.emit("frigateEvent", event)
    }
    onFrigateStats(message) {
        clog("MQTT: Got stats: ", message)
        let event = JSON.parse(message)
        this.bus.emit("frigateStats", event)
    }
}

exports.MQTTListener = MQTTListener
