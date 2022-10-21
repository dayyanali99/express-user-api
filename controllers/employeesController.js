const Employee = require("../model/Employee");

const getAllEmployees = async (req, res) => {
  const employees = await Employee.find().exec();
  if (!employees) return res.status(204).json({ message: "No Employees Found!" });
  res.json(employees);
};

const createNewEmployee = async (req, res) => {
  const firstname = req.body.firstname.toLowerCase();
  const lastname = req.body.lastname.toLowerCase();
  console.log(firstname, lastname);
  if (!firstname || !lastname) return res.status(400).json({ message: "First and Last names are required!" });


  try {
    // check if employee already exists

    const foundEmployee = await Employee.exists({
      firstname,
      lastname
    }).exec();

    if (foundEmployee)
      return res.status(409).json({ message: "Employee already exists!" });

    // create new employee
    const newEmployee = await Employee.create({
      firstname,
      lastname
    });
    console.log(newEmployee);

    res.status(201).json(newEmployee);

  } catch (error) {
    console.error(error);
  }
};

const updateEmployee = async (req, res) => {
  if (!req?.body?.id) return res.status(400).json({ message: "ID parameter is required!" });

  const employee = await Employee.findOne({ _id: req.body.id }).exec();
  if (!employee) return res.status(204).json({ message: `No employee matches ID ${req.body.id}` });

  if (req.body?.firstname) employee.firstname = req.body.firstname.toLowerCase();
  if (req.body?.lastname) employee.lastname = req.body.lastname.toLowerCase();
  const result = await employee.save();

  res.json(result);
};

const deleteEmployee = async (req, res) => {
  if (!req?.body?.id) return res.status(400).json({ message: "ID parameter is required!" });

  const employee = await Employee.findOne({ _id: req.body.id }).exec();
  if (!employee) return res.status(204).json({ message: `Employee ID ${req.body.id} not found!` });
  const result = await employee.delete();

  res.json({ result, message: 'Employee deleted successfully!' });
};

const getEmployee = async (req, res) => {

  if (!req?.params?.id) return res.status(400).json({ message: "ID parameter is required!" });

  const employee = await Employee.findOne({ _id: req.params.id }).exec();
  if (!employee)
    return res.status(204).json({ message: `Employee ID ${req.params.id} not found!` });

  res.json(employee);
};

module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
};
