const Project = require("../db").Project;
const { CustomError } = require("../handlers/errorHandlers");

exports.submitProject = async (req, res) => {
  const { githubLink, additionalLink, comment } = req.body;
  const { id: userId } = req.token.data;
  const project = { githubLink, additionalLink, comment, userId };
  //TODO: validate links are url
  const newProject = await Project.create(project);

  if (newProject) {
    //TODO: Send email confirmation
    res.status(200).json(newProject);
  } else {
    throw new CustomError("post.failed", "ProjectError", 500);
  }
};

exports.editProject = async (req, res) => {
  const { id: id } = req.token.data;
  const { githubLink, additionalLink, comment, userId } = req.body;
  if (userId === id) {
    const project = await Project.update(
      {
        githubLink: githubLink,
        additionalLink: additionalLink,
        comment: comment,
      },
      { where: { id: req.params.id } }
    );

    if (project) {
      res.status(200).json(project);
    } else {
      throw new CustomError("post.failed", "ProjectError", 500);
    }
  }
};
