module.exports = ( sequelize, DataTypes ) => {
  return sequelize.define( 'tb_branch_share', {
    shareId : {
      type: DataTypes.STRING(5),
      allowNull: false,
      primaryKey : true,
      comment : "공유 ID"
    },
    brcofcId : {
      type: DataTypes.STRING(5),
      allowNull: false,
      primaryKey : true,
      comment : "지점 ID"
    },
    shareDelayTime : {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment : "공유 지연 시간"
    }
  },
  {
      timestamps: true,
  });
};
