const { DataTypes } = require('sequelize');

function model(sequelize) {
    const attributes = {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'User',
                key: 'id_user'
             },      
            allowNull: false,
            
        },

        otp: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

        expiration: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        used: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0,
        },

        is_verified: {
            type: DataTypes.TINYINT,
            allowNull: true,
            defaultValue: 0,
        },      
    };

    const options = {
        defaultScope: {
            
        },
        scopes: {
            
        },
        createdAt: "created_at",
        updatedAt: "updated_at",
        freezeTableName: true
    };

    return sequelize.define('UserOtp', attributes, options);
}

module.exports = model;