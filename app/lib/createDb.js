"use server"
import mysql from "mysql2/promise";
import { dbConfig } from "./dbConfig";

async function createDatabaseAndTables() {
  try {
    const { dbname, ...dbConnect } = dbConfig;
    const pool = mysql.createPool(dbConnect);

    await pool.query(`CREATE DATABASE IF NOT EXISTS ${dbname}`);
    console.log('PROLAB veritabanı oluşturuldu veya zaten mevcut.');

    const newPool = mysql.createPool(dbConfig);

    await newPool.query(`CREATE TABLE IF NOT EXISTS Patient (
      hastaID INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) UNIQUE,
      password VARCHAR(255),
      ad VARCHAR(255),
      soyad VARCHAR(255),
      dogumTarihi DATE,
      cinsiyet CHAR(1),
      telefon VARCHAR(20),
      adres VARCHAR(255)
    )`);
    console.log('Patient tablosu oluşturuldu.');

    await newPool.query(`CREATE TABLE IF NOT EXISTS Doctor (
      doktorID INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) UNIQUE,
      password VARCHAR(255),
      ad VARCHAR(255),
      soyad VARCHAR(255),
      uzmanlikID INT,
      hastaneID INT,
      FOREIGN KEY (specialtyID) REFERENCES Specialty (specialtyID),
      FOREIGN KEY (uzmanlikID) REFERENCES Hospital (hastaneID)
    )`);
    console.log('Doctor tablosu oluşturuldu.');

    await newPool.query(`CREATE TABLE IF NOT EXISTS Administrator (
      yoneticiID INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255),
      password VARCHAR(255)
    )`);
    console.log('Administrator tablosu oluşturuldu.');

    await newPool.query(`CREATE TABLE IF NOT EXISTS Appointment (
      randevuID INT AUTO_INCREMENT PRIMARY KEY,
      hastaID INT,
      doktorID INT,
      randevuTarihi DATE,
      randevuSaati TIME,
      FOREIGN KEY (hastaID) REFERENCES Patient(hastaID),
      FOREIGN KEY (doktorID) REFERENCES Doctor(doktorID)
    )`);
    console.log('Appointment tablosu oluşturuldu.');

    await newPool.query(`CREATE TABLE IF NOT EXISTS MedicalReport (
      raporID INT AUTO_INCREMENT PRIMARY KEY,
      hastaID INT,
      doktorID INT,
      raporTarihi DATE,
      raporUrl TEXT,
      raporIcerigi JSON,
      FOREIGN KEY (hastaID) REFERENCES Patient(hastaID),
      FOREIGN KEY (doktorID) REFERENCES Doctor(doktorID)
    )`);
    console.log('MedicalReport tablosu oluşturuldu.');

    await newPool.query(`CREATE TABLE IF NOT EXISTS Hospital (
      hastaneID INT AUTO_INCREMENT PRIMARY KEY,
      hastaneAdi TEXT
    )`);
    console.log('Hospital tablosu oluşturuldu.');

    await newPool.query(`CREATE TABLE IF NOT EXISTS Specialty (
      uzmanlikID INT AUTO_INCREMENT PRIMARY KEY,
      uzmanlikAlani TEXT
    )`);
    console.log('Specialty tablosu oluşturuldu.');

    pool.end();
    newPool.end();
  } 
  catch (error) {
    console.error('Hata oluştu: ' + error.message);
  }
}

export { createDatabaseAndTables };
