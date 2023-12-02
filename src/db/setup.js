/**
 *  The MIT License (MIT)
 *  Copyright (c) 2023 Northern Captain
 */
const { Model, DataTypes} = require("sequelize")

class Setup extends Model {
    static init(sequelize, DataTypes) {
        return super.init({
            name: {
                type: DataTypes.STRING,
                unique: true,
                primaryKey: true
            },
            value: {
                type: DataTypes.TEXT
            }
        }, {
            sequelize,
            modelName: "Setup",
            tableName: "setup",
        })
    }
}

exports.Setup = Setup
