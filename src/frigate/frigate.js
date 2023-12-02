/**
 *  The MIT License (MIT)
 *  Copyright (c) 2023 Northern Captain
 */
const { parseFloatDef, cerr, clog} = require("../utils/logs")
const os = require("os")
const { Stats } = require("../db/stats")
const {Op} = require("sequelize")

class Frigate {
    constructor(config) {
        this.url = config.frigate.url
        this.bus = config.bus
    }

    async start() {
        this.bus.on("frigateStats", this.onFrigateStats.bind(this))
    }

    async onFrigateStats(event) {
        try {
            //let's calculate the stats
            let stats = {
                cpu_usage_p: 0,
                mem_usage_p: 0,
                gpu_usage_p: 0,
                gpu_mem_usage_p: 0,
                disk_usage_p: 0,
                cache_usage_p: 0,
                shm_usage_p: 0,
            }
            if (event.cpu_usages.MiB) {
                stats.mem_usage_p = parseFloatDef(event.cpu_usages.MiB.cpu, 0) * 100 / (os.totalmem() / 1024 / 1024)
            }

            delete event.cpu_usages.MiB
            delete event.cpu_usages.top
            delete event.cpu_usages.PID
            delete event.cpu_usages.Tasks

            for (let usage of Object.values(event.cpu_usages)) {
                stats.cpu_usage_p += parseFloatDef(usage.cpu, 0)
            }

            if (event.gpu_usages) {
                for (let usage of Object.values(event.gpu_usages)) {
                    stats.gpu_usage_p += parseFloatDef(usage.gpu.split(" ")[0], 0)
                    stats.gpu_mem_usage_p += parseFloatDef(usage.mem.split(" ")[0], 0)
                }
            }

            if (event.service?.storage) {
                for (let usageKey in event.service.storage) {
                    let usage = event.service.storage[usageKey]
                    if (usage.mount_type?.includes("tmp")) {
                        if (usageKey.includes("shm")) {
                            stats.shm_usage_p = parseFloatDef(usage.used, 0) * 100 / parseFloatDef(usage.total, 1)
                        }
                        if (usageKey.includes("cache")) {
                            stats.cache_usage_p = parseFloatDef(usage.used, 0) * 100 / parseFloatDef(usage.total, 1)
                        }
                    } else {
                        stats.disk_usage_p = Math.max(parseFloatDef(usage.used, 0) * 100 / parseFloatDef(usage.total, 1), stats.disk_usage_p)
                    }
                }
            }

            stats.cpu_usage_p /= os.cpus().length
            clog("Frigate: Save stats: ", JSON.stringify(stats, null, 2))
            await Stats.create(stats)
        } catch (e) {
            cerr("Frigate: Failed to save stats", e)
        }
    }

    async buildStatChart(hours = 48) {
        let rows = Stats.findAll( {
            where: {
                timestamp: { [Op.gt]: new Date(Date.now() - hours * 60 * 60 * 1000) }
            },
            order: [["timestamp", "ASC"]]
        })
    }

    uiEventsUrl(event) {
        return `${this.url}/events?cameras=${event.camera}&labels=${event.label}`
    }

    eventSnapshotUrl(event) {
        return `${this.url}/api/events/${event.id}/snapshot.jpg`
    }
    eventClipUrl(event) {
        return `${this.url}/api/events/${event.id}/clip.mp4`
    }

    cameraTitle(event) {
        return `🎥 ${event.camera}`
    }
}

exports.Frigate = Frigate;
