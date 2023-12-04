/**
 *  The MIT License (MIT)
 *  Copyright (c) 2023 Northern Captain
 */
const { parseFloatDef, cerr, clog} = require("../utils/logs")
const os = require("os")
const { Stats } = require("../db/stats")
const { Op } = require("sequelize")
const { ChartJSNodeCanvas } = require("chartjs-node-canvas")
const fs = require("fs")
const {Chart} = require("chart.js")

class Frigate {
    static CHART_WIDTH = 640
    static CHART_HEIGHT = 520
    constructor(config) {
        this.config = config
        this.url = config.frigate.url
        this.bus = config.bus
        this.chart = new ChartJSNodeCanvas({
            width: Frigate.CHART_WIDTH,
            height: Frigate.CHART_HEIGHT,
            chartCallback: (chartJS) => {
                chartJS.defaults.font.family = "'RobotoRegular',sans-serif";
            }
        });
        this.chart.registerFont("./src/font/RobotoCondensed-Regular.ttf", { family: "RobotoRegular" });
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


    groupData(rows, timeFrom, timeTo, points) {
        let grouped = []
        let step = (timeTo - timeFrom) / points
        for(let i=0;i<points;i++) {
            let time = timeFrom + step * i
            let timestamp = new Date(time)
            grouped.push({
                timestamp: timestamp,
                x: `${timestamp.getMonth()+1}/${timestamp.getDate()} ${timestamp.getHours().toString().padStart(2, "0")}:${timestamp.getMinutes().toString().padStart(2, "0")}`,
                cpu_usage_p: 0,
                mem_usage_p: 0,
                gpu_usage_p: 0,
                gpu_mem_usage_p: 0,
                disk_usage_p: 0,
                cache_usage_p: 0,
                shm_usage_p: 0,
            })
        }
        for(let row of rows) {
            let idx = Math.floor((row.timestamp.getTime() - timeFrom) / step)
            if(idx < 0) continue
            if(idx >= points) continue
            let grp = grouped[idx]
            grp.cpu_usage_p = Math.max(row.cpu_usage_p, grp.cpu_usage_p)
            grp.cpu_usage_p = grp.cpu_usage_p > 10 ? grp.cpu_usage_p / 12 : grp.cpu_usage_p
            grp.mem_usage_p = Math.max(row.mem_usage_p, grp.mem_usage_p)
            grp.gpu_usage_p = Math.max(row.gpu_usage_p, grp.gpu_usage_p)
            grp.gpu_mem_usage_p = Math.max(row.gpu_mem_usage_p, grp.gpu_mem_usage_p)
            grp.disk_usage_p = Math.max(row.disk_usage_p, grp.disk_usage_p)
            grp.cache_usage_p = Math.max(row.cache_usage_p, grp.cache_usage_p)
            grp.shm_usage_p = Math.max(row.shm_usage_p, grp.shm_usage_p)
        }
        return grouped
    }
    async buildStatChart(hours = 48, points = 100) {
        let rows = await Stats.findAll( {
            where: {
                timestamp: { [Op.gt]: new Date(Date.now() - hours * 60 * 60 * 1000) }
            },
            order: [["timestamp", "ASC"]]
        })
        if(rows.length === 0) {
            clog("Frigate: No stats rows found")
            return null
        }

        let timeTo = rows[rows.length - 1].timestamp.getTime()
        let timeFrom = rows[0].timestamp.getTime()

        let grouped = this.groupData(rows, timeFrom, timeTo, points)

        clog("Frigate: Got stats rows", rows.length)
        let configuration = {
            type: 'line',
            data: {
                labels: grouped.map(row => row.x),
                datasets: [
                    {
                        label: 'CPU',
                        data: grouped,
                        parsing: {
                            xAxisKey: 'x',
                            yAxisKey: 'cpu_usage_p'
                        },
                        borderColor: 'rgb(75, 192, 192)',
                        backgroundColor: 'rgba(75, 192, 192,0.5)',
                        tension: 0.1
                    },
                    {
                        label: 'Mem',
                        data: grouped,
                        parsing: {
                            xAxisKey: 'x',
                            yAxisKey: 'mem_usage_p'
                        },
                        borderColor: 'rgb(75,94,192)',
                        pointStyle: false,
                        tension: 0.1
                    },
                    {
                        label: 'GPU',
                        data: grouped,
                        parsing: {
                            xAxisKey: 'x',
                            yAxisKey: 'gpu_usage_p'
                        },
                        borderColor: 'rgb(192,75,75)',
                        backgroundColor: 'rgba(192,75,75,0.5)',
                        tension: 0.1
                    },
                    {
                        label: 'GMem',
                        data: grouped,
                        parsing: {
                            xAxisKey: 'x',
                            yAxisKey: 'gpu_mem_usage_p'
                        },
                        borderColor: 'rgb(208,173,54)',
                        pointStyle: false,
                        tension: 0.1
                    },
                    {
                        label: 'Disk',
                        data: grouped,
                        parsing: {
                            xAxisKey: 'x',
                            yAxisKey: 'disk_usage_p'
                        },
                        borderColor: 'rgb(41,159,7)',
                        backgroundColor: 'rgba(41,159,7,0.5)',
                        tension: 0.1
                    },
                    {
                        label: 'Cache',
                        data: grouped,
                        parsing: {
                            xAxisKey: 'x',
                            yAxisKey: 'cache_usage_p'
                        },
                        borderColor: 'rgb(131,7,159)',
                        backgroundColor: 'rgba(131,7,159, 0.5)',
                        tension: 0.1
                    },
                    {
                        label: 'Shm',
                        data: grouped,
                        parsing: {
                            xAxisKey: 'x',
                            yAxisKey: 'shm_usage_p'
                        },
                        borderColor: 'rgb(218,119,8)',
                        backgroundColor: 'rgba(218,119,8,0.5)',
                        tension: 0.1
                    },
                ]
            },
            options: {
                pointRadius: 0,
                cubicInterpolationMode: 'monotone',
            },
            plugins: [{
                id: 'background-colour',
                beforeDraw: (chart) => {
                    const ctx = chart.ctx;
                    ctx.save();
                    ctx.fillStyle = 'white';
                    ctx.fillRect(0, 0, Frigate.CHART_WIDTH, Frigate.CHART_HEIGHT);
                    ctx.restore();
                }
            }]
        }
        let buf = await this.chart.renderToBuffer(configuration)
        //fs.writeFileSync(`${this.config.local.storageFolder}/chart.png`, buf, "base64")
        return buf
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
