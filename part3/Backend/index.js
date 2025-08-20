const express = require("express");
const morgan = require("morgan");
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

morgan.token("body", (req) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

let persons= [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const myId = request.params.id;
  const personData = persons.find((p) => p.id === myId);
  if (personData) {
    response.json(personData);
  } else {
    response.status(404).end();
  }
});

app.get("/info", (request, response) => {
  const count = persons.length;
  const date = new Date();
  response.send(`
    <p>Phonebook has info for ${count} people</p>
    <p>${date}</p>
  `);
});

app.delete("/api/persons/:id", (request, response) => {
  const myId = request.params.id;
  persons = persons.filter((p) => p.id !== myId);
  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const postingData = request.body;

  if (!postingData.name || !postingData.number) {
    return response.status(400).json({ error: "name or number is missing" });
  }

  if (persons.some((p) => p.name === postingData.name)) {
    return response.status(400).json({ error: "name must be unique" });
  }

  const newPerson = {
    id: Math.floor(Math.random() * 7000000).toString(),
    name: postingData.name,
    number: postingData.number,
  };

  persons.push(newPerson);
  response.json(persons);
});

const PORT = process.env.PORT?process.env.PORT: 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
