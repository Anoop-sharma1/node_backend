const { DataTypes } = require('sequelize');

function model(sequelize) {
    const attributes = {
        id_user: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        first_name: {
            type: DataTypes.STRING,
            allowNull: false
        },

        last_name : {
            type: DataTypes.STRING,
            allowNull: false
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false
        },

        is_admin : {
            type: DataTypes.TINYINT,
            defaultValue: 0,
            allowNull: true,
        },
                
    };

    const options = {
        defaultScope: {
            // exclude password by default
            attributes: { exclude: ['password'] }
        },
        scopes: {
            // include password with this scope
            withPassword: { attributes: {}, }
        },
        createdAt: "created_at",
        updatedAt: "updated_at",
        freezeTableName: true
    };

    return sequelize.define('User', attributes, options);
}

module.exports = model;