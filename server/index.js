const express = require('express');
const cors = require('cors');
const connectDB = require('./configs/dataBase');

const departmentsRouter = require('./controllers/departmentController');
const employeesRouter = require('./controllers/employeeController');
const shiftsRouter = require('./controllers/shiftController');
const employeeShiftsRouter = require('./controllers//employeeShiftController');
const usersRouter = require('./controllers/userController');

const authController = require('./controllers/authController');

const app = express();
const PORT = 3000;

connectDB();

app.use(cors());
app.use('/', express.json());

app.use('/auth', authController);

app.use('/departments', departmentsRouter);
app.use('/employees', employeesRouter);
app.use('/shifts', shiftsRouter);
app.use('/employeeShifts', employeeShiftsRouter);
app.use('/users', usersRouter);


/********************reset user actions************************/
const cron = require('node-cron');
const { resetDailyActions } = require('./services/userService');

// Schedule a task to reset user actions at midnight every day
cron.schedule('0 0 * * *', async () => {
  try {
    console.log('Resetting daily actions...');
    await resetDailyActions();
    console.log('Daily actions reset successfully.');
  } catch (error) {
    console.error('Error during cron execution:', error.message);
  }
});
/************************************************************/

app.listen(PORT, () => {
  console.log(`app is listening at http://localhost:${PORT}`);
});
