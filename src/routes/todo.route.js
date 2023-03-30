const express = require('express');

const { Todo } = require('../models/index');

const { ensureRole, checkToken } = require('../auth/router');

const todoRoutes = express();

todoRoutes.use(checkToken);

// RESTful Route Declarations
todoRoutes.get(
  '/todo',
  ensureRole(['reader', 'writer', 'editor', 'admin']),
  getTodos
); // Retrieve All

todoRoutes.get(
  '/todo/:id',
  ensureRole(['reader', 'writer', 'editor', 'admin']),
  getTodo
); // Retrieve One

todoRoutes.post('/todo', ensureRole(['writer', 'editor', 'admin']), createTodo); // Create

todoRoutes.put('/todo/:id', ensureRole(['editor', 'admin']), updateTodo); // Update

todoRoutes.delete('/todo/:id', ensureRole(['admin']), deleteTodo); // Delete

async function getTodos(req, res, next) {
  const allTodos = await Todo.findAll();
  res.json(allTodos);
}

async function getTodo(req, res, next) {
  const id = req.params.id;
  const todo = await Todo.findOne({
    where: { id: id },
  });
  if (todo === null) {
    next();
  } else {
    const rawTodo = {
      id: todo.id,
      text: todo.text,
      assignee: todo.assignee,
      complete: todo.complete,
      difficulty: todo.difficulty,
    };
    res.json(rawTodo);
  }
}

async function createTodo(req, res, next) {
  const text = req.body.text;
  const assignee = req.body.assignee;
  const difficulty = req.body.difficulty;
  const complete = false;
  const todo = await Todo.create({
    text,
    assignee,
    difficulty,
    complete,
  });
  res.json(todo);
}

async function updateTodo(req, res, next) {
  const id = req.params.id;
  let todo = await Todo.findOne({ where: { id: id } });
  if (todo === null) {
    next();
  } else {
    // const title = req.body.title ?? blog.title;
    // const body = req.body.body ?? blog.body;
    const text = req.body.text ?? todo.text;
    const assignee = req.body.assignee ?? todo.assignee;
    const difficulty = req.body.difficulty ?? todo.difficulty;
    const complete = req.body.complete ?? todo.complete;

    let updatedTodo = {
        text,
        assignee,
        difficulty,
        complete,
    };

    todo = await todo.update(updatedTodo);

    res.json(todo);
  }
}

async function deleteTodo(req, res, next) {
  const id = req.params.id;
  const todo = await Todo.findOne({ where: { id: id } });
  if (todo === null) {
    next();
  } else {
    await todo.destroy();
    res.json({});
  }
}

module.exports = {
  todoRoutes,
};
