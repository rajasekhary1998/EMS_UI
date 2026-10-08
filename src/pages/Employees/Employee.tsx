import "./Employee.css";

import { useEffect, useState } from "react";

import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../../services/employeeService";

import type { Employee } from "../../types/employee";
import { employeeSchema } from "../../validations/employeeValidation";

import { FaEdit, FaTrash,FaUsers,FaPlus } from "react-icons/fa";

const Employees = () => {
  const [collapsed, setCollapsed] = useState(false);

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const [employeeForm, setEmployeeForm] = useState({
  employeeCode: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  departmentId: 0,
  status: "ACTIVE",
  joiningDate: "",
});

  // HANDLE CHANGE (same as dashboard)
  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  const { name, value } = e.target;

  setEmployeeForm({
    ...employeeForm,
    [name]:
      name === "departmentId"
        ? Number(value)
        : value,
  });
};

  // FETCH
  const fetchEmployees = async () => {
    try {
      const data = await getEmployees();
      const list = Array.isArray(data) ? data : data?.data || [];
      setEmployees(list);
    } catch (err) {
      console.error(err);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // ADD OPEN
  const handleAdd = () => {
    setEmployeeForm({
      employeeCode: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      departmentId: 0,
      status: "ACTIVE",
      joiningDate: "",
    });

    setEditingId(null);
    setErrors({});
    setShowModal(true);
  };

  // EDIT
  const handleEdit = (emp: Employee) => {
    setEmployeeForm({
      employeeCode: emp.employeeCode,
      firstName: emp.firstName,
      lastName: emp.lastName,
      email: emp.email,
      phone: emp.phone,
      departmentId: emp.departmentId || 0,
      status: emp.status,
      joiningDate: emp.joiningDate,
    });

    setEditingId(emp.employeeId);
    setShowModal(true);
  };

  // SAVE (DASHBOARD STYLE VALIDATION)
  const handleSave = async () => {
    setErrors({});
    setErrorMessage("");
    setSuccessMessage("");

    const validationData = {
      ...employeeForm,
      departmentId: Number(employeeForm.departmentId),
    };

    const result = employeeSchema.safeParse(validationData);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;

      setErrors({
        employeeCode: fieldErrors.employeeCode?.[0] || "",
        firstName: fieldErrors.firstName?.[0] || "",
        lastName: fieldErrors.lastName?.[0] || "",
        email: fieldErrors.email?.[0] || "",
        phone: fieldErrors.phone?.[0] || "",
        departmentId: fieldErrors.departmentId?.[0] || "",
        joiningDate: fieldErrors.joiningDate?.[0] || "",
        status: fieldErrors.status?.[0] || "",
      });

      return;
    }

    try {
      if (editingId) {
        await updateEmployee(editingId, validationData as any);
        setSuccessMessage("Employee updated successfully!");
      } else {
        await createEmployee(validationData as any);
        setSuccessMessage("Employee added successfully!");
      }

      setShowModal(false);
      fetchEmployees();

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      setErrorMessage(
        err?.response?.data?.message || "Failed to save employee"
      );
    }
  };

  // DELETE
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure?")) return;

    await deleteEmployee(id);
    setErrorMessage("Employee deleted successfully!");
    fetchEmployees();

    setTimeout(() => setSuccessMessage(""), 3000);
  };

  // FILTER
  const filteredEmployees = employees.filter((e) =>
    `${e.employeeCode} ${e.firstName} ${e.lastName} ${e.email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );
// Pagination Logic
    const totalPages = Math.ceil(
    filteredEmployees.length / recordsPerPage
    );

    const startIndex =
    (currentPage - 1) * recordsPerPage;

    const currentEmployees =
    filteredEmployees.slice(
        startIndex,
        startIndex + recordsPerPage
    );
  return (
    <div className="dashboard-layout">
      <Sidebar collapsed={collapsed} />

      <div className="main-section">
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />

        <main className="dashboard-content">

  {/* PAGE HEADER */}
  <div className="page-header">
    <div className="page-icon">
      <FaUsers />
    </div>

    <div>
      <h2 className="page-title">Employees</h2>
      <p className="page-subtitle">
        Manage all employees in your organization
      </p>
    </div>
  </div>

  <div className="employee-container">

    {/* SEARCH + ADD */}
    <div className="employee-header">

      <input
        type="text"
        className="search-box"
        placeholder="Search Employee..."
        value={search}
        onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
            }}
      />
      <button
        className="add-btn"
        onClick={handleAdd}
      >
        <FaPlus />
        Add Employee
      </button>

    </div>

    {/* SUCCESS */}
    {successMessage && (
      <div className="success-message">
        {successMessage}
      </div>
    )}

    {/* ERROR */}
    {errorMessage && (
      <div className="error-message">
        {errorMessage}
      </div>
    )}

    {/* TABLE */}
    {loading ? (
      <h3>Loading Employees...</h3>
    ) : (
      <table className="employee-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredEmployees.length > 0 ? (
            currentEmployees.map((emp) => (
              <tr key={emp.employeeId}>
                <td>{emp.employeeCode}</td>

                <td>
                  {emp.firstName} {emp.lastName}
                </td>

                <td>{emp.email}</td>

                <td>
                  <span
                    className={
                      emp.status === "ACTIVE"
                        ? "status-active"
                        : "status-inactive"
                    }
                  >
                    {emp.status}
                  </span>
                </td>

                <td className="action-column">
                  
                    <button
                            className="action-btn edit-btn"
                            onClick={() => handleEdit(emp )}
                          >
                            ✏️
                    </button>
                  <button
                            className="action-btn delete-btn"
                            onClick={() => handleDelete(emp.employeeId)}
                          >
                            🗑️
                          </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={5}
                style={{ textAlign: "center" }}
              >
                No Employees Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      
    )}
  </div>
        <div className="pagination">
        {Array.from(
            { length: totalPages },
            (_, index) => (
            <button
                key={index + 1}
                className={
                currentPage === index + 1
                    ? "page-btn active"
                    : "page-btn"
                }
                onClick={() =>
                setCurrentPage(index + 1)
                }
            >
                {index + 1}
            </button>
            )
        )}
        </div>
   </main>
        <Footer />
      </div>

      {/* MODAL (SAME DASHBOARD DESIGN) */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>
                {editingId ? "Edit Employee" : "Add Employee"}
              </h2>
              <button
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <input
                    name="employeeCode"
                    value={employeeForm.employeeCode}
                    onChange={handleChange}
                    placeholder="Employee Code"
                  />
                  <span className="error-text">
                    {errors.employeeCode}
                  </span>
                </div>

                <div className="form-group">
                  <input
                    name="firstName"
                    value={employeeForm.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                  />
                  <span className="error-text">
                    {errors.firstName}
                  </span>
                </div>

                <div className="form-group">
                  <input
                    name="lastName"
                    value={employeeForm.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                  />
                  <span className="error-text">
                    {errors.lastName}
                  </span>
                </div>

                <div className="form-group">
                  <input
                    name="email"
                    value={employeeForm.email}
                    onChange={handleChange}
                    placeholder="Email"
                  />
                  <span className="error-text">
                    {errors.email}
                  </span>
                </div>

                <div className="form-group">
                  <input
                    name="phone"
                    value={employeeForm.phone}
                    onChange={handleChange}
                    placeholder="Phone"
                  />
                  <span className="error-text">
                    {errors.phone}
                  </span>
                </div>

                <div className="form-group">
                    <input
                    type="number"
                    name="departmentId"
                    value={employeeForm.departmentId}
                    placeholder="Department Id"
                    onChange={handleChange}
                    />
                    <span className="error-text">
                    {errors.departmentId}
                    </span>
                </div>
                <div className="form-group">
                  <input
                    type="date"
                    name="joiningDate"
                    value={employeeForm.joiningDate}
                    onChange={handleChange}
                  />
                  <span className="error-text">
                    {errors.joiningDate}
                  </span>
                </div>

                <div className="form-group">
                  <select
                    name="status"
                    value={employeeForm.status}
                    onChange={handleChange}
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                  <span className="error-text">
                    {errors.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="cancel-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

              <button className="save-btn" onClick={handleSave}>
                {editingId ? "Update Employee" : "Save Employee"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;