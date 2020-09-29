/**
 * ParkingSlot.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
    tableName : 'parking_slots',
    attributes: {
      parkinglotId: {
        model: 'ParkingLot',
        columnName: 'parkinglot_id',
      },
      slotNumber: {
        type: 'number',
        columnName: 'slot_number',
      },
      inUse: {
        columnName: 'in_use',
        type : 'ref',
        columnType : 'tinyint',
        defaultsTo : 0
      },
      slotMaintenance: {
        columnName: 'slot_maintenance',
        type : 'ref',
        columnType : 'tinyint',
        defaultsTo : 0
      },
      isDeleted: {
        type: 'ref',
        columnType : 'tinyint',
        columnName: 'is_deleted',
        defaultsTo : 0
      },
  
    },
  };
  