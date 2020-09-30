const Question = require("../db").Question;
const User = require("../db").User;
const Comment = require("../db").Comment;
const { CustomError } = require("../handlers/errorHandlers");
const { logger } = require("../handlers/logger");

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
        include: [
          { model: User, attributes: ["username", "email"] },
          { model: Question },
        ],
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

  logger.info(
    `Successful Question Post - question id: ${question.id}, title: ${question.title}, user id: ${userId}, username: ${req.token.data.username}`
  );

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

  res.status(200).json({ questions });
};

exports.editQuestion = async (req, res) => {
  const id = req.token.data.id;
  const { title, body, userId } = req.body;

  if (id === userId) {
    const updatedQuestion = await Question.update(
      { body: body, title: title },
      { where: { id: req.params.id } }
    );

    logger.info(
      `Successful Question Edit - question id: ${req.params.id}, title: ${title}, user id: ${userId}, username: ${req.token.data.username}`
    );

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

    res.status(201).json({ questions });
  }
};

exports.editThreadQuestion = async (req, res) => {
  const id = req.token.data.id;
  const { title, body, userId } = req.body;

  if (id === userId) {
    const updatedThreadQuestion = await Question.update(
      { body: body, title: title },
      { where: { id: req.params.id } }
    );

    logger.info(
      `Successful Thread Question Edit - question id: ${req.params.id}, title: ${title}, user id: ${userId}, username: ${req.token.data.username}`
    );

    const question = await Question.findOne({
      where: { id: req.params.id },

      include: [
        {
          model: User,
          attributes: ["username", "id", "email"],
        },
        {
          model: Comment,
          include: [
            { model: User, attributes: ["username", "email"] },
            { model: Question },
          ],
        },
      ],

      order: [[Comment, "createdAt", "ASC"]],
    });

    res.status(201).json({ question });
  }
};

exports.deleteQuestion = async (req, res) => {
  const deletedQuestion = await Question.destroy({
    where: { id: req.params.id },
  });

  logger.info(
    `Successful Question Deletion - question id: ${req.params.id}, Teacher user id: ${req.token.data.id}, username: ${req.token.data.username}`
  );

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

  res.status(200).json({ questions });
};

exports.editAnswer = async (req, res) => {
  const editedQuestion = await Question.update(
    { isAnswered: false },
    { where: { id: req.params.id } }
  );

  logger.info(
    `Question Marked Unanswered - question id: ${req.params.id}, Teacher user id: ${req.token.data.id}, username: ${req.token.data.username}`
  );

  res.status(200).json("Question updated");
};
