const Project = require("../db").Project;

exports.submitProject = async (req, res) => {
  try {
    const { githubLink, additionalLink, comment } = req.body;
    const { id: userId } = req.token.data;
    const project = { githubLink, additionalLink, comment, userId };

    const newProject = await Project.create(project);
    //TODO: Send email confirmation
    res.status(200).json(newProject);
  } catch (err) {
    console.log(err);
  }
};
