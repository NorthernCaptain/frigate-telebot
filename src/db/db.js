/**
 *  The MIT License (MIT)
 *  Copyright (c) 2023 Northern Captain
 */

const {Sequelize} = require("sequelize")
const {clog} = require("../utils/logs")
const {Setup} = require("./setup")
const {config} = require("../config/config")
const {Stats} = require("./stats")

class DB {
    constructor(config) {
        this.config = config
        this.sequelize = null
    }

    async start() {
        this.sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: this.config.local.dbFile()
        });
        try {
            await this.sequelize.authenticate();
            clog("DB Connection has been established successfully.");
        } catch (error) {
            clog("Unable to connect to the database:", error);
        }
        Setup.init(this.sequelize, Sequelize)
        Stats.init(this.sequelize, Sequelize)

        await this.sequelize.sync()
    }

    async getSetupValue(name, def = null, asJSON = false) {
        let setup = await Setup.findByPk(name)
        if(setup) {
            return asJSON ? JSON.parse(setup.value) : setup.value
        } else {
            return def
        }
    }

    async setSetupValue(name, value) {
        let setup = await Setup.findByPk(name)
        const valueToSave = value instanceof Object ? JSON.stringify(value) : value.toString()
        if(setup) {
            setup.value = valueToSave
            await setup.save()
        } else {
            await Setup.create({name, value: valueToSave})
        }
    }
}

exports.DB = DB
exports.db = new DB(config)

