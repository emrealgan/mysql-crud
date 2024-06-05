"use server"
import mysql from "mysql2/promise";
import { dbConfig } from "@/app/lib/dbConfig";

export default async function addData(sql, values) {
  const pool = mysql.createPool(dbConfig);
  try {
    await pool.execute(sql, values);
  } 
  catch (error) {
    if(error.errno == 1292){
      console.log("Boş değer eklenemez")
    }
  } 
  finally {
    pool.end();
  }
}