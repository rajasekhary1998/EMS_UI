import "./Departments.css";
import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import {
  FaPlus,
  FaBuilding,
} from "react-icons/fa";

import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../../services/departmentService";

import type { Department } from "../../types/department";
import { departmentSchema } from "../../validations/departmentSchema";

const Departments = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");

  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [departmentName, setDepartmentName] = useState("");

  const [editingDepartmentId, setEditingDepartmentId] = useState<
    number | null
  >(null);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // FETCH
  const fetchDepartments = async () => {
    try {
      const data = await getDepartments();
      setDepartments(data);
    } catch (error) {
      console.error("Error fetching departments", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // FILTER
  const filteredDepartments = departments.filter((department) =>
    department.departmentName.toLowerCase().includes(search.toLowerCase())
  );

  // ADD
  const handleAddDepartment = () => {
    setDepartmentName("");
    setEditingDepartmentId(null);
    setError("");
    setShowModal(true);
  };

  // EDIT
  const handleEditDepartment = (department: Department) => {
    setEditingDepartmentId(department.departmentId);
    setDepartmentName(department.departmentName);
    setError("");
    setShowModal(true);
  };

  // SAVE
  const handleSaveDepartment = async () => {
    setError("");

    const result = departmentSchema.safeParse({
      departmentName,
    });

    if (!result.success) {
      setError(
        result.error?.flatten()?.fieldErrors?.departmentName?.[0] || ""
      );
      return;
    }

    try {
      if (editingDepartmentId) {
        await updateDepartment(editingDepartmentId, departmentName);
        setSuccessMessage("Department updated successfully!");
      } else {
        await createDepartment(departmentName);
        setSuccessMessage("Department added successfully!");
      }

      setDepartmentName("");
      setEditingDepartmentId(null);
      setShowModal(false);

      await fetchDepartments();

      setTimeout(() => setSuccessMessage(""), 3000);
        } catch (error: any) {
        console.error(error);

        const backendMessage =
          error?.response?.data?.message;

        setError(
          backendMessage || "Failed to save department"
        );
      }
  };

  // DELETE
  const handleDeleteDepartment = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this department?"
    );

    if (!confirmDelete) return;

    try {
      await deleteDepartment(id);

      setError("Department deleted successfully!");
      await fetchDepartments();

      setTimeout(() => setError(""), 3000);
    } catch (error) {
      console.error(error);
      setError("Failed to delete department");
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar collapsed={collapsed} />

      <div className="main-section">
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />

        <main className="department-content">
          <div className="page-header">
            <div className="page-icon">
              <FaBuilding />
            </div>

            <div>
              <h2 className="page-title">Departments</h2>
              <p className="page-subtitle">
                Manage all departments in your organization
              </p>
            </div>
          </div>

          {error && <p className="error">{error}</p>}
          {successMessage && <p className="success">{successMessage}</p>}

          <div className="department-container">
            <div className="department-header">
              <input
                type="text"
                placeholder="Search Department..."
                className="search-box"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <button className="add-btn" onClick={handleAddDepartment}>
                <FaPlus />
                Add Department
              </button>
            </div>

            {loading ? (
              <h3>Loading Departments...</h3>
            ) : (
              <table className="department-table">
                <thead>
                  <tr>
                    <th>Department Name</th>
                    <th>Created Date</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredDepartments.length > 0 ? (
                    filteredDepartments.map((department) => (
                      <tr key={department.departmentId}>
                        <td>{department.departmentName}</td>

                        <td>
                          {department.createdAt
                            ? new Date(department.createdAt).toLocaleDateString("en-GB")
                            : "-"}
                        </td>

                        <td className="action-column">
                          <button
                            className="action-btn edit-btn"
                            onClick={() => handleEditDepartment(department)}
                          >
                            ✏️
                          </button>

                          <button
                            className="action-btn delete-btn"
                            onClick={() => handleDeleteDepartment(department.departmentId)}
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} style={{ textAlign: "center" }}>
                        No Departments Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </main>

        <Footer />
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>
              {editingDepartmentId ? "Edit Department" : "Add Department"}
            </h3>

            <input
              type="text"
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
              placeholder="Department name"
            />

            {error && <p className="error">{error}</p>}

            <div className="modal-actions">
              <button onClick={handleSaveDepartment}>Save</button>

              <button
                onClick={() => {
                  setShowModal(false);
                  setError("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Departments;