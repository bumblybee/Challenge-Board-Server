const Question = require("../db").Question;
const User = require("../db").User;
//TODO: set up route for thread id
exports.getQuestions = async (req, res) => {
  //Find all questions and sort by newest
  const questions = await Question.findAll({
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: User,
        attributes: ["username"],
      },
    ],
  });
  console.log(questions);
  res.json(questions);
};

exports.getQuestion = async (req, res) => {
  const { id } = req.params;
  const questionId = await Question.findOne({
    where: { id: id },
  });
  const question = questionId.question;
  console.log(question);

  res.json({
    question,
    comments: [
      {
        username: "Sam Hill",
        comment: `You're seeing question thread ${req.params.id}`,
        chosenAnswer: false,
        createdAt: "2020-08-10T10:07:47.988-05",
      },
      {
        username: "Molly Brown",
        comment: "I think I've done the same thing, funny.",
        chosenAnswer: false,
        createdAt: "2020-08-10T14:09:47.988-05",
      },
      {
        username: "Mark Jones",
        comment:
          "Grab the input value with event.target and store it in state.",
        chosenAnswer: true,
        createdAt: "2020-08-09T14:07:47.988-05",
      },
    ],
  });
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

//TODO: Set isAnswered default to false and commentCount 0
