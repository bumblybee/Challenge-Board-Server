const Project = require("../db").Project;
const { CustomError } = require("../handlers/errorHandlers");

exports.submitProject = async (req, res) => {
  throw new CustomError("post.failed", "ProjectError", 500);
  const { githubLink, additionalLink, comment } = req.body;
  const { id: userId } = req.token.data;
  const project = { githubLink, additionalLink, comment, userId };

  const newProject = await Project.create(project);

  if (newProject) {
    //TODO: Send email confirmation
    res.status(200).json(newProject);
  } else {
    throw new CustomError("post.failed", "ProjectError", 500);
  }
};

exports.editProject = async (req, res) => {
  //TODO: validate links are url
  try {
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
      }
    }
  } catch (err) {
    console.log(err);
  }
};
