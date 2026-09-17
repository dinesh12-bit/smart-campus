import mysql.connector


DB_CONFIG = {
    "host": "localhost",
    "port": 3306,
    "database": "smart_campus_db",
    "user": "root",
    "password": "9329538168",
    "use_pure": True
}


def get_connection():
    print("Connecting to MySQL...", flush=True)

    connection = mysql.connector.connect(
        **DB_CONFIG,
        connection_timeout=5
    )

    print("MySQL connection created", flush=True)
    return connection


def get_tables():
    connection = get_connection()

    try:
        cursor = connection.cursor()
        cursor.execute("SHOW TABLES")

        tables = [row[0] for row in cursor.fetchall()]

        return tables

    finally:
        cursor.close()
        connection.close()


def get_sensor_readings():
    connection = get_connection()

    try:
        cursor = connection.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                id,
                room_code,
                temperature,
                humidity,
                motion_detected,
                light_level,
                recorded_at
            FROM sensor_readings
            ORDER BY recorded_at ASC
        """)

        return cursor.fetchall()

    finally:
        cursor.close()
        connection.close()