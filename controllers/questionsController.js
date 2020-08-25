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
        attributes: ["username"],
      },
      {
        model: Comment,
        include: [{ model: User, attributes: ["username"] }],
      },
    ],
  });

  // console.log(question);

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
  //TODO: Check if right user's question
  const updatedQuestion = await Question.update(
    { body: req.body.body, title: req.body.title },
    { where: { id: req.params.id } }
  );
  console.log(req.body);
};

exports.deleteQuestion = async (req, res) => {
  await Question.destroy({ where: { id: req.params.id } });
  res.json({ message: `Question ${req.params.id} deleted` });
};
