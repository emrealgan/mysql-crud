"use server"
import { query } from "@/app/lib/dbConnection";
import { NextResponse } from "next/server";

async function tableExists(table) {
  const [rows] = await query({
    query: `SHOW TABLES LIKE '${table}'`,
    values: [],
  });
  return rows.length > 0;
}

export async function DELETE(req, {params}) {
  try {
    const tableName = params.table;
    const tableExistsInDB = await tableExists(tableName);
      if (!tableExistsInDB) {
          throw new Error('Invalid table name');
      }
    const body = await req.json();  
    const {nameID, ID} = body;      
    const sql = `DELETE FROM \`${tableName}\` WHERE \`${nameID}\` = ?`;
    const [rows] = await query({
      query: sql, 
      values: [ID]
    });
    return NextResponse.json({ rows });
  } 
  catch (error) {
    console.error('Database query error:', error); 
    return NextResponse.json({ message:`Error retrieving data ` });
  } 
}
