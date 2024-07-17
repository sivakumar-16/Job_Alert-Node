import path from "path";
import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from 'dotenv';


dotenv.config();
console.log('password',process.env.PASSWORD);

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password:"1609",
  database: "jobs",
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
