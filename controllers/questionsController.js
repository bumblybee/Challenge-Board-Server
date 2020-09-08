const Question = require("../db").Question;
const User = require("../db").User;
const Comment = require("../db").Comment;
const { CustomError } = require("../handlers/errorHandlers");
exports.getQuestions = async (req, res) => {
  //Find all questions and sort by newest
  const questions = await Question.findAll({
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: User,
        attributes: ["username"],
      },
      { model: Comment },
    ],
  });

  res.json(questions);
};

exports.getQuestion = async (req, res) => {
  const { id } = req.params;
  const question = await Question.findOne({
    where: { id: id },

    include: [
      {
        model: User,
        attributes: ["username", "id", "email"],
      },
      {
        model: Comment,
        include: [{ model: User, attributes: ["username", "email"] }],
      },
    ],
    //Order comments correctly so edited comments aren't pushed to end of list
    order: [[Comment, "createdAt", "ASC"]],
  });

  res.json({ question });
};

exports.createQuestion = async (req, res) => {
  const { title, body } = req.body;
  const { id: userId } = req.token.data;
  const newQuestion = {
    title,
    body,
    userId,
    isAnswered: false,
  };
  const question = await Question.create(newQuestion);

  if (question) {
    res.json(question);
  } else {
    throw new CustomError("post.failed", "QuestionError", 500);
  }
};

exports.editQuestion = async (req, res) => {
  const id = req.token.data.id;
  const { title, body, userId } = req.body;

  if (id === userId) {
    const updatedQuestion = await Question.update(
      { body: body, title: title },
      { where: { id: req.params.id } }
    );
    if (updatedQuestion) {
      res.status(201).json(updatedQuestion);
    } else {
      throw new Error("post.failed", "QuestionError", 500);
    }
  }
};

exports.deleteQuestion = async (req, res) => {
  const deletedQuestion = await Question.destroy({
    where: { id: req.params.id },
  });
  if (deletedQuestion) {
    res.json({ message: `Question ${req.params.id} deleted`, deletedQuestion });
  } else {
    throw new CustomError("delete.failed", "QuestionError", 500);
  }
};
