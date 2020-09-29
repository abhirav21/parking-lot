/**
 * ParkingLotController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const moment = require('moment');

module.exports = (function () {

    async function parkUser(req, res) {
        //params : userId,parkinglotId
        if (req.body.userId && req.body.parkinglotId) {
            const nativeQuery = `SELECT 
                        id AS parkingslotId
                    FROM
                        parking_slots
                    WHERE
                        slot_number = (SELECT 
                                MIN(slot_number) AS slotNumber
                            FROM
                                parking_slots
                            WHERE
                                in_use = 0 AND parkinglot_id = ${req.body.parkinglotId}) AND slot_maintenance = 0 `;
            ParkingSlot.getDatastore().sendNativeQuery(nativeQuery, "").then(data => {
                if (data.rows[0] && data.rows[0].parkingslotId) {
                    const parkingslotId = data.rows[0].parkingslotId;

                    ParkingSlot.update({
                        id: parkingslotId,
                    })
                        .set({
                            inUse: 1,
                        }).fetch().then(async data => {
                            await UserParkingSlot.create({
                                userId: req.body.userId,
                                parkingslotId: parkingslotId
                            }).fetch().then(UserParkingSlot => {
                                return resHandler.returnResponse({ resp: 'success', data: UserParkingSlot }, 200, res);
                            }).catch(err => {
                                console.error(err)
                                return resHandler.returnResponsev1({}, 500, res, new resHandler.LFApiError('ERR_901', 'Internal error occurred.'));
                            });
                        }).catch(err => {
                            console.error(err)
                            return resHandler.returnResponsev1({}, 500, res, new resHandler.LFApiError('ERR_901', 'Internal error occurred.'));
                        });
                } else {
                    return resHandler.returnResponse({ resp: 'Parking slot not found !', }, 200, res);
                }
            })
        } else {
            return resHandler.returnResponsev1(
                {},
                422,
                res,
                new resHandler.LFApiError('ERR_001')
            );
        }
    }

    async function unparkUser(req, res) {
        //params : userId, parkingslotId
        if (req.body.userId && req.body.parkingslotId) {
            UserParkingSlot.update({
                userId: req.body.userId,
                parkingslotId: req.body.parkingslotId,
                completedAt: null
            })
                .set({
                    completedAt: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                }).fetch().then(UserParkingResource => {
                    if (UserParkingResource && UserParkingResource[0]) {
                        ParkingSlot.update({ id: req.body.parkingslotId, inUse: 1 }).set({ inUse: 0 }).then(data => {

                            var duration = moment.duration(moment(UserParkingResource[0].completedAt).diff(moment(UserParkingResource[0].createdAt)));
                            var hours = duration.asHours();

                            return resHandler.returnResponse({ resp: 'success', parkingFee: (10 * Math.ceil(hours)) }, 200, res);

                        }).catch(err => {
                            console.error(err)
                            return resHandler.returnResponsev1({}, 500, res, new resHandler.LFApiError('ERR_901', 'Internal error occurred.'));
                        });
                    }
                    else {
                        return resHandler.returnResponsev1({}, 500, res, new resHandler.LFApiError('ERR_901', 'Nothing to unpark !'));
                    }
                }).catch(err => {
                    console.error(err)
                    return resHandler.returnResponsev1({}, 500, res, new resHandler.LFApiError('ERR_901', 'Internal error occurred.'));
                });
        }
        else {
            return resHandler.returnResponsev1(
                {},
                422,
                res,
                new resHandler.LFApiError('ERR_001')
            );
        }
    }

    async function slotMaintenance(req, res) {
        //params :   id (parkingslotId), slotMaintenance 
        if (req.body.id && req.body.slotMaintenance) {
            ParkingSlot.find({
                id: req.body.id
            })
                .then(parkingSlotData => {
                    parkingSlotData = parkingSlotData[0];
                    if (req.body.slotMaintenance && req.body.slotMaintenance == '1') {
                        if (!parkingSlotData.inUse && !parkingSlotData.slotMaintenance) {
                            ParkingSlot.update({
                                id: req.body.id,
                            })
                                .set({
                                    slotMaintenance: req.body.slotMaintenance,
                                }).fetch().then(data => {
                                    return resHandler.returnResponse({ resp: 'success' }, 200, res);
                                }).catch(err => {
                                    console.error(err)
                                    return resHandler.returnResponsev1({}, 500, res, new resHandler.LFApiError('ERR_901', 'Internal error occurred.'));
                                });
                        }
                        else {
                            return resHandler.returnResponsev1({}, 500, res, new resHandler.LFApiError('ERR_901', 'Parking slot in use or slot already in maintenance'));
                        }
                    } else {
                        ParkingSlot.update({
                            id: req.body.id,
                        })
                            .set({
                                slotMaintenance: req.body.slotMaintenance,
                            }).fetch().then(data => {
                                return resHandler.returnResponse({ resp: 'success' }, 200, res);
                            }).catch(err => {
                                console.error(err)
                                return resHandler.returnResponsev1({}, 500, res, new resHandler.LFApiError('ERR_901', 'Internal error occurred.'));
                            });
                    }
                })
        }
        else {
            return resHandler.returnResponsev1(
                {},
                422,
                res,
                new resHandler.LFApiError('ERR_001')
            );
        }
    }

    return {
        parkUser: parkUser,
        unparkUser: unparkUser,
        slotMaintenance: slotMaintenance
    };

})();
