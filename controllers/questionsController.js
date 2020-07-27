exports.getQuestions = (req, res) => {
  const thread = req.params.id;
  res.json([
    {
      user: {
        name: "Mark Hill",
      },
      createdAt: "07/16/2020",
      body:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellat accusamus neque laudantium tempora labore.",
      isAnswered: false,
      commentCount: 3,
      threadId: 1,
    },
    {
      user: {
        name: "Mark Hill",
      },
      createdAt: "07/16/2020",
      body:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellat accusamus neque laudantium tempora labore.",
      isAnswered: false,
      commentCount: 3,
      threadId: 1,
    },
    {
      user: {
        name: "Sara Jones",
      },
      createdAt: "07/15/2020",
      body:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellat accusamus neque laudantium dolorum tempora labore.",
      isAnswered: true,
      commentCount: 2,
      threadId: 2,
    },
    {
      user: {
        name: "Molly Brown",
      },
      createdAt: "07/14/2020",
      body:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellat accusamus neque laudantium dolorum tempora.",
      isAnswered: false,
      commentCount: 4,
      threadId: 3,
    },
    {
      user: {
        name: "Jon Smith",
      },
      createdAt: "07/14/2020",
      body:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellat neque laudantium dolorum tempora labore.",
      isAnswered: false,
      commentCount: 1,
      threadId: 4,
    },
    {
      user: {
        name: "Lucy Thompson",
      },
      createdAt: "07/13/2020",
      body:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellat accusamus neque laudantium dolorum tempora labore.",
      isAnswered: true,
      commentCount: 5,
      threadId: 5,
    },
    {
      user: {
        name: "Mark Hill",
      },
      createdAt: "07/12/2020",
      body:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellat accusamus neque laudantium dolorum tempora labore.",
      isAnswered: true,
      commentCount: 7,
      threadId: 6,
    },
  ]);
};

exports.getUsers = (req, res) => {
  res.json([
    {
      id: 1,
      name: "Mark Hill",
      username: "hill34",
    },
    {
      id: 2,
      name: "Sam Jones",
      username: "pizza55",
    },
    {
      id: 3,
      name: "Molly Brown",
      username: "simplesimon",
    },
    {
      id: 4,
      name: "Sara London",
      username: "bigben",
    },
  ]);
};