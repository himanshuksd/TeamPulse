import mysql.connector

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="himanshu123",
    database="teampulse"
)

cursor = db.cursor(dictionary=True)
