const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('stores', 'root', null, {
  host: 'localhost',
  dialect: 'mysql',
  logging : false,
  timezone: '+07:00'
});

const connectionDB = async ()=> {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
}

connectionDB()