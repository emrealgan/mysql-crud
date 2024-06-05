"use server"
import mysql from "mysql2/promise";
import { dbConfig } from "@/app/lib/dbConfig";

export default async function deleteData(sql, values) {
  const pool = mysql.createPool(dbConfig);
  try {
    await pool.execute(sql, values)
  } catch (error) {
    if (error.errno == 1451) {
      //alert("Kullanılan foreign key silinemez")
      console.log("Kullanılan foreign key silinemez")
    }
    return { success: false, error: "An unexpected error occurred" };
  } finally {
    pool.end();
  }
}
