import { db } from "@/db";

export type Task = {
  id: number;
  task: string;
  created: Date;
};

let createTaskQuery = db.query(`insert into tasks (task) values (?)`);
export const createTask = (task: string) => createTaskQuery.run(task);

let listTasksQuery = db.query<Task, []>(
  `select * from tasks order by created desc`
);
export const listTasks = () => listTasksQuery.all();

let deleteTaskQuery = db.query(`delete from tasks where id = ?`);
export const deleteTask = (id: number) => deleteTaskQuery.run(id);
