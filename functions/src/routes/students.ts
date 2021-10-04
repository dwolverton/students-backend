import express from 'express';
import { getClient } from '../db';
import { ObjectId } from 'mongodb';
import Student from '../model/Student';

const routes = express.Router();

routes.get("/students", async (req, res) => {
  const year = parseInt(req.query.year as string);

  const mongoQuery: any = {};
  // if a year was specified, add it to the mongo query
  if (!isNaN(year)) {
    mongoQuery.year = year; // { year: 2 }
  }

  try {
    const client = await getClient();
    const results = await client.db().collection<Student>('students').find(mongoQuery).toArray();
    res.json(results); // send JSON results
  } catch (err) {
    console.error("FAIL", err);
    res.status(500).json({message: "Internal Server Error"});
  }
});

routes.get("/students/search", async (req, res) => {
  const name = String(req.query.name || "");
  const minYear = parseInt(req.query.minYear as string);
  // possible query... { name: name, year: { $gte: minYear } }
  const query: any = {};
  if (name) {
    query.name = name;
  }
  if (!isNaN(minYear)) {
    query.year = { $gte: minYear };
  }

  try {
    const client = await getClient();
    const results = await client.db().collection<Student>('students').find(query).toArray();
    res.json(results); // send JSON results
  } catch (err) {
    console.error("FAIL", err);
    res.status(500).json({message: "Internal Server Error"});
  }
});

routes.get("/students/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const client = await getClient();
    const student = await client.db().collection<Student>('students').findOne({ _id : new ObjectId(id) });
    if (student) {
      res.json(student);
    } else {
      res.status(404).json({message: "Not Found"});
    }
  } catch (err) {
    console.error("FAIL", err);
    res.status(500).json({message: "Internal Server Error"});
  }
});

routes.post("/students", async (req, res) => {
  const student = req.body as Student;
  try {
    const client = await getClient();
    const result = await client.db().collection<Student>('students').insertOne(student);
    student._id = result.insertedId;
    res.status(201).json(student);
  } catch (err) {
    console.error("FAIL", err);
    res.status(500).json({message: "Internal Server Error"});
  }
});

routes.put("/students/:id", async (req, res) => {
  const id = req.params.id;
  const student = req.body as Student;
  delete student._id;
  try {
    const client = await getClient();
    const result = await client.db().collection<Student>('students').replaceOne({ _id: new ObjectId(id) }, student);
    if (result.modifiedCount === 0) {
      res.status(404).json({message: "Not Found"});
    } else {
      student._id = new ObjectId(id);
      res.json(student);
    }
  } catch (err) {
    console.error("FAIL", err);
    res.status(500).json({message: "Internal Server Error"});
  }
});

routes.delete("/students/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const client = await getClient();
    const result = await client.db().collection<Student>('students').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      res.status(404).json({message: "Not Found"});
    } else {
      res.status(204).end();
    }
  } catch (err) {
    console.error("FAIL", err);
    res.status(500).json({message: "Internal Server Error"});
  }
});

export default routes;