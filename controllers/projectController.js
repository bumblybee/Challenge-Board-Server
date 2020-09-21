const Project = require("../db").Project;
const User = require("../db").User;
const emailHandler = require("../handlers/emailHandler");
const { CustomError } = require("../handlers/errorHandlers");

exports.getProject = async (req, res) => {
  const { id } = req.token.data;
  const project = await Project.findOne({ where: { userId: id } });
  res.json({ project });
};

exports.submitProject = async (req, res) => {
  const { githubLink, additionalLink, comment, userData } = req.body;
  const { id: userId } = req.token.data;

  const { email, username } = userData;

  const project = { githubLink, additionalLink, comment, userId };

  if (userId) {
    const newProject = await Project.create(project);

    emailHandler.sendEmail({
      subject: "Project Submission Received!",
      filename: "submissionEmail",
      user: {
        username,
        email,
      },
    });
    res.status(200).json(newProject);
  } else {
    throw new CustomError("post.failed");
  }
};

exports.editProject = async (req, res) => {
  const { id: id } = req.token.data;
  const { githubLink, additionalLink, comment, userData } = req.body;
  const { id: userId, email, username } = userData;

  if (userId === id) {
    const editedProject = await Project.update(
      {
        githubLink: githubLink,
        additionalLink: additionalLink,
        comment: comment,
      },
      { where: { id: req.params.id } }
    );

    emailHandler.sendEmail({
      subject: "Your Edited Project Submission has Been Received!",
      filename: "submissionEmail",
      user: {
        username,
        email,
      },
    });
    res.status(201).json(editedProject);
  }
};
