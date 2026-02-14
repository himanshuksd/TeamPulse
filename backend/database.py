import mysql.connector

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="kasaudhan",
    database="teampulse"
)

cursor = db.cursor(dictionary=True)