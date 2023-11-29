/**
 *  The MIT License (MIT)
 *  Copyright (c) 2023 Northern Captain
 */

const { Telegraf } = require("telegraf")
const { clog } = require("../utils/logs")
const { Frigate } = require("../frigate/frigate")
const fs = require("fs")
const { frigateTestEvents } = require("../frigate/testevents")

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

        //Just for testing
        this.bot.hears("test-new", async (ctx) => {
            // Using context shortcut
            await ctx.reply(`New event`)
            this.bus.emit("frigateEvent",  frigateTestEvents.new)
        })
        this.bot.hears("test-update", async (ctx) => {
            // Using context shortcut
            await ctx.reply(`Update event`)
            this.bus.emit("frigateEvent", frigateTestEvents.update)
        })
        this.bot.hears("test-end", async (ctx) => {
            // Using context shortcut
            await ctx.reply(`End event`)
            this.bus.emit("frigateEvent", frigateTestEvents.end)
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
