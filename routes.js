const path = require('path');

const express = require('express');


const viewDetail = require('./controllers/viewDetail');
const viewGetError = require('./controllers/viewGetError');
const viewPostError = require('./controllers/viewPostError');
const viewAddApp = require('./controllers/viewAddApi');

const addApi = require('./controllers/addNewApi');
const addEmailRecipient = require('./controllers/addEmailRecipient');

const router = express.Router();


router.get('/', require('./controllers/viewOverview'));
router.get('/details/:id/getError/:errorIndex', viewGetError);
router.get('/details/:id/postError/:errorIndex', viewPostError);
router.get('/details/:id', viewDetail);
router.get('/add', viewAddApp);

router.post('/add', addApi);
router.post('/addEmail', addEmailRecipient);

module.exports = router;
