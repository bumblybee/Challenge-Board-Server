const { CustomError } = require("../handlers/errorHandlers");
const { logger } = require("../handlers/logger");

const Question = require("../db").Question;
const Comment = require("../db").Comment;
const User = require("../db").User;

exports.createComment = async (req, res) => {
  const { body } = req.body;
  const { id: questionId } = req.params;
  const { id: userId } = req.token.data;
  const comment = { body, questionId, userId, isAnswer: false };

  const createdComment = await Comment.create(comment);

  logger.info(`User ${userId} posted comment ${createdComment.id}: ${body}`);

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
  const { body, userId, questionId } = req.body;

  if (id === userId) {
    const updatedComment = await Comment.update(
      { body: body },
      { where: { id: req.params.id } }
    );

    logger.info(`User ${userId} updated comment ${updatedComment.id}: ${body}`);

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
  }
};

exports.deleteComment = async (req, res) => {
  const deletedComment = await Comment.destroy({
    where: { id: req.params.commentId },
  });

  logger.info(`Teacher deleted comment ${req.params.commentId}`);

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
  // throw new CustomError("server.failed");
  const { commentId, questionId } = req.params;
  console.log(req.token.data);
  const selectedAnswer = await Comment.update(
    { isAnswer: true },
    { where: { id: commentId }, returning: true, plain: true }
  );

  const updatedQuestion = await Question.update(
    { isAnswered: true },
    { where: { id: questionId }, returning: true, plain: true }
  );

  logger.info(
    `Teacher ${req.token.data.username} promoted comment ${commentId} to answer.`
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

  logger.info(
    `Teacher ${req.token.data.username} demoted comment ${commentId} from answer.`
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
