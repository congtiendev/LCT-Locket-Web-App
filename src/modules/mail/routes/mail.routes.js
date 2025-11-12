const express = require('express');
const validate = require('@middlewares/validate.middleware');
const mailController = require('../controllers/mail.controller');
const { authenticate } = require('@middlewares/authenticate.middleware');
const { sendTestEmailSchema, sendEmailSchema } = require('../validators/mail.validator');

const router = express.Router();

// Verify SMTP connection
router.get('/verify', authenticate, mailController.verifyConnection);

// Send test email
router.post('/test', authenticate, validate(sendTestEmailSchema), mailController.sendTestEmail);

// Send custom email
router.post('/send', authenticate, validate(sendEmailSchema), mailController.sendEmail);

module.exports = router;
