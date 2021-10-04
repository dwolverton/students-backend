import express from 'express';

const routes = express.Router();

routes.get("/example", (req, res) => {
  res.json({ message: "Hello World!" });
});

routes.get("/example/time", (req, res) => {
  res.set('Cache-Control', 'public, max-age=20, s-maxage=40');
  res.json({ time: new Date() });
});

export default routes;