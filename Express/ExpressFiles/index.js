const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: 'localhost',
  user: 'W2_89876_Dip',
  password: 'manager',
  database: 'car_service_db'
});


//--------- APIs ----------//

// Customer Registration
app.post('/customers/register', (req, res) => {
  const { name, email, phone, password, address, vehicle_model, vehicle_no } = req.body;
  pool.query(
    `INSERT INTO customers (name, email, phone, password, address, vehicle_model, vehicle_no)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, email, phone, password, address, vehicle_model, vehicle_no],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Customer registered', id: result.insertId });
    }
  );
});



// Customer Login
app.post('/customers/login', (req, res) => {
  const { email, password } = req.body;
  pool.query("SELECT * FROM customers WHERE email = ? AND password = ?", [email, password], (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length > 0) return res.json(results[0]);
    res.status(401).json({ message: 'Invalid credentials' });

  });
});

// Customers - Get All
app.get('/customers', (req, res) => {
  pool.query("SELECT * FROM customers", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});


// Get Active Services
app.get('/services', (req, res) => {
  pool.query("SELECT * FROM service_list WHERE status = 1", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);

  });
});



// Book a Service
app.post('/bookings', (req, res) => {
  const { customer_id, service_id, service_type, vehicle_no, vehicle_model, booking_date } = req.body;


  pool.query(`INSERT INTO bookings (customer_id, service_id, service_type, vehicle_no, vehicle_model, booking_date) VALUES (?, ?, ?, ?, ?, ?)`,
    [customer_id, service_id, service_type, vehicle_no, vehicle_model, booking_date],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Booking created', id: result.insertId });
    }
  );

});


// Get Customer Bookings
app.get('/customers/:id/bookings', (req, res) => {
  const { id } = req.params;
  pool.query("SELECT * FROM bookings WHERE customer_id = ?", [id], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Customer Bookings with Service Details
app.get('/customers/:id/bookings', (req, res) => {
  const { id } = req.params;
  pool.query(`
    SELECT 
      b.*, 
      s.service AS service_name, 
      s.description AS service_description
    FROM bookings b
    JOIN service_list s ON b.service_id = s.id
    WHERE b.customer_id = ?
  `, [id], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

//Get Billing with Booking & Customer Info
app.get('/billing', (req, res) => {
  pool.query(`
    SELECT bill.id, bill.amount, bill.bill_date, b.service_type, c.name AS customer_name, 
    c.vehicle_no FROM billing bill JOIN bookings b ON bill.booking_id = b.id JOIN customers c ON b.customer_id = c.id`, 
    (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});



// Add Billing Entry
app.post('/billing', (req, res) => {
  const { booking_id, amount, bill_date } = req.body;


  pool.query(`INSERT INTO billing (booking_id, amount, bill_date) VALUES (?, ?, ?)`,
    [booking_id, amount, bill_date],
    (err, result) => {

      if (err) return res.status(500).json(err);
      res.json({ message: 'Billing entry added', id: result.insertId });
    }
  );
});


app.get('/service_requests', (req, res) => {
  pool.query("SELECT * FROM service_requests", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});



// Submit Feedback
app.post('/feedback', (req, res) => {
  const { customer_id, service_id, rating, comments } = req.body;


  pool.query(`INSERT INTO feedback (customer_id, service_id, rating, comments) VALUES (?, ?, ?, ?)`,
    [customer_id, service_id, rating, comments],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Feedback submitted', id: result.insertId });
    }
  );
});

//Get Feedback with Customer & Service Info
app.get('/feedback', (req, res) => {
  pool.query(`
    SELECT 
      f.*, 
      c.name AS customer_name, 
      s.service AS service_name 
    FROM feedback f
    JOIN customers c ON f.customer_id = c.id
    JOIN service_list s ON f.service_id = s.id
  `, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});


// Admins - Get All
app.get('/admins', (req, res) => {
  pool.query("SELECT * FROM admins", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});



// Admin Login
app.post('/admins/login', (req, res) => {
  const { username, password } = req.body;
  pool.query("SELECT * FROM admins WHERE username = ? AND password = ?", [username, password], (err, results) => {

    if (err) return res.status(500).json(err);
    if (results.length > 0) return res.json(results[0]);
    res.status(401).json({ message: 'Invalid admin credentials' });
  });
});



// Add Service Request
app.post('/service_requests', (req, res) => {
  const { owner_name, category_id, service_type, mechanic_id } = req.body;
  pool.query(`INSERT INTO service_requests (owner_name, category_id, service_type, mechanic_id) VALUES (?, ?, ?, ?)`,
    
    [owner_name, category_id, service_type, mechanic_id],
    (err, result) => {

      if (err) return res.status(500).json(err);
      res.json({ message: 'Service request created', id: result.insertId });
    }
  );
});

// Get Service Requests with Category and Mechanic Info
app.get('/service_requests', (req, res) => {
  pool.query(`SELECT sr.*, cat.name AS category_name, m.name AS mechanic_name 
    FROM service_requests sr JOIN categories cat ON sr.category_id = cat.id
    JOIN mechanics_list m ON sr.mechanic_id = m.id
  `, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});


// Mechanics - Add New
app.post('/mechanics', (req, res) => {
  const { name, contact, email, status } = req.body;
  pool.query(
    `INSERT INTO mechanics_list (name, contact, email, status) VALUES (?, ?, ?, ?)`,
    [name, contact, email, status || 1],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Mechanic added', id: result.insertId });
    }
  );
});



// Mechanics - Update
app.put('/mechanics/:id', (req, res) => {
  const { id } = req.params;
  const { name, contact, email, status } = req.body;
  pool.query(
    `UPDATE mechanics_list SET name = ?, contact = ?, email = ?, status = ? WHERE id = ?`,
    [name, contact, email, status, id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Mechanic updated' });
    }
  );
});



// Mechanics - Delete
app.delete('/mechanics/:id', (req, res) => {
  const { id } = req.params;
  pool.query(`DELETE FROM mechanics_list WHERE id = ?`, [id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Mechanic deleted' });
  });
});



// // Get All Service Requests
// app.get('/service_requests', (req, res) => {
//   pool.query("SELECT * FROM service_requests", (err, results) => {
//     if (err) return res.status(500).json(err);
//     res.json(results);
//   });
// });



// Admins - Update
app.put('/admins/:id', (req, res) => {
  const { id } = req.params;
  const { username, password, role } = req.body;
  pool.query(
    `UPDATE admins SET username = ?, password = ?, role = ? WHERE id = ?`,
    [username, password, role, id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Admin updated' });
    }
  );
});


//Optional: Get All Bookings for Admin (with Joins)
app.get('/bookings', (req, res) => {
  pool.query(`
    SELECT 
      b.*, 
      c.name AS customer_name, 
      c.vehicle_model, 
      s.service AS service_name
    FROM bookings b
    JOIN customers c ON b.customer_id = c.id
    JOIN service_list s ON b.service_id = s.id
  `, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});


// Admins - Delete
app.delete('/admins/:id', (req, res) => {
  const { id } = req.params;
  pool.query("DELETE FROM admins WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Admin deleted' });
  });
});


// // Feedback - Get All
// app.get('/feedback', (req, res) => {
//   pool.query("SELECT * FROM feedback", (err, results) => {
//     if (err) return res.status(500).json(err);
//     res.json(results);
//   });
// });


app.get('/feedback', (req, res) => {
  pool.query(`SELECT f.*, c.name AS customer_name, 
    s.service AS service_name FROM feedback f JOIN customers c ON f.customer_id = c.id JOIN service_list s ON f.service_id = s.id`, 
    (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});




// Feedback - Update
app.put('/feedback/:id', (req, res) => {
  const { id } = req.params;
  const { customer_id, service_id, rating, comments } = req.body;


  pool.query(`UPDATE feedback SET customer_id = ?, service_id = ?, rating = ?, comments = ? WHERE id = ?`,
    [customer_id, service_id, rating, comments, id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Feedback updated' });
    }
  );
});



// Feedback - Delete
app.delete('/feedback/:id', (req, res) => {
  const { id } = req.params;
  pool.query("DELETE FROM feedback WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Feedback deleted' });
  });
});



// // Billing - Get All
// app.get('/billing', (req, res) => {
//   pool.query("SELECT * FROM billing", (err, results) => {
//     if (err) return res.status(500).json(err);
//     res.json(results);
//   });
// });



// Bookings - Update
app.put('/bookings/:id', (req, res) => {
  const { id } = req.params;
  const { customer_id, service_id, service_type, vehicle_no, vehicle_model, booking_date, status } = req.body;
  pool.query(`UPDATE bookings SET customer_id = ?, service_id = ?, service_type = ?, vehicle_no = ?, vehicle_model = ?, booking_date = ?, status = ? WHERE id = ?`,
    [customer_id, service_id, service_type, vehicle_no, vehicle_model, booking_date, status, id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Booking updated' });
    }
  );
});



// Bookings - Delete
app.delete('/bookings/:id', (req, res) => {
  const { id } = req.params;
  pool.query("DELETE FROM bookings WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Booking deleted' });
  });
});



// Services - Add New
app.post('/services', (req, res) => {
  const { service, description, status } = req.body;

  pool.query(`INSERT INTO service_list (service, description, status) VALUES (?, ?, ?)`,
    [service, description, status || 1],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Service added', id: result.insertId });
    }
  );
});


// Services - Update
app.put('/services/:id', (req, res) => {
  const { id } = req.params;
  const { service, description, status } = req.body;

  pool.query(`UPDATE service_list SET service = ?, description = ?, status = ? WHERE id = ?`,
    [service, description, status, id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Service updated' });
    }
  );
});


// Services - Delete
app.delete('/services/:id', (req, res) => {
  const { id } = req.params;
  pool.query("DELETE FROM service_list WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Service deleted' });
  });
});



// Customers - Update
app.put('/customers/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, phone, password, address, vehicle_model, vehicle_no } = req.body;

  pool.query(`UPDATE customers SET name = ?, email = ?, phone = ?, password = ?, address = ?, vehicle_model = ?, vehicle_no = ? WHERE id = ?`,
    [name, email, phone, password, address, vehicle_model, vehicle_no, id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Customer updated' });
    }
  );
});


// Customers - Delete
app.delete('/customers/:id', (req, res) => {
  const { id } = req.params;
  pool.query("DELETE FROM customers WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Customer deleted' });
  });
});



app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
