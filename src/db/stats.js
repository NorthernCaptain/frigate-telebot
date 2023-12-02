/**
 *  The MIT License (MIT)
 *  Copyright (c) 2023 Northern Captain
 */
const { Model, DataTypes} = require("sequelize")

class Stats extends Model {
    static init(sequelize, DataTypes) {
        return super.init({
            id: {
                type: DataTypes.INTEGER,
                unique: true,
                primaryKey: true,
                autoIncrement: true
            },
            timestamp: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                unique: true,
                allowNull: false
            },
            // Various usage stats in percents (_p)
            cpu_usage_p: {
                type: DataTypes.FLOAT,
            },
            gpu_usage_p: {
                type: DataTypes.FLOAT,
            },
            mem_usage_p: {
                type: DataTypes.FLOAT,
            },
            gpu_mem_usage_p: {
                type: DataTypes.FLOAT,
            },
            disk_usage_p: {
                type: DataTypes.FLOAT,
            },
            cache_usage_p: {
                type: DataTypes.FLOAT,
            },
            shm_usage_p: {
                type: DataTypes.FLOAT,
            },
        }, {
            sequelize,
            modelName: "Stats",
            tableName: "stats",
            timestamps: false,
        })
    }
}

exports.Stats = Stats
