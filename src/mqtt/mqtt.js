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
        clog("Connected to mqtt server at ", this.config.mqtt.url)
        await this.client.subscribeAsync("frigate/events")
        this.client.on("message", this.onMessage.bind(this))
    }

    onMessage(topic, message) {
        switch(topic) {
            case "frigate/events":
                this.onFrigateEvent(message.toString())
                break
        }
    }

    onFrigateEvent(message) {
        clog("MQTT: Got event: ", message)
        let event = JSON.parse(message)
        this.bus.emit("frigateEvent", event)
    }

    emulate() {
        this.onFrigateEvent({
            "before": {
                "id": "1701206268.227845-gphnxk",
                "camera": "front_door",
                "frame_time": 1701102816.734806,
                "snapshot_time": 1701101310.003611,
                "label": "car",
                "sub_label": null,
                "top_score": 0.9460710287094116,
                "false_positive": false,
                "start_time": 1701094792.038089,
                "end_time": null,
                "score": 0.9039015769958496,
                "box": [78, 27, 280, 122],
                "area": 19190,
                "ratio": 2.126315789473684,
                "region": [0, 0, 416, 416],
                "stationary": true,
                "motionless_count": 37567,
                "position_changes": 3,
                "current_zones": ["driveway"],
                "entered_zones": ["driveway"],
                "has_clip": true,
                "has_snapshot": true
            },
            "after": {
                "id": "1701206268.227845-gphnxk",
                "camera": "front_door",
                "frame_time": 1701102876.957319,
                "snapshot_time": 1701101310.003611,
                "label": "car",
                "sub_label": null,
                "top_score": 0.9460710287094116,
                "false_positive": false,
                "start_time": 1701094792.038089,
                "end_time": null,
                "score": 0.9277694225311279,
                "box": [78, 28, 280, 118],
                "area": 18180,
                "ratio": 2.2444444444444445,
                "region": [0, 0, 416, 416],
                "stationary": true,
                "motionless_count": 37868,
                "position_changes": 3,
                "current_zones": ["driveway"],
                "entered_zones": ["driveway"],
                "has_clip": true,
                "has_snapshot": true
            },
            "type": "update"
        })
    }
}

exports.MQTTListener = MQTTListener
