const { CustomError } = require("../handlers/errorHandlers");

const Question = require("../db").Question;
const Comment = require("../db").Comment;
const User = require("../db").User;

exports.createComment = async (req, res) => {
  const { body } = req.body;
  const { id: questionId } = req.params;
  const { id: userId } = req.token.data;
  const comment = { body, questionId, userId, isAnswer: false };

  const createdComment = await Comment.create(comment);

  const comments = await Comment.findAll({
    where: { questionId: questionId },
    order: [["createdAt", "ASC"]],
    include: [
      {
        model: User,
        attributes: ["username"],
      },
      {
        model: Question,
      },
    ],
  });

  res.status(200).json({ comments });
};

exports.editComment = async (req, res) => {
  const id = req.token.data.id;
  const { body, userId } = req.body;

  if (id === userId) {
    const updatedComment = await Comment.update(
      { body: body },
      { where: { id: req.params.id } }
    );

    res.status(201).json(updatedComment);
  }
};

exports.deleteComment = async (req, res) => {
  // throw new CustomError("post.failed", "AnswerError", 500);

  const deletedComment = await Comment.destroy({
    where: { id: req.params.commentId },
  });

  const comments = await Comment.findAll({
    where: { questionId: req.params.questionId },
    order: [["createdAt", "ASC"]],
    include: [
      {
        model: User,
        attributes: ["username"],
      },
      {
        model: Question,
      },
    ],
  });

  res.status(200).json({ comments });
};

exports.selectAnswer = async (req, res) => {
  //?? should I just be putting commentId in params and getting questionId from comment

  const { commentId, questionId } = req.params;

  const selectedAnswer = await Comment.update(
    { isAnswer: true },
    { where: { id: commentId }, returning: true, plain: true }
  );
  const updatedQuestion = await Question.update(
    { isAnswered: true },
    { where: { id: questionId }, returning: true, plain: true }
  );

  const comments = await Comment.findAll({
    where: { questionId: questionId },
    order: [["createdAt", "ASC"]],
    include: [
      {
        model: User,
        attributes: ["username"],
      },
      {
        model: Question,
      },
    ],
  });

  res.status(201).json({ comments });
};

exports.deselectAnswer = async (req, res) => {
  const { commentId, questionId } = req.params;

  const deselectedAnswer = await Comment.update(
    { isAnswer: false },
    { where: { id: commentId }, returning: true, plain: true }
  );

  const updatedQuestion = await Question.update(
    { isAnswered: false },
    { where: { id: questionId }, returning: true, plain: true }
  );

  const comments = await Comment.findAll({
    where: { questionId: questionId },
    order: [["createdAt", "ASC"]],
    include: [
      {
        model: User,
        attributes: ["username"],
      },
      {
        model: Question,
      },
    ],
  });
  res.status(201).json({ comments });
};
