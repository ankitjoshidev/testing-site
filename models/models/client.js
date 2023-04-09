module.exports = function (sequelize, DataTypes) {
    const client = sequelize.define('client', {
      id: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
      },
      first_name: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true
      },
      level: {
        type: DataTypes.INTEGER(),
        allowNull: true
      },
      last_name: {
        type: DataTypes.STRING(20),
        allowNull: false
      }
    }, {
      tableName: 'client',
    });
  
    client.prototype.toJSON = function () {
      const values = Object.assign({}, this.get());
      return values;
    };
    return client;
  };