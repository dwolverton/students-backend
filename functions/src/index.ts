import * as functions from 'firebase-functions';
import express from 'express';
import cors from 'cors';
import exampleRoutes from './routes/example';
import studentsRoutes from './routes/students';

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", exampleRoutes);
app.use("/", studentsRoutes);

export const api = functions.https.onRequest(app);