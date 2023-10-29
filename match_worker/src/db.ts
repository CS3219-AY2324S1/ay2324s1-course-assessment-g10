import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize('sqlite::memory:');

(async () => {
  try {
    await sequelize.authenticate();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

const Users = sequelize.define('Users', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
});

// Function to add a user
async function addUser(userId: string) {
  try {
    console.log("adding user: ", userId);
    const user = await Users.create({ id: userId });``
    console.log('User added:', user.toJSON());
  } catch (error) {
    console.error('Error adding user:', error);
  }
}

// Function to remove a user
async function removeUser(userId: string) {
  try {
    const user = await Users.findOne({ where: { id: userId } });
    if (user) {
      await user.destroy();
      console.log('User removed:', user.toJSON());
    } else {
      console.log('User not found.');
    }
  } catch (error) {
    console.error('Error removing user:', error);
  }
}

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
    } else {
      console.log('No users found.');
      return undefined;
    }
  } catch (error) {
    console.error('Error removing random user:', error);
    return undefined;
  }
}

(async () => {
  await sequelize.sync();
})();

export { sequelize, addUser, removeUser, removeRandomUser };
