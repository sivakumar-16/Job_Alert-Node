import path from "path";
import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: process.env.USERNAME,
  password: process.env.PASS,
  database: process.env.DB_NAME,
  entities: [path.join(process.cwd(), "src/Models/*.ts")],
  synchronize: true,
  logging: true,
  migrations: [],
  subscribers: [],
});

export const checkConnection = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Connected to the database");
  } catch (error) {
    console.error("Error connecting to the database", error);
  }
};
