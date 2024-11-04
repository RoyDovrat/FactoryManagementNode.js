const express = require('express');
const cors = require('cors');
const connectDB = require('./configs/dataBase');

const departmentsRouter = require('./controllers/departmentController');
const employeesRouter = require('./controllers/employeeController');
const shifsRouter = require('./controllers/shiftController');
const employeeShifsRouter = require('./controllers//employeeShiftController');

const authController = require('./controllers/authController');

const app = express();
const PORT = 3000;

connectDB();

app.use(cors());
app.use('/', express.json());
app.use('/departments', departmentsRouter);
app.use('/employees', employeesRouter);
app.use('/shifts', shifsRouter);
app.use('/employeeShifts', employeeShifsRouter)

app.use('/auth', authController); 

app.listen(PORT, () => {
  console.log(`app is listening at http://localhost:${PORT}`);
});
