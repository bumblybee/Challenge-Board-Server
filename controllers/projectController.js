const Project = require("../db").Project;
const User = require("../db").User;
const emailHandler = require("../handlers/emailHandler");
const { CustomError } = require("../handlers/errorHandlers");

exports.submitProject = async (req, res) => {
  const { githubLink, additionalLink, comment, userData } = req.body;

  const { id: userId, email, username } = userData;

  const project = { githubLink, additionalLink, comment, userId };

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
