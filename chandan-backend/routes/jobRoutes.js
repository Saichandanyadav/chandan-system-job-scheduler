const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');

router.post('/jobs', jobController.createJob);
router.get('/jobs', jobController.getAllJobs);
router.get('/jobs/:id', jobController.getJobById);
router.post('/run-job/:id', jobController.runJob);

router.post('/webhook-test', (req, res) => {
  console.log('--- Local Webhook Received ---');
  console.log('Payload:', JSON.stringify(req.body, null, 2)); 
  res.status(200).json({ message: 'Webhook received successfully' });
});

module.exports = router;