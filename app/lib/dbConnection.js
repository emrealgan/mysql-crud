import mysql from 'mysql2/promise'
import { dbConfig } from './dbConfig';

export async function query({ query, values = [] }) {

  const dbconnection = await mysql.createConnection(dbConfig);

  try {
    let result;
    if(values.length == 0){
      result = await dbconnection.execute(query);
    }
    else{
      result = await dbconnection.execute(query, values);
    }
    await dbconnection.end();
    return result
  } 
  catch (error) {
    throw Error(error.message);
  }
}