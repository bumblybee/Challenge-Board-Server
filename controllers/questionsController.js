const Question = require("../models/db").Question;

//TODO: set up route for thread id
exports.getQuestions = async (req, res) => {
  //Find all questions and sort by newest
  const questions = await Question.findAll({ order: [["createdAt", "DESC"]] });

  res.json(questions);
};

exports.getQuestion = async (req, res) => {
  const { id } = req.params;
  const questionId = await Question.findOne({
    where: { id: id },
  });
  const question = questionId.question;
  console.log(question);
  // const question = questionId.question;
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
    const {
      threadId,
      username,
      question,
      questionDetails,
      isAnswered,
      commentCount,
    } = req.body;
    const newQuestion = {
      threadId,
      username,
      question,
      questionDetails,
      isAnswered,
      commentCount,
    };
    await Question.create(newQuestion);
    res.json(newQuestion);
  } catch (error) {
    console.log(error);
  }
};

//TODO: Set isAnswered default to false and commentCount 0
