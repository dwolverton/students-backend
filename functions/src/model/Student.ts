import { ObjectId } from "mongodb";

export default interface Student {
  _id?: ObjectId;
  name: string;
  year: number;
  present: boolean;
}