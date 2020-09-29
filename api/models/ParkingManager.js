/**
 * ParkingManager.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
    tableName : 'parking_manager',
    attributes: {
      name: {
        type: 'string' ,
        columnName: 'name',
      },
      isDeleted: {
        type: 'ref',
        columnType : 'tinyint',
        columnName: 'is_deleted',
        defaultsTo : 0
      },
  
    },
  };
  