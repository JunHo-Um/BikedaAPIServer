module.exports = ( sequelize, DataTypes ) => {
  return sequelize.define( 'tb_branch_point', {
    pointSeqNo : {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey : true,
      autoIncrement: true,
      comment : "포인트 일련번호"
    },
    brcofcId : {
      type: DataTypes.STRING(5),
      allowNull: false,
      primaryKey : true,
      comment : "지점 ID"
    },
    pointSeCd : {
      type: DataTypes.STRING(10),
      allowNull: false,
      comment : "포인트 구분 코드"
    },
    pointAmnt :{
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment : "포인트 금액"
    },
    pointNote : {
      type: DataTypes.STRING(1000),
      allowNull: false,
      comment : "포인트 메모"
    }
  },
  {
      timestamps: true,
  });
};
