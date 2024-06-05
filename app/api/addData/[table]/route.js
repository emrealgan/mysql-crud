"use strict"
import { dbConfig } from "@/app/lib/dbConfig";
import mysql from "mysql2/promise";

export async function POST(req) {
  const pool = mysql.createPool(dbConfig);
  try {
    const body = await req.json();  
    const { sql, values } = body;  
    const result = await pool.execute(sql, values);
    return Response.json({ message: 'User added successfully', data: result });
  } 
  catch (error) {
    console.error('Database insert error:', error);
    return Response.json({ message: 'Error adding user' });
  } 
  finally {
    pool.end();
  }
}