const Project = require("../db").Project;
const User = require("../db").User;
const emailHandler = require("../handlers/emailHandler");
const { CustomError } = require("../handlers/errorHandlers");
const { logger } = require("../handlers/logger");

exports.getProject = async (req, res) => {
  const { id } = req.token.data;
  const project = await Project.findOne({ where: { userId: id } });
  res.json({ project });
};

exports.submitProject = async (req, res) => {
  const { githubLink, additionalLink, comment } = req.body;
  const { id: userId, email, username } = req.token.data;

  const project = { githubLink, additionalLink, comment, userId };

  if (userId) {
    const newProject = await Project.create(project);

    logger.info(
      `Successful Project Submission - user id: ${userId}, username: ${username}, project id: ${newProject.id}`
    );

    emailHandler.sendEmail({
      subject: "Project Submission Received!",
      filename: "submissionEmail",
      user: {
        username,
        email,
      },
    });

    emailHandler.sendEmail({
      subject: "Project Submission Received",
      filename: "studentSubmissionEmail",
      user: {
        username,
        userEmail: email,
        email: ["hesstjune@gmail.com", "jkoontz2010@gmail.com"],
        project,
      },
    });

    logger.info(
      `Project Submission Email Sent - user id: ${userId}, username: ${username}, email: ${email}`
    );

    res.status(200).json(newProject);
  } else {
    throw new CustomError("post.failed");
  }
};

exports.editProject = async (req, res) => {
  const { id: userId, email, username } = req.token.data;
  const { githubLink, additionalLink, comment } = req.body;

  const editedProject = await Project.update(
    {
      githubLink: githubLink,
      additionalLink: additionalLink,
      comment: comment,
    },
    { where: { id: req.params.id } }
  );

  const project = await Project.findOne({ where: { userId } });

  logger.info(
    `Successful Project Edit - user id: ${userId}, username: ${username}, project id: ${req.params.id}, project comment: ${comment}`
  );

  emailHandler.sendEmail({
    subject: "Your Edited Project Submission has Been Received!",
    filename: "submissionEmail",
    user: {
      username,
      email,
    },
  });

  emailHandler.sendEmail({
    subject: "Edited Project Submission Received",
    filename: "studentSubmissionEmail",
    user: {
      username,
      userEmail: email,
      email: ["hesstjune@gmail.com", "jkoontz2010@gmail.com"],
      project,
    },
  });

  logger.info(
    `Project Submission Email Sent - user id: ${userId}, username: ${username}, email: ${email}`
  );

  res.status(201).json(project);
};
