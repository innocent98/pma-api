const router = require("express").Router();
const Job = require("../models/Job");
const Users = require("../models/Users");
const Models = require("../models/Models");
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./jwt");
const Conversation = require("../models/Conversation");
const notification = require("../services/notifications");
const { jobApply } = require("../config/jobApply");
const Client = require("../models/Client");

// post a new job
router.post("/post-job", verifyTokenAndAuthorization, async (req, res) => {
  const user = await Users.findById(req.user.id);

  if (user) {
    try {
      const newJob = new Job({
        postBy: user.id,
        title: req.body.title,
        desc: req.body.desc,
        type: req.body.type,
        payMoreDetails: req.body.payMoreDetails,
        location: req.body.location,
        country: req.body.country,
        state: req.body.state,
        photos: req.body.photos,
        paymentInfo: req.body.paymentInfo,
        // product: req.body.product,
        gender: req.body.gender,
        price: req.body.price,
        age: req.body.age,
        height: req.body.height,
        expire: req.body.expire,
      });
      if (newJob.photos) {
        await newJob.updateOne({ $push: { photos: req.body.photos } });
      }
      await newJob.save();
      res.status(200).json("Job posted successfully.");
      // console.log(newJob)
    } catch (err) {
      res.status(500).json("Connection error!");
    }
  } else {
    res.status(400).json("Oops! An error occured");
  }
});

// get all jobs posted
router.get("/jobs/all", async (req, res) => {
  const jobs = await Job.find();
  try {
    if (jobs.length > 0) {
      res.status(200).json(jobs);
    } else {
      res.status(400).json("No jobs found!");
    }
  } catch (err) {
    res.status(500).json("Connection error!");
  }
});

// get jobs posted
router.get("/jobs", verifyTokenAndAuthorization, async (req, res) => {
  const user = await Users.findById(req.user.id);
  const jobs = await Job.find({ postBy: user.id });
  try {
    if (jobs.length > 0) {
      res.status(200).json(jobs);
    } else {
      res.status(400).json("No jobs found!");
    }
  } catch (err) {
    res.status(500).json("Connection error!");
  }
});

// get a single job
router.get("/job/:id", async (req, res) => {
  const job = await Job.findById(req.params.id);
  try {
    if (job) {
      res.status(200).json(job);
    } else {
      res.status(404).json("Job not found!");
    }
  } catch (err) {
    res.status(500).json("Connection error!");
  }
});

// delete a job by the admin
router.delete("/job/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (job) {
      res.status(200).json("Job deleted successfully");
    } else {
      res.status(404).json("Not found, job might have been recently deleted!");
    }
  } catch (err) {
    res.status(500).json("Connection error!");
  }
});

// job application by model
router.post("/job/apply/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const model = await Models.findOne({ uuid: req.user.id });
    const job = await Job.findById(req.params.id);
    const client = await Client.findOne({ uuid: job.postBy });

    if (job) {
      await job.updateOne({ $push: { applied: model.uuid } });
      const newConversation = new Conversation({
        sender: model.uuid,
        receiver: job.postBy,
      });
      await newConversation.save();

      await notification.sendNotification({
        notification: {},
        notTitle:
          model.fullName +
          " applied for the job you posted, you both can now start a conversation. Go to conversation page to start a conversation",
        notId: job.postBy,
        notFrom: model.uuid,
      });
      console.log(client.email);
      jobApply((modelName = model.fullName), (clientName = client.email));
      res
        .status(200)
        .json(
          "You have successfully applied for this job. You can now start conversation with the jobber."
        );
    }
  } catch (err) {
    res.status(500).json("Connection error!");
  }
});

// update job availability
router.put(
  "/job/availability/:id",
  verifyTokenAndAuthorization,
  async (req, res) => {
    try {
      const user = await Users.findById(req.user.id);
      if (user) {
        const job = await Job.findByIdAndUpdate(
          req.params.id,
          { $set: req.body },
          { new: true }
        );
        if (job) {
          res.status(200).json("Job status updated!");
        } else res.status(400).json("An error occured!");
      } else {
        res
          .status(403)
          .json("You do not have permission to perform this operation!");
      }
    } catch (err) {
      res.status(500).json("Connection error!");
    }
  }
);

module.exports = router;
