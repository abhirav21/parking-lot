/**
 * ParkingLot.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
    tableName : 'parking_lot',
    attributes: {
      parkingManagerId: {
        type: 'ref' ,
        columnType: 'bigint',
        columnName: 'parking_manager_id',
      },
      totalSlots: {
        type: 'ref' ,
        columnType: 'int',
        columnName : 'total_slots'
      },
      isDeleted: {
        type: 'ref',
        columnType : 'tinyint',
        columnName: 'is_deleted',
        defaultsTo : 0
      },
  
    },
  };
  