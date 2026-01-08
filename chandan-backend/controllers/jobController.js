const Job = require('../models/Job');
const axios = require('axios');

exports.createJob = async (req, res) => {
  try {
    const { taskName, payload, priority } = req.body;
    const newJob = await Job.create({ taskName, payload, priority });
    res.status(201).json(newJob);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllJobs = async (req, res) => {
  try {
    const { status, priority } = req.query;
    const whereClause = {};
    if (status) whereClause.status = status;
    if (priority) whereClause.priority = priority;

    const jobs = await Job.findAll({ 
      where: whereClause,
      order: [['createdAt', 'DESC']] 
    });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.runJob = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    
    if (job.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending jobs can be run' });
    }

    await job.update({ status: 'running' });
    res.json({ message: 'Job started', job });

    setTimeout(async () => {
      try {
        await job.update({ status: 'completed' });
        
        let cleanPayload = job.payload;
        if (typeof cleanPayload === 'string') {
          try {
            cleanPayload = JSON.parse(cleanPayload);
          } catch (e) {}
        }

        const webhookData = {
          jobId: job.id,
          taskName: job.taskName,
          priority: job.priority,
          payload: cleanPayload,
          completedAt: new Date()
        };

        await axios.post(process.env.WEBHOOK_URL, webhookData);
      } catch (webhookError) {
        console.error('Webhook failed:', webhookError.message);
      }
    }, 3000);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};