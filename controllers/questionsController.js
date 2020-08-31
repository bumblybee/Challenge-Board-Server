const Question = require("../db").Question;
const User = require("../db").User;
const Comment = require("../db").Comment;

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
  try {
    const { title, body } = req.body;
    const { id: userId } = req.token.data;
    const newQuestion = {
      title,
      body,
      userId,
      isAnswered: false,
    };
    const question = await Question.create(newQuestion);

    res.json(question);
  } catch (error) {
    console.log(error);
  }
};

exports.selectAnswer = async (req, res) => {
  try {
    //TODO: Check for already selected Answer and handle
    const { commentId, questionId } = req.params;

    const answer = await Comment.update(
      { isAnswer: true },
      { where: { id: commentId } }
    );
    const answered = await Question.update(
      { isAnswered: true },
      { where: { id: questionId } }
    );
    res.status(201).json({ message: `updated:`, answer, answered });
  } catch (err) {
    res.status(500).json({ error: "selectAnswer.error" });
    //TODO: have error handler handle
  }
};

exports.editQuestion = async (req, res) => {
  //TODO: handle error
  const id = req.token.data.id;
  const { title, body, userId } = req.body;

  if (id === userId) {
    const updatedQuestion = Question.update(
      { body: body, title: title },
      { where: { id: req.params.id } }
    );
    res.status(201).json(updatedQuestion);
  }
};

exports.deleteQuestion = async (req, res) => {
  await Question.destroy({ where: { id: req.params.id } });
  res.json({ message: `Question ${req.params.id} deleted` });
};
