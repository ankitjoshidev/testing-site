module.exports = function (sequelize, DataTypes) {
    const items = sequelize.define('items', {
      id: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING(20),
        allowNull: false
      },
      category: {
        type: DataTypes.STRING(20),
        allowNull: true
      },
      quantity: {
        type: DataTypes.STRING(20),
        allowNull: false
      }
    }, {
      tableName: 'items',
    });
  
    items.prototype.toJSON = function () {
      const values = Object.assign({}, this.get());
      return values;
    };
    return items;
  };