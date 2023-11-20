import Queue from "bull";
import nodemailer from "nodemailer";
import JobModel from "../models/Jobs.js";

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "rajanouman2000@gmail.com",
    pass: "sdqfurnbzaqlflqj",
  },
});

export async function saveDataJobCollection(_id, to, subject, text) {
  try {
    const job = await JobModel.create({
      _id: parseInt(_id),
      to,
      subject,
      text,
    });
    console.log("Job data saved to MongoDB:", job);
    return job;
  } catch (error) {
    console.error("Error saving job data to MongoDB:", error.message);
    throw error; // Rethrow the error to propagate it up the call stack
  }
}

const emailVerification = new Queue("email", {
  limiter: {
    max: 10,
    duration: 1000,
  },
});

emailVerification.process(async (job) => {
  const { to, subject, text, html } = job.data;
  let _id = job.id;
  const mailOptions = {
    from: "rajanouman2000@gmail.com",
    to,
    subject,
    html,
  };

  try {
    // Save job data to MongoDB before processing
    await saveDataJobCollection(_id, to, subject, text);

    // Process the job (send email)
    await transport.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);

    transport.close();
    await JobModel.deleteOne({ _id: job.id });
  } catch (error) {
    console.error("Error processing email job:", error.message);
  }
});

export default emailVerification;
