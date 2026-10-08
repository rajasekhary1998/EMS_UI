import "./Dashboard.css";

import { useState, useEffect } from "react";

import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import Footer from "../../components/Footer/Footer";

import {
  FaUsers,
  FaUserCheck,
  FaUserTimes,
  FaBuilding,
  FaFileCsv,
} from "react-icons/fa";

import {
  getDashboardData,
  getRecentEmployeeData,
} from "../../services/dashboardService";

import type { DashboardData } from "../../types/dashboard";
import type { Employee } from "../../types/employee";
const Dashboard = () => {
const [collapsed, setCollapsed] = useState(false);
const [searchTerm, setSearchTerm] = useState("");
  const [dashboardData, setDashboardData] =
    useState<DashboardData>({
      totalEmployees: 0,
      activeEmployees: 0,
      totalDepartments: 0,
      inactiveEmployees: 0,
    });
const [currentPage, setCurrentPage] = useState(1);
const recordsPerPage = 10;
const [successMessage, setSuccessMessage] = useState("");
  const [employees, setEmployees] =
    useState<Employee[]>([]);

  const [loading, setLoading] =
    useState<boolean>(true);

  const fetchDashboardData = async () => {
    try {
      const data = await getDashboardData();

      setDashboardData(data);
    } catch (error) {
      console.error(
        "Dashboard Error:",
        error
      );
    }
  };
const filteredEmployees =
  employees.filter((employee) => {
    const search =
      searchTerm.toLowerCase();

    return (
      employee.employeeCode
        ?.toLowerCase()
        .includes(search) ||

      employee.firstName
        ?.toLowerCase()
        .includes(search) ||

      employee.lastName
        ?.toLowerCase()
        .includes(search) ||

      employee.email
        ?.toLowerCase()
        .includes(search)
    );
  });
    const totalPages = Math.ceil(
    filteredEmployees.length / recordsPerPage
  );

  const startIndex =
    (currentPage - 1) * recordsPerPage;

  const paginatedEmployees =
    filteredEmployees.slice(
      startIndex,
      startIndex + recordsPerPage
    );
  const fetchEmployees = async () => {
    try {
      const data =
        await getRecentEmployeeData();

      const recentEmployees = data.sort(
  (a: Employee, b: Employee) =>
    new Date(b.createdAt).getTime() -
    new Date(a.createdAt).getTime()
);
setEmployees(recentEmployees);
    } catch (error) {
      console.error(
        "Employee Error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };
const handleExportCSV = () => {
  const headers = [
    "Employee Code",
    "First Name",
    "Last Name",
    "Email",
    "Status",
    "Joining Date",
  ];

  const rows = filteredEmployees.map((emp) => [
    emp.employeeCode,
    emp.firstName,
    emp.lastName,
    emp.email,
    emp.status,
    emp.joiningDate,
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "employees.csv";
  link.click();

  URL.revokeObjectURL(url);

  setSuccessMessage("Employees exported successfully!");

  setTimeout(() => {
    setSuccessMessage("");
  }, 3000);
};
  useEffect(() => {
    fetchDashboardData();
    fetchEmployees();
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar collapsed={collapsed} />

      <div className="main-section">
        <Header
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        <main className="dashboard-content">
          <h2 className="dashboard-title">
            Dashboard
          </h2>

          {loading ? (
            <h3>Loading...</h3>
          ) : (
            <>
              {/* Dashboard Cards */}

              <div className="cards-container">
                <div className="dashboard-card">
                  <div className="card-icon blue">
                    <FaUsers />
                  </div>

                  <div className="card-content">
                    <h4>
                      Total Employees
                    </h4>

                    <h2>
                      {
                        dashboardData.totalEmployees
                      }
                    </h2>

                    <p>
                      All Employees
                    </p>
                  </div>
                </div>

                <div className="dashboard-card">
                  <div className="card-icon green">
                    <FaUserCheck />
                  </div>

                  <div className="card-content">
                    <h4>
                      Active Employees
                    </h4>

                    <h2>
                      {
                        dashboardData.activeEmployees
                      }
                    </h2>

                    <p>
                      Currently Active
                    </p>
                  </div>
                </div>

                <div className="dashboard-card">
                  <div className="card-icon purple">
                    <FaBuilding />
                  </div>

                  <div className="card-content">
                    <h4>
                      Departments
                    </h4>

                    <h2>
                      {
                        dashboardData.totalDepartments
                      }
                    </h2>

                    <p>
                      Total Departments
                    </p>
                  </div>
                </div>

                <div className="dashboard-card">
                  <div className="card-icon red">
                    <FaUserTimes />
                  </div>

                  <div className="card-content">
                    <h4>
                      Inactive Employees
                    </h4>

                    <h2>
                      {
                        dashboardData.inactiveEmployees
                      }
                    </h2>

                    <p>Not Active</p>
                  </div>
                </div>
              </div>

              {/* Recent Employees */}

              <div className="recent-employees">
              <div className="employee-header">
                <h3>All Employees</h3>

                <div className="employee-actions">
                  <input
                    type="text"
                    className="search-box"
                    placeholder="Search by Code, Name, Email..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                  />

                  <button
                    className="export-btn"
                    onClick={handleExportCSV}
                  >
                    <FaFileCsv />
                    Export CSV
                  </button>
                </div>
              </div>
              {successMessage && (
                <div className="success-message">
                  {successMessage}
                </div>
              )}
                <table className="employee-table">
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>
                        Joining Date
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {employees.length >
                    0 ? (
                      paginatedEmployees.map(
                        (employee) => (
                          <tr key={employee.employeeId}>
                      <td>{employee.employeeCode}</td>

                      <td>
                        {employee.firstName} {employee.lastName}
                      </td>

                      <td>{employee.email}</td>

                      <td>
                        <span
                          className={
                            employee.status === "ACTIVE"
                              ? "status-active"
                              : "status-inactive"
                          }
                        >
                          {employee.status}
                        </span>
                      </td>

                      <td>
                        {new Date(employee.joiningDate).toLocaleDateString()}
                      </td>
                    </tr>
                        )
                      )
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          style={{
                            textAlign:
                              "center",
                          }}
                        >
                          No Employees
                          Found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="pagination-container">
            <div className="pagination-info">
              Showing {startIndex + 1} to{" "}
              {Math.min(
                startIndex + recordsPerPage,
                filteredEmployees.length
              )} of {filteredEmployees.length} entries
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
          </div>
            </>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;