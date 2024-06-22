"use server"
import { query } from "@/app/lib/dbConnection";
import { NextResponse } from "next/server";

async function tableExists(table) {
  const [rows] = await query({
    query: `SHOW TABLES LIKE '${table}'`,
    values: []
  });
  if(rows.length > 0)
    return rows;
}

export async function GET(req, {params}) {
  try {
    const tableName = params.table;
    const tableExistsInDB = await tableExists(tableName);
      if (!tableExistsInDB) {
          throw new Error('Invalid table name');
      }
      
    const sql = `SELECT * FROM \`${tableName}\``
    const [rows] = await query({
      query: sql, 
      values: []
    });
    return NextResponse.json({ rows });
  } 
  catch (error) {
    console.error('Database query error:', error); 
    return NextResponse.json({ message:`Error retrieving data ` });
  } 
}
