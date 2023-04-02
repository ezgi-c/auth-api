const { Sequelize } = require('sequelize');

const { makeAuthUser } = require('../auth/models/users-model');

const { makeBlog } = require('./blog.model');
const { todoModel } = require('./todo.model');

const DATABASE_URL =
  process.env.NODE_ENV === 'test'
    ? 'sqlite::memory:'
    : process.env.DATABASE_URL;

const CONNECTION_OPTIONS =
  process.env.NODE_ENV === 'test'
    ? {
        // logging: false,
      }
    : {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      };

const sequelize = new Sequelize(DATABASE_URL, CONNECTION_OPTIONS);

const AuthUser = makeAuthUser(sequelize);

const Blog = makeBlog(sequelize);

const Todo = todoModel(sequelize);

module.exports = {
  sequelize,
  AuthUser,
  Blog,
  Todo,
};
