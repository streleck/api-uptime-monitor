const path = require('path');

const express = require('express');


const viewDetail = require('./controllers/viewDetail');
const viewAddApp = require('./controllers/viewAddApi');

const addApi = require('./controllers/addNewApi');
const initialTestApi = require('./controllers/initialTestApi');

const router = express.Router();


router.get('/', require('./controllers/viewOverview'));
router.get('/details/:id', viewDetail);
router.get('/add', viewAddApp);

router.post('/add-api', addApi);
router.post('/initial-test', initialTestApi);


module.exports = router;