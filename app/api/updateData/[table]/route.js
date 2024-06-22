"use server"
import { query } from "@/app/lib/dbConnection";
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    const body = await req.json();  
    const { sql, values } = body;  
    const result = await query({
      query: sql,
      values: values,
    });
    return NextResponse.json({ message: 'User added successfully', data: result });
  } 
  catch (error) {
    console.error('Database insert error:', error);
    return NextResponse.json({ message: 'Error adding user' });
  } 
}