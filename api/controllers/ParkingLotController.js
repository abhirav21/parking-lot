/**
 * ParkingLotController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const moment = require('moment');
module.exports = (function () {

    async function createParkingLot(req, res) {
        // parkingManagerId,totalSlots
        if (req.body.parkingManagerId && req.body.totalSlots) {
            await ParkingLot.create({
                ...req.body
            }).fetch().then(parkinglotData => {
                const parkingslotsArray = [];

                for (var i = 1; i <= parseInt(req.body.totalSlots); i++) {
                    const obj = {
                        parkinglotId: parkinglotData.id,
                        slotNumber: i,
                    }
                    parkingslotsArray.push(obj);
                }
                ParkingSlot.createEach(parkingslotsArray).then(parkingslotData => {
                    return resHandler.returnResponse({ resp: 'success', data: parkinglotData }, 200, res);
                }).catch(err => {
                    console.error(err);
                    return resHandler.returnResponsev1({}, 500, res, new resHandler.LFApiError('ERR_901', 'Internal error occurred.'));
                });
            }).catch(err => {
                console.error(err)
                return resHandler.returnResponsev1({}, 500, res, new resHandler.LFApiError('ERR_901', 'Internal error occurred.'));
            });
        } else {
            return resHandler.returnResponsev1(
                {},
                422,
                res,
                new resHandler.LFApiError('ERR_001')
            );
        }


    }

    async function getParkingLotStatus(req, res) {

        //params : parkinglotId
        if (req.query.parkinglotId) {
            ParkingSlot.find({
                parkinglotId: req.query.parkinglotId
            }).sort('id ASC').then(function (allslots) {
                return resHandler.returnResponse({ resp: 'success', status: allslots }, 200, res);
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
    async function getDashboard(req, res) {
        //params : parkingManagerId, date
        if (req.query.parkingManagerId && req.query.date) {
            const nativeQuery = `SELECT 
                            pl.parking_manager_id,
                            SUM(CEIL(TIME_TO_SEC(TIMEDIFF(ups.completed_at, ups.created_at)) / 3600)) AS 'hours',
                            SUM(CEIL(TIME_TO_SEC(TIMEDIFF(ups.completed_at, ups.created_at)) / 3600) * 10) AS 'fees',
                            COUNT(ups.id) AS 'vehicles'
                        FROM
                            parking_lot pl
                                JOIN
                            parking_slotS ps ON pl.id = ps.parkinglot_id
                                JOIN
                            user_parking_slot ups ON ps.id = ups.parkingslot_id
                        WHERE
                            pl.parking_manager_id = ${req.query.parkingManagerId}
                                AND DATE(ups.created_at) = DATE('${req.query.date}')
                        GROUP BY pl.parking_manager_id `;
            ParkingSlot.getDatastore().sendNativeQuery(nativeQuery, "").then(data => {
                return resHandler.returnResponse({ resp: 'success', dashboard: data.rows }, 200, res);
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


    return {
        createParkingLot: createParkingLot,
        getParkingLotStatus: getParkingLotStatus,
        getDashboard: getDashboard
    };

})();
