/**
 *  The MIT License (MIT)
 *  Copyright (c) 2023 Northern Captain
 */

const { Telegraf } = require("telegraf")
const { clog } = require("../utils/logs")
const { Frigate } = require("../frigate/frigate")
const fs = require("fs")

class FBot {
    constructor(config) {
        this.config = config
        this.bus = config.bus
        this.bot = new Telegraf(config.telegram.token)
        this.chats = new Set()
        this.eventIds = new Set()
        this.frigate = new Frigate(config)
    }

    async start() {
        this.loadChatIds()

        this.bus.on("frigateEvent", this.onFrigateEvent.bind(this))

        this.bot.command("start", async (ctx) => {
            // Explicit usage
            let chatId = ctx.chat?.id
            if(!chatId || ctx.payload !== this.config.telegram.botPassword) {
                clog("FBOT: Got start command without chat id or password")
                await ctx.reply("I don't know you")
                return
            } else {
                this.addChatId(chatId)
            }
            await ctx.reply(`Welcome to Frigate Bot! Your chat id is ${chatId}`)
        })

        this.bot.hears("test", async (ctx) => {
            // Using context shortcut
            await ctx.reply(`Hello ${ctx.state.role}`)
            this.bus.emit("frigateEvent", {
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
        })

        this.bot.hears("test-new", async (ctx) => {
            // Using context shortcut
            await ctx.reply(`New event`)
            this.bus.emit("frigateEvent",   {
                    "before": {
                        "id": "1701219277.370731-gsjiax",
                        "camera": "front_door",
                        "frame_time": 1701219277.370731,
                        "snapshot_time": 0,
                        "label": "person",
                        "sub_label": null,
                        "top_score": 0,
                        "false_positive": true,
                        "start_time": 1701219277.370731,
                        "end_time": null,
                        "score": 0.6776189804077148,
                        "box": [
                            567,
                            333,
                            703,
                            479
                        ],
                        "area": 19856,
                        "ratio": 0.9315068493150684,
                        "region": [
                            224,
                            0,
                            704,
                            480
                        ],
                        "stationary": false,
                        "motionless_count": 0,
                        "position_changes": 0,
                        "current_zones": [],
                        "entered_zones": [],
                        "has_clip": false,
                        "has_snapshot": false
                    },
                    "after": {
                        "id": "1701219277.370731-gsjiax",
                        "camera": "front_door",
                        "frame_time": 1701219281.108612,
                        "snapshot_time": 1701219281.108612,
                        "label": "person",
                        "sub_label": null,
                        "top_score": 0.7281224727630615,
                        "false_positive": false,
                        "start_time": 1701219277.370731,
                        "end_time": null,
                        "score": 0.7153759002685547,
                        "box": [
                            252,
                            133,
                            441,
                            477
                        ],
                        "area": 65016,
                        "ratio": 0.5494186046511628,
                        "region": [
                            0,
                            0,
                            708,
                            708
                        ],
                        "stationary": false,
                        "motionless_count": 2,
                        "position_changes": 1,
                        "current_zones": [
                            "porch"
                        ],
                        "entered_zones": [
                            "porch"
                        ],
                        "has_clip": true,
                        "has_snapshot": true
                    },
                    "type": "new"
                }
            )
        })
        this.bot.hears("test-update", async (ctx) => {
            // Using context shortcut
            await ctx.reply(`Update event`)
            this.bus.emit("frigateEvent",   {
                    "before": {
                        "id": "1701219277.370731-gsjiax",
                        "camera": "front_door",
                        "frame_time": 1701219281.108612,
                        "snapshot_time": 1701219281.108612,
                        "label": "person",
                        "sub_label": null,
                        "top_score": 0.7281224727630615,
                        "false_positive": false,
                        "start_time": 1701219277.370731,
                        "end_time": null,
                        "score": 0.7153759002685547,
                        "box": [
                            252,
                            133,
                            441,
                            477
                        ],
                        "area": 65016,
                        "ratio": 0.5494186046511628,
                        "region": [
                            0,
                            0,
                            708,
                            708
                        ],
                        "stationary": false,
                        "motionless_count": 2,
                        "position_changes": 1,
                        "current_zones": [
                            "porch"
                        ],
                        "entered_zones": [
                            "porch"
                        ],
                        "has_clip": true,
                        "has_snapshot": true
                    },
                    "after": {
                        "id": "1701219277.370731-gsjiax",
                        "camera": "front_door",
                        "frame_time": 1701219285.728416,
                        "snapshot_time": 1701219282.718541,
                        "label": "person",
                        "sub_label": null,
                        "top_score": 0.8638695478439331,
                        "false_positive": false,
                        "start_time": 1701219277.370731,
                        "end_time": null,
                        "score": 0.74560546875,
                        "box": [
                            221,
                            42,
                            275,
                            199
                        ],
                        "area": 8478,
                        "ratio": 0.34394904458598724,
                        "region": [
                            0,
                            0,
                            416,
                            416
                        ],
                        "stationary": false,
                        "motionless_count": 0,
                        "position_changes": 1,
                        "current_zones": [
                            "porch"
                        ],
                        "entered_zones": [
                            "porch"
                        ],
                        "has_clip": true,
                        "has_snapshot": true
                    },
                    "type": "update"
                }
            )
        })
        this.bot.hears("test-end", async (ctx) => {
            // Using context shortcut
            await ctx.reply(`Update event`)
            this.bus.emit("frigateEvent",     {
                    "before": {
                        "id": "1701219277.370731-gsjiax",
                        "camera": "front_door",
                        "frame_time": 1701219300.158027,
                        "snapshot_time": 1701219282.718541,
                        "label": "person",
                        "sub_label": null,
                        "top_score": 0.8638695478439331,
                        "false_positive": false,
                        "start_time": 1701219277.370731,
                        "end_time": null,
                        "score": 0.57275390625,
                        "box": [
                            249,
                            31,
                            290,
                            156
                        ],
                        "area": 5125,
                        "ratio": 0.328,
                        "region": [
                            63,
                            0,
                            479,
                            416
                        ],
                        "stationary": true,
                        "motionless_count": 51,
                        "position_changes": 1,
                        "current_zones": [
                            "porch"
                        ],
                        "entered_zones": [
                            "porch"
                        ],
                        "has_clip": true,
                        "has_snapshot": true
                    },
                    "after": {
                        "id": "1701219277.370731-gsjiax",
                        "camera": "front_door",
                        "frame_time": 1701219305.377933,
                        "snapshot_time": 1701219282.718541,
                        "label": "person",
                        "sub_label": null,
                        "top_score": 0.8638695478439331,
                        "false_positive": false,
                        "start_time": 1701219277.370731,
                        "end_time": 1701219310.532894,
                        "score": 0.57275390625,
                        "box": [
                            249,
                            31,
                            290,
                            156
                        ],
                        "area": 5125,
                        "ratio": 0.328,
                        "region": [
                            63,
                            0,
                            479,
                            416
                        ],
                        "stationary": true,
                        "motionless_count": 77,
                        "position_changes": 1,
                        "current_zones": [
                            "porch"
                        ],
                        "entered_zones": [
                            "driveway",
                            "porch"
                        ],
                        "has_clip": true,
                        "has_snapshot": true
                    },
                    "type": "end"
                }
            )
        })


        await this.bot.launch()
        process.once('SIGINT', () => this.bot.stop('SIGINT'))
        process.once('SIGTERM', () => this.bot.stop('SIGTERM'))
    }

    async onFrigateEvent(event) {
        clog("FBOT: Got frigate event: ", JSON.stringify(event, null, 2))

        const subevent = event.after || event.before
        const eventId = subevent?.id
        if(!subevent || !eventId) {
            clog("FBOT: Got frigate event without before or after")
            return
        }

        if(event.type === "new" && subevent.has_snapshot) {
            this.eventIds.add(eventId)
            await this.sendSnapshot(eventId, subevent,"detected")
        }

        if(event.type === "update" && subevent.has_snapshot) {
            this.eventIds.add(eventId)
            await this.sendSnapshot(eventId, subevent, "updated")
        }

        if(event.type === "end") {
            clog("FBOT: Got end event, video should be ready", eventId, subevent.has_clip)
            if(subevent.has_clip) {
                const zones = subevent.entered_zones.join(" -> ")
                await this.sendMessage(`${this.frigate.cameraTitle(subevent)}: ${subevent.label} ended their way: ${zones}\nSending video... wait...\nLink if 🏃 ${this.frigate.uiEventsUrl(subevent)}`)
                setTimeout(async () => {
                    await this.sendClip(eventId, subevent)
                }, this.config.frigate.postProcessDelay)
            }
            this.eventIds.delete(eventId)
        }
    }

    async sendMessage(message) {
        for(let chatId of this.chats) {
            clog(`FBOT: Sending message to chat ${chatId}`)
            try {
                await this.bot.telegram.sendMessage(chatId, message)
            } catch(e) {
                clog("FBOT: Error sending message to chat", chatId, e)
            }
        }
    }

    async sendSnapshot(id, event, type) {
        clog("FBOT: Sending snapshot for id ", id)
        let url = this.frigate.eventSnapshotUrl(event)
        let caption = `${this.frigate.cameraTitle(event)}: ${type} a ${event.label}`
        for(let chatId of this.chats) {
            clog(`FBOT: Sending snapshot to chat ${chatId}`)
            try {
                await this.bot.telegram.sendPhoto(chatId, {url}, {caption})
            } catch(e) {
                clog("FBOT: Error sending snapshot to chat", chatId, e)
            }
        }
    }
    async sendClip(id, event) {
        clog("FBOT: Sending video clip for id ", id)
        let url = this.frigate.eventClipUrl(event)
        let caption = `${this.frigate.cameraTitle(event)}: Video of a ${event.label}`
        for(let chatId of this.chats) {
            clog(`FBOT: Sending video to chat ${chatId}`)
            try {
                await this.bot.telegram.sendVideo(chatId, {url}, {caption})
            } catch(e) {
                clog("FBOT: Error sending video to chat", chatId, e)
            }
        }
        clog("Done sending video clip for id ", id)
    }

    addChatId(chatId) {
        if(this.chats.has(chatId)) {
            clog(`FBOT: Chat id ${chatId} already added`)
            return
        }
        this.chats.add(chatId)
        fs.writeFileSync(this.config.telegram.chatIdFile(), JSON.stringify(Array.from(this.chats)))
        clog(`FBOT: Added chat id ${chatId}`)
    }

    removeChatId(chatId) {
        if(!this.chats.has(chatId)) {
            clog(`FBOT: Chat id ${chatId} not found`)
            return
        }
        this.chats.delete(chatId)
        fs.writeFileSync(this.config.telegram.chatIdFile(), JSON.stringify(Array.from(this.chats)))
        clog(`FBOT: Removed chat id ${chatId}`)
    }

    loadChatIds() {
        const chatFile = this.config.telegram.chatIdFile()
        if(!fs.existsSync(chatFile)) {
            clog(`FBOT: Chat id file ${chatFile} not found`)
            return
        }
        let chatIds = JSON.parse(fs.readFileSync(chatFile).toString())
        this.chats = new Set(chatIds)
        clog(`FBOT: Loaded ${chatIds.length} chat ids`)
    }
}

exports.FBot = FBot
