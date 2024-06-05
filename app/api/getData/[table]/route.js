"use strict"
import { dbConfig } from "@/app/lib/dbConfig";
import mysql from "mysql2/promise";

async function tableExists(table) {
  const pool = mysql.createPool(dbConfig);
  const [rows] = await pool.execute(`SHOW TABLES LIKE '${table}'`);
  pool.end()
  return rows.length > 0;
}

export async function GET(req, {params}) {
  const pool = mysql.createPool(dbConfig);
  try {
    const tableName = params.table;
    const tableExistsInDB = await tableExists(tableName);
      if (!tableExistsInDB) {
          throw new Error('Invalid table name');
      }
      
    const sql = `SELECT * FROM \`${tableName}\``
    const [rows] = await pool.execute(sql);
    return Response.json({ rows });
  } 
  catch (error) {
    console.error('Database query error:', error); 
    return Response.json({ message:`Error retrieving data ` });
  } 
  finally {
    pool.end();
  }
}
