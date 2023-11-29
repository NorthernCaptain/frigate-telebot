# frigate-telebot
Telegram bot for popular [Frigate NVR](https://frigate.video), written in Node JS.

With this code you can create a Telegram bot that will listen for Frigate events and send notifications to Telegram.

## Features

* Subscribe with password, so only people who know the password can subscribe to your bot.
* Send notifications with snapshots to Telegram when Frigate detects an object, usually a person.
* Send notifications when the detection ends.
* Send video clips of the events to Telegram
* Support for multiple chats and telegram groups. Everyone who subscribed with password will be notified.

## Installation and configuration

* Clone this repository
* Create new Telegram bot using [BotFather](https://t.me/botfather)
* Create `prod.env` file with the connection info using `sample.env` as example and the telegram bot token you got from BotFather
* Create a docker image with `docker build -t frigate-telebot .`
* Run the docker image with `docker run -d --name frigate-telebot -v your_local_storage_folder:/storage --restart=unless-stopped frigate-telebot`

Your Frigate NVR should be connected to MQTT and you should provide Frigate url to access it's api.

### Content of `prod.env` file

* FBOT_FRIGATE_URL - url of your Frigate installation, default = `http://nvr.internal:5000`
* FBOT_MQTT_URL - url of your MQTT broker, default = `mqtt://nvr.internal`
* FBOT_MQTT_USERNAME - username for accessing MQTT broker
* FBOT_MQTT_PASSWORD - password for accessing MQTT broker 
* FBOT_TELEGRAM_TOKEN - your new bot token from BotFather, i.e 1234567:xxxxxxxxx
* FBOT_STORAGE_FOLDER - path to storage folder where bot will store chat ids to send the messages to, default `/storage`
* FBOT_BOT_PASSWORD - a password that will be used to subscribe to the bot, default = `unsecure`

## Usage

* Start the bot with the docker image.
* Open Telegram app and find your bot, start a chat with it.
* Send `/start your_FBOT_BOT_PASSWORD` to the bot it will reply with a message that you are subscribed if the password is correct.
* Wait for events to start pushing to Telegram.

MIT License,
Copyright (c) 2023 Northern Captain.
