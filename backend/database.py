import mysql.connector

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Ngiri1174@",
    database="teampulse"
)

cursor = db.cursor(dictionary=True)