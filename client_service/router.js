const express = require("express");
const jwt = require("jsonwebtoken");

const auth_client = require("./auth_client");
const todo_client = require("./todo_client");

module.exports = (app) => {
  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: false,
    })
  );
  app.get("/test", (req, res) => {
    auth_client.test({}, (err, response) => {
      res.send(response);
    });
  });
  //AUTH ROUTES

  app.get("/auth/:id", (req, res) => {
    auth_client.getUser({ id: req.params.id }, (err, response) => {
      if (err) return res.status(400).send(err);
      return res.send(response);
    });
  });

  app.post("/auth/login", (req, res) => {
    auth_client.login(
      { email: req.body.email, password: req.body.password },
      (err, response) => {
        if (err) return res.status(400).send(err);
        return res.send(response);
      }
    );
  });

  app.post("/auth/register", (req, res) => {
    auth_client.register(
      {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      },
      (err, response) => {
        if (err) return res.status(400).send(err);
        return res.send(response);
      }
    );
  });

  app.put("/auth/update/:id", (req, res) => {
    auth_client.update(
      { id: req.params.id, username: req.body.username },
      (err, response) => {
        if (err) return res.status(400).send(err);
        return res.status(200).send(response);
      }
    );
  });

  app.post("/auth/verify", (req, res) => {
    auth_client.verify(
      {
        token: req.body.token,
      },
      (err, response) => {
        if (err) return res.status(400).send(err);
        return res.send(response);
      }
    );
  });

  // TOKEN TEST
  app.get("/token-test", (req, res) => {
    const token = req.header("x-auth-token");
    if (!token)
      return res.status(401).send("Access denied. No token provided.");
    const decoded = jwt.decode(token);
    res.send(decoded.username);
  });

  // TODO ROUTES
  app.get("/v1/todo", (req, res) => {
    todo_client.getAll({}, (err, response) => {
      if (err) return res.status(400).send(err);
      return res.send(response);
    });
    // res.send("helloWORLD");
  });

  app.post("/v1/todo", (req, res) => {
    const token = req.header("x-auth-token");
    if (!token)
      return res.status(401).send("Access denied. No token provided.");
    const decoded = jwt.decode(token);
    // res.send(req.body);
    todo_client.create(
      {
        title: req.body.title,
        description: req.body.description,
        end_date: req.body.end_date,
        username: decoded.username,
      },
      (err, response) => {
        if (err) return res.status(400).send(err);
        return res.send(response);
      }
    );
  });

  app.post("/v1/todo/:id", (req, res) => {
    todo_client.update({ todoId: req.params.id }, (err, response) => {
      if (err) return res.status(400).send(err);
      return res.send(response);
    });
  });

  app.put("/v1/todo/:id", (req, res) => {
    todo_client.edit(
      {
        todoId: req.params.id,
        title: req.body.title,
        description: req.body.description,
        end_date: req.body.end_date,
      },
      (err, response) => {
        if (err) return res.status(400).send(err);
        return res.send(response);
      }
    );
  });

  app.delete("/v1/todo/:id", (req, res) => {
    todo_client.delete({ todoId: req.params.id }, (err, response) => {
      if (err) return res.status(400).send(err);
      return res.send(response);
    });
  });
};
