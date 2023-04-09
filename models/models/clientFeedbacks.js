module.exports = function (sequelize, DataTypes) {
    const clientFeedbacks = sequelize.define('clientFeedbacks', {
      id: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING(20),
        allowNull: false
      },
      email: {
        type: DataTypes.STRING(20),
        allowNull: true
      },
      feedback: {
        type: DataTypes.STRING(),
        allowNull: false
      },
      image: {
        type: DataTypes.STRING(20),
        allowNull: false
      }
    }, {
      tableName: 'clientFeedbacks',
    });
  
    clientFeedbacks.prototype.toJSON = function () {
      const values = Object.assign({}, this.get());
      return values;
    };
    return clientFeedbacks;
  };