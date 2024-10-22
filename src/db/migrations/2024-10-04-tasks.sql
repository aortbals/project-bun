CREATE TABLE IF NOT EXISTS tasks(
  id integer PRIMARY KEY autoincrement,
  task text NOT NULL,
  created text DEFAULT CURRENT_TIMESTAMP)
