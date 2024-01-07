const express = require("express");
const app = express();
const morgan = require("morgan");
let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];
app.get("/", morgan("tiny"), (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

morgan.token("json", (req, res) => {
  if (req.body) {
    return JSON.stringify(req.body);
  }
  return "-";
});

app.use(morgan(":method :url :status :response-time ms - :json"));

app.use(express.json());

app.get("/api/persons", (request, response) => {
  response.json(persons);
});
app.get("/info", (request, response) => {
  const numberOfPersons = persons.length;
  const currentDate = new Date();
  const infoResponse = `
      <h1>Hello from info page</h1>
      <p>Phonebook has info for: ${numberOfPersons} people</p>
      <p>${currentDate.toDateString()}</p>
    `;

  response.send(infoResponse);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);

  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).send("No id found");
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const generateId = () => {
  const maxId = persons.length > 0 ? Math.floor(Math.random() * 1000) : 0;
  return maxId + 1;
};

app.post("/api/persons", (request, response) => {
    console.log(request.body);
  const body = request.body;
  
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number missing",
    });
  }

  let isNameSame = persons.some((person) => person.name === body.name);
  if (isNameSame) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }
  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  response.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
