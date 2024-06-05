"use server"
import mysql from "mysql2/promise";
import { dbConfig } from "@/app/lib/dbConfig";


async function tableExists(tableName) {
    const pool = mysql.createPool(dbConfig);
    const [rows] = await pool.execute(`SHOW TABLES LIKE '${tableName}'`);
    return rows.length > 0;
}

export default async function getData(table) {

    const sql = `SELECT * FROM ${table}`; 
    const pool = mysql.createPool(dbConfig);

    try {
        const tableExistsInDB = await tableExists(table);
        if (!tableExistsInDB) {
            throw new Error('Invalid table name');
        }
        const [data] = await pool.execute(sql); 
        return data;
    } 
    catch (error) {
        console.error("Error retrieving citizen data:", error);
        throw error;
    } 
    finally {
        pool.end();
    }
}
