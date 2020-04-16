module.exports = ( sequelize, DataTypes ) => {
  return sequelize.define( 'branch', {
    bsns_rgnmb : {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique; true,
    },
    nm : {
      type: DataTypes.STRING(30),
      allowNull: false
    },
  }, {
      timestamps: true,
  });
};
