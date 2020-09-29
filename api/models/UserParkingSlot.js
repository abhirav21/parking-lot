/**
 * UserParkingSlot.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
    tableName : 'user_parking_slot',
    attributes: {
      parkingslotId: {
        model: 'ParkingSlot',
        columnName: 'parkingslot_id',
      },
      userId: {
        type: 'ref',
        columnName: 'user_id',
        columnType: 'int'
      },
      completedAt: {
        columnName: 'completed_at',
        type : 'ref',
        columnType : 'datetime'
      },
      isDeleted: {
        type: 'ref',
        columnType : 'tinyint',
        columnName: 'is_deleted',
        defaultsTo : 0
      },
  
    },
  };
  