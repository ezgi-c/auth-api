const { DataTypes } = require('sequelize');

function todoModel(sequelize) {
  return sequelize.define('Todo', {
    text: DataTypes.STRING,
    assignee: DataTypes.STRING,
    complete: DataTypes.BOOLEAN,
    difficulty: DataTypes.INTEGER,
    id: {
        type: DataTypes.STRING,
        primaryKey: true
      },    // __v: DataTypes.NUMBER,
  });
}

module.exports = { todoModel };
