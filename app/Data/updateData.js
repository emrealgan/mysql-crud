"use server"
import mysql from "mysql2/promise";
import { dbConfig } from "@/app/lib/dbConfig";

export default async function updateData(sql) {
  const pool = mysql.createPool(dbConfig);
  try {
    await pool.execute(sql);
  }
  catch (error) {
    console.error("Error updating data:", error);
  }
  finally {
    pool.end();
  }
}