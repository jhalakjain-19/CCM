const pool = require("../config/db");

class customerModel {
  static async getAttrTypes() {
    try {
      const query = `SELECT * FROM CCMS.lu_generic_values WHERE generic_key = ?`;
      const [rows] = await pool.query(query, ["Attr"]);
      return rows;
    } catch (error) {
      console.error("Error fetching attributes:", error.message);
      throw error;
    }
  }
  static async getDataTypes() {
    try {
      const query = `SELECT * FROM CCMS.lu_generic_values WHERE generic_key = ?`;
      const [rows] = await pool.query(query, ["DataType"]);
      return rows;
    } catch (error) {
      console.error("Error fetching data types:", error.message);
      throw error;
    }
  }
  static async createAttribute(req) {
    try {
      const { user_id } = req.user;
      const { field_name, data_type, attribute_type, custom_options_value } =
        req.body;

      if (!user_id || !field_name || !data_type || !attribute_type) {
        throw new Error(
          "user_id, field_name, data_type, and attribute_type are required"
        );
      }

      let customOptions = null;

      // Ensure custom_options_value is stored as a proper JSON array if data_type is 8
      if (data_type === 8) {
        if (
          !Array.isArray(custom_options_value) ||
          custom_options_value.length === 0
        ) {
          throw new Error(
            "custom_options_value must be a non-empty array when data_type is 8"
          );
        }
        customOptions = JSON.stringify(custom_options_value);
      }

      // Fetch the highest order_no for the given user_id
      const orderQuery = `SELECT MAX(order_no) AS max_order FROM CCMS.customer_details WHERE user_id = ?`;
      const [orderResult] = await pool.query(orderQuery, [user_id]);

      let newOrderNo = (orderResult[0].max_order || 0) + 1; // Increment the highest order_no by 1

      // Insert the new attribute with the incremented order_no
      const insertQuery = `
            INSERT INTO CCMS.customer_details (user_id, field_name, data_type, attribute_type, custom_options_value, order_no)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

      await pool.query(insertQuery, [
        user_id,
        field_name,
        data_type,
        attribute_type,
        customOptions, // Store JSON object
        newOrderNo, // Auto-incremented order_no
      ]);

      return {
        message: "Attribute created successfully",
        user_id,
        order_no: newOrderNo,
      };
    } catch (error) {
      console.error("Error creating attribute:", error.message);
      throw error;
    }
  }

  // static async getAttributes() {
  //   try {
  //     const query = `SELECT * FROM CCMS.customer_details`;
  //     const [rows] = await pool.query(query);
  //     return rows;
  //   } catch (error) {
  //     console.error("Error fetching attributes:", error.message);
  //     throw error;
  //   }
  // }
  static async getAttributes(user_id) {
    try {
      const query = `SELECT * FROM CCMS.customer_details WHERE user_id = ?`;
      const [rows] = await pool.query(query, [user_id]);

      // Convert custom_options_value from string to array if not null
      const attributes = rows.map((row) => ({
        ...row,
        custom_options_value: row.custom_options_value
          ? JSON.parse(row.custom_options_value) // Convert from string back to array
          : null,
      }));

      return attributes;
    } catch (error) {
      console.error("Error fetching attributes:", error.message);
      throw error;
    }
  }

  // static async deleteAttribute(contact_field_id, user_id) {
  //   try {
  //     const query = `DELETE FROM CCMS.customer_details WHERE contact_field_id = ? AND user_id = ?`;

  //     const [result] = await pool.query(query, [contact_field_id, user_id]);
  //     return result;
  //   } catch (error) {
  //     console.error("Database Error:", error.message);
  //     throw error;
  //   }
  // }
  static async deleteAttribute(contact_field_id, user_id) {
    try {
      const connection = await pool.getConnection();
      try {
        await connection.beginTransaction();

        // Delete related records from CCMS.customer_data first
        const deleteCustomerDataQuery = `DELETE FROM CCMS.customer_data WHERE contact_field_id = ? AND user_id = ?`;
        await connection.query(deleteCustomerDataQuery, [
          contact_field_id,
          user_id,
        ]);

        // Delete attribute from CCMS.customer_details
        const deleteAttributeQuery = `DELETE FROM CCMS.customer_details WHERE contact_field_id = ? AND user_id = ?`;
        const [result] = await connection.query(deleteAttributeQuery, [
          contact_field_id,
          user_id,
        ]);

        await connection.commit();
        return result;
      } catch (error) {
        await connection.rollback();
        console.error("Transaction Error:", error.message);
        throw error;
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error("Database Error:", error.message);
      throw error;
    }
  }
  // static async deleteMultipleRecords(user_id, row_numbers) {
  //   try {
  //     const deleteQuery = `
  //       DELETE FROM CCMS.customer_data
  //       WHERE user_id = ? AND row_number IN (?)
  //     `;

  //     const [result] = await pool.query(deleteQuery, [user_id, row_numbers]);
  //     return result.affectedRows; // Number of rows deleted
  //   } catch (error) {
  //     throw new Error("Database Error: " + error.message);
  //   }
  // }
  static async deleteMultipleRecords(user_id, row_numbers) {
    try {
      // ✅ Step 1: Delete from `customer_data`
      const deleteCustomerDataQuery = `
            DELETE FROM CCMS.customer_data 
            WHERE user_id = ? AND customer_user_data_id IN (?)
        `;

      // ✅ Step 2: Delete from `customer_user_data`
      const deleteCustomerUserDataQuery = `
            DELETE FROM CCMS.customer_user_data 
            WHERE user_id = ? AND customer_user_data_id IN (?)
        `;

      // Delete from `customer_data`
      const [customerDataResult] = await pool.query(deleteCustomerDataQuery, [
        user_id,
        row_numbers,
      ]);

      // Delete from `customer_user_data`
      const [customerUserDataResult] = await pool.query(
        deleteCustomerUserDataQuery,
        [user_id, row_numbers]
      );

      // Total records deleted
      const totalDeleted =
        customerDataResult.affectedRows + customerUserDataResult.affectedRows;

      return totalDeleted; // Return number of deleted records
    } catch (error) {
      throw new Error("Database Error: " + error.message);
    }
  }

  // static async deleteAllRecords(user_id) {
  //   try {
  //     const deleteQuery = `
  //       DELETE FROM CCMS.customer_data
  //       WHERE user_id = ?
  //     `;

  //     const [result] = await pool.query(deleteQuery, [user_id]);
  //     return result.affectedRows; // Number of rows deleted
  //   } catch (error) {
  //     throw new Error("Database Error: " + error.message);
  //   }
  // }
  static async deleteAllRecords(user_id) {
    try {
      // ✅ Step 1: Delete from `customer_data`
      const deleteCustomerDataQuery = `
            DELETE FROM CCMS.customer_data 
            WHERE user_id = ?
        `;

      // ✅ Step 2: Delete from `customer_user_data`
      const deleteCustomerUserDataQuery = `
            DELETE FROM CCMS.customer_user_data 
            WHERE user_id = ?
        `;

      // Delete from `customer_data`
      const [customerDataResult] = await pool.query(deleteCustomerDataQuery, [
        user_id,
      ]);

      // Delete from `customer_user_data`
      const [customerUserDataResult] = await pool.query(
        deleteCustomerUserDataQuery,
        [user_id]
      );

      // Total records deleted
      const totalDeleted =
        customerDataResult.affectedRows + customerUserDataResult.affectedRows;

      return totalDeleted; // Return number of deleted records
    } catch (error) {
      throw new Error("Database Error: " + error.message);
    }
  }
  // static async getAllUserRecords(user_id) {
  //   try {
  //     const query = `
  //           SELECT * FROM CCMS.customer_data
  //           WHERE user_id = ?
  //       `;

  //     const [rows] = await pool.query(query, [user_id]);

  //     return rows; // Returns data in row format
  //   } catch (error) {
  //     throw new Error("Database Error: " + error.message);
  //   }
  // }
  static async getAllUserRecords(user_id) {
    try {
      // Get field names for the user
      const fieldQuery = `SELECT contact_field_id, field_name FROM CCMS.customer_details WHERE user_id = ?`;
      const [fieldRows] = await pool.query(fieldQuery, [user_id]);

      // Create a mapping of contact_field_id to field_name
      const fieldMap = {};
      fieldRows.forEach((row) => {
        fieldMap[row.contact_field_id] = row.field_name;
      });

      // Fetch user data from customer_data
      const dataQuery = `SELECT * FROM CCMS.customer_data WHERE user_id = ?`;
      const [dataRows] = await pool.query(dataQuery, [user_id]);

      // Organize the data correctly
      const formattedData = {};
      dataRows.forEach((row) => {
        const recordId = row.customer_user_data_id;

        if (!formattedData[recordId]) {
          formattedData[recordId] = { customer_user_data_id: recordId };
        }

        const fieldName = fieldMap[row.contact_field_id]; // Map field ID to field name
        if (fieldName) {
          formattedData[recordId][fieldName] = row.field_value;
        }
      });

      // Convert formattedData object into an array
      return Object.values(formattedData); // Only return data, no fields array
    } catch (error) {
      throw new Error("Database Error: " + error.message);
    }
  }
  static async updateOrderNo(user_id, contact_field_id, new_order_no) {
    try {
      // Get the current order_no of the dragged field
      const getCurrentOrderQuery = `
            SELECT order_no FROM CCMS.customer_details
            WHERE user_id = ? AND contact_field_id = ?
        `;
      const [currentOrderResult] = await pool.query(getCurrentOrderQuery, [
        user_id,
        contact_field_id,
      ]);

      if (currentOrderResult.length === 0) {
        throw new Error(
          "Field not found for given user_id and contact_field_id"
        );
      }

      const current_order_no = currentOrderResult[0].order_no;

      if (current_order_no === new_order_no) {
        return { message: "No changes needed, same order_no" };
      }

      let shiftQuery = "";
      let shiftParams = [];

      // Case 1: Moving UP (e.g., order_no 6 → 1)
      if (current_order_no > new_order_no) {
        shiftQuery = `
                UPDATE CCMS.customer_details
                SET order_no = order_no + 1
                WHERE user_id = ? AND order_no >= ? AND order_no < ?
            `;
        shiftParams = [user_id, new_order_no, current_order_no];

        // Case 2: Moving DOWN (e.g., order_no 1 → 6)
      } else {
        shiftQuery = `
                UPDATE CCMS.customer_details
                SET order_no = order_no - 1
                WHERE user_id = ? AND order_no > ? AND order_no <= ?
            `;
        shiftParams = [user_id, current_order_no, new_order_no];
      }

      // Shift other fields
      await pool.query(shiftQuery, shiftParams);

      // Set the new order_no for the dragged field
      const updateDraggedFieldQuery = `
            UPDATE CCMS.customer_details
            SET order_no = ?
            WHERE user_id = ? AND contact_field_id = ?
        `;
      await pool.query(updateDraggedFieldQuery, [
        new_order_no,
        user_id,
        contact_field_id,
      ]);

      return { message: "Order numbers updated successfully" };
    } catch (error) {
      console.error("Error updating order number:", error.message);
      throw error;
    }
  }
}

module.exports = customerModel;
