/**
 *  The MIT License (MIT)
 *  Copyright (c) 2023 Northern Captain
 */

class Frigate {
    constructor(config) {
        this.url = config.frigate.url
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
