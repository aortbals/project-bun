import { db } from "@/db";

if (process.argv.length < 3) {
  console.error("Error: No SQL file specified.");
  console.error("Usage: bun migrate <path_to_sql_file>");
  process.exit(1);
}

const filePath = process.argv[2];

try {
  const fileContents = await Bun.file(filePath).text();
  await db.run(fileContents);
  console.log("Migration completed successfully.");
} catch (error) {
  console.error(`Error: Failed to read or execute the SQL file.`);
  console.error(error);
  process.exit(1);
}
