const express = require('express');
const router = express.Router();

// Import controllers
const changeFan = require('../controllers/changeFan.controller');
const changeAir = require('../controllers/changeAir.controller');
const changeLamp = require('../controllers/changeLamp.controller');
const topLastSensor = require('../controllers/topLastSensor.controller');
const getHistoryAction = require('../controllers/getHistoryAction.controller');
const getAllSenSor = require('../controllers/getAllSenSor.controller');

/**
 * @swagger
 * tags:
 *   - name: Fan
 *     description: API endpoints for managing fan status
 *   - name: Air
 *     description: API endpoints for managing air conditioner status
 *   - name: Lamp
 *     description: API endpoints for managing lamp status
 *   - name: Sensor
 *     description: API endpoints for retrieving sensor data
 */

/**
 * @swagger
 * /api/v1/fan/status:
 *   post:
 *     tags:
 *       - Fan
 *     summary: Change the status of the fan
 *     description: This endpoint changes the status of the fan by sending a command via MQTT and waits for a response to confirm the change.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               state:
 *                 type: string
 *                 enum:
 *                   - on
 *                   - off
 *                 example: 'on'
 *     responses:
 *       200:
 *         description: Fan status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fanState:
 *                   type: string
 *                   example: 'on'
 *       400:
 *         description: Bad request - Invalid state provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Invalid state'
 *       500:
 *         description: Internal server error - Failed to change Fan state
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Failed to change Fan state'
 */
router.post('/api/v1/fan/status', changeFan);
/**
 * @swagger
 * /api/v1/air/status:
 *   post:
 *     tags:
 *       - Air
 *     summary: Change the status of the air conditioner
 *     description: This endpoint changes the status of the air conditioner by sending a command via MQTT and waits for a response to confirm the change.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               state:
 *                 type: string
 *                 enum:
 *                   - on
 *                   - off
 *                 example: 'on'
 *     responses:
 *       200:
 *         description: Air conditioner status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 airState:
 *                   type: string
 *                   example: 'on'
 *       400:
 *         description: Bad request - Invalid state provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Invalid state'
 *       500:
 *         description: Internal server error - Failed to change air conditioner state
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Failed to change air conditioner state'
 */

router.post('/api/v1/air/status', changeAir);
/**
 * @swagger
 * /api/v1/lamp/status:
 *   post:
 *     tags:
 *       - Lamp
 *     summary: Change the status of the lamp
 *     description: This endpoint changes the status of the lamp by sending a command via MQTT and waits for a response to confirm the change.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               state:
 *                 type: string
 *                 enum:
 *                   - on
 *                   - off
 *                 example: 'on'
 *     responses:
 *       200:
 *         description: Lamp status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 lampState:
 *                   type: string
 *                   example: 'on'
 *       400:
 *         description: Bad request - Invalid state provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Invalid state'
 *       500:
 *         description: Internal server error - Failed to change Lamp state
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Failed to change Lamp state'
 */
router.post('/api/v1/lamp/status', changeLamp);

/**
 * @swagger
 * /api/v1/top-last-sensor:
 *   get:
 *     tags:
 *       - Sensor
 *     summary: Get the most recent sensor data
 *     description: Retrieves the most recent sensor data.
 *     responses:
 *       200:
 *         description: An array of the most recent sensor data entries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: '66cdabba0b6387575f6039d5'
 *                   temperature:
 *                     type: number
 *                     example: 32.3
 *                   humidity:
 *                     type: number
 *                     example: 80
 *                   light:
 *                     type: number
 *                     example: 0
 *                   date:
 *                     type: string
 *                     format: date-time
 *                     example: '2024-08-27T10:34:34.426Z'
 *                   id:
 *                     type: number
 *                     example: 16695
 *                   __v:
 *                     type: number
 *                     example: 0
 *       500:
 *         description: Internal server error
 */
router.get('/api/v1/top-last-sensor', topLastSensor.topLastSensor);

/**
 * @swagger
 * /api/v1/history-action:
 *   get:
 *     tags:
 *       - Sensor
 *     summary: Get history of actions
 *     description: Retrieves the history of actions performed with pagination.
 *     responses:
 *       200:
 *         description: List of actions performed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalActions:
 *                   type: integer
 *                   example: 337
 *                 totalPages:
 *                   type: integer
 *                   example: 34
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 *                 actions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: '66cda9af630dc3f9697df951'
 *                       sensorName:
 *                         type: string
 *                         example: 'Đèn'
 *                       action:
 *                         type: string
 *                         example: 'Tắt'
 *                       date:
 *                         type: string
 *                         format: date-time
 *                         example: '2024-08-27T10:25:51.084Z'
 *                       action_id:
 *                         type: integer
 *                         example: 339
 *                       __v:
 *                         type: integer
 *                         example: 0
 *       500:
 *         description: Internal server error
 */


router.get('/api/v1/history-action', getHistoryAction);
/**
 * @swagger
 * /api/v1/sensors:
 *   get:
 *     tags:
 *       - Sensor
 *     summary: Get all sensor data
 *     description: Retrieves all sensor data with pagination.
 *     responses:
 *       200:
 *         description: List of all sensor data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 *                 totalPages:
 *                   type: integer
 *                   example: 1004
 *                 totalResults:
 *                   type: integer
 *                   example: 10034
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: '66cdabba0b6387575f6039d5'
 *                       temperature:
 *                         type: number
 *                         example: 32.3
 *                       humidity:
 *                         type: number
 *                         example: 80
 *                       light:
 *                         type: number
 *                         example: 0
 *                       date:
 *                         type: string
 *                         format: date-time
 *                         example: '2024-08-27T10:34:34.426Z'
 *                       id:
 *                         type: integer
 *                         example: 16695
 *                       __v:
 *                         type: number
 *                         example: 0
 *       500:
 *         description: Internal server error
 */
router.get('/api/v1/sensors', getAllSenSor);

module.exports = router;
