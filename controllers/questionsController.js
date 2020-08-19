const Question = require("../db").Question;
const User = require("../db").User;
const Comment = require("../db").Comment;

// To add isAnswered to question
// Question.update({ isAnswered: true }, { where: { id: req.params.id} });

// Question.destroy({ where: { id: 3 } });
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
  // console.log(questions);
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
    const { title, body, isAnswered } = req.body;
    const { id: userId } = req.token.data;
    const newQuestion = {
      title,
      body,
      isAnswered,
      userId,
    };
    await Question.create(newQuestion);

    const createdQuestion = {
      title: newQuestion.title,
      body: newQuestion.body,
      isAnswered: newQuestion.isAnswered,
    };
    res.json(createdQuestion);
  } catch (error) {
    console.log(error);
  }
};

exports.createComment = async (req, res) => {
  try {
    const { body, isAnswer } = req.body;
    const { id: questionId } = req.params;
    const { id: userId } = req.token.data;
    const comment = { body, isAnswer, questionId, userId };

    await Comment.create(comment);
    res.json({ body, isAnswer });
  } catch (err) {
    console.log(err);
  }
};

exports.selectAnswer = async (req, res) => {
  res.json({ message: "selected answer" });
};

//TODO: Set isAnswered default to false and commentCount 0
