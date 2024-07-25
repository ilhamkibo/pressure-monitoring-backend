const pool = require("../config/db.config");

async function getAlarmData(req, res) {
  try {
    const connection = await pool.promise().getConnection(); // Use pool.promise() for async/await

    response = {
      status: "success",
      data: {},
    };

    sql = `SELECT * FROM Logs ORDER BY id DESC LIMIT 20`;

    const [result] = await connection.execute(sql);
    response.data = result;
    await connection.release();

    res.json(response);
  } catch (error) {
    console.error("Error fetching data from database:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Sample insertLog function
const insertLog = (value) => {
  return new Promise((resolve, reject) => {
    const query = "INSERT INTO Logs (value, createdAt) VALUES (?, NOW())";

    pool.getConnection((err, connection) => {
      if (err) {
        console.error("Error getting connection from pool:", err);
        reject(err);
        return;
      }

      connection.query(query, [value], (error, results) => {
        connection.release();

        if (error) {
          console.error("Error executing insert query:", error);
          reject(error);
          return;
        }

        console.log(`Inserted log with value: ${value}`);
        resolve(results.insertId); // Resolve with the inserted ID
      });
    });
  });
};

const updateLogTimestamp = async (value) => {
  return new Promise((resolve, reject) => {
    const query = "UPDATE Logs SET updatedAt = NOW() WHERE id = ?";

    // Get a connection from the pool
    pool.getConnection((err, connection) => {
      if (err) {
        console.error("Error getting connection from pool: ", err);
        return reject(err);
      }

      // Ensure the connection is valid
      if (!connection) {
        const error = new Error("Connection is undefined");
        console.error(error.message);
        return reject(error);
      }

      // Execute the query
      connection.query(query, [value], (error, results) => {
        // Release the connection back to the pool
        try {
          connection.release();
        } catch (releaseError) {
          console.error("Error releasing connection: ", releaseError);
        }

        if (error) {
          console.error("Error executing query: ", error);
          return reject(error);
        }

        console.log(`Updated log with value: ${value}`);
        resolve(results);
      });
    });
  });
};

module.exports = {
  getAlarmData,
  insertLog,
  updateLogTimestamp,
};
