"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeRandomUser = exports.removeUser = exports.addUser = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize('sqlite::memory:');
exports.sequelize = sequelize;
(async () => {
    try {
        await sequelize.authenticate();
    }
    catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();
const Users = sequelize.define('Users', {
    id: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
    },
});
// Function to add a user
async function addUser(userId) {
    try {
        console.log("adding user: ", userId);
        const user = await Users.create({ id: userId });
        ``;
        console.log('User added:', user.toJSON());
    }
    catch (error) {
        console.error('Error adding user:', error);
    }
}
exports.addUser = addUser;
// Function to remove a user
async function removeUser(userId) {
    try {
        const user = await Users.findOne({ where: { id: userId } });
        if (user) {
            await user.destroy();
            console.log('User removed:', user.toJSON());
        }
        else {
            console.log('User not found.');
        }
    }
    catch (error) {
        console.error('Error removing user:', error);
    }
}
exports.removeUser = removeUser;
async function removeRandomUser() {
    try {
        // Find a random user in the database
        const randomUser = await Users.findOne({ order: sequelize.random(), limit: 1 });
        if (randomUser) {
            // @ts-ignore
            const userId = randomUser.id;
            // Remove the random user
            await randomUser.destroy();
            console.log('Random user removed:', userId);
            return userId;
        }
        else {
            console.log('No users found.');
            return undefined;
        }
    }
    catch (error) {
        console.error('Error removing random user:', error);
        return undefined;
    }
}
exports.removeRandomUser = removeRandomUser;
(async () => {
    await sequelize.sync();
})();
