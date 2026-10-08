import "./Designation.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaClipboardList,
} from "react-icons/fa";

import {
  getDesignations,
  createDesignation,
  updateDesignation,
  deleteDesignation,
} from "../../services/designationService";

import { getDepartments } from "../../services/departmentService";

import type { Designation as DesignationType } from "../../types/designation";
import type { Department } from "../../types/department";

import { designationSchema } from "../../validations/designationSchema";

const Designation = () => {
  const [collapsed, setCollapsed] = useState(false);

  const [designations, setDesignations] = useState<DesignationType[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [designationName, setDesignationName] = useState("");
  const [departmentId, setDepartmentId] = useState<number>(0);

  const [editingId, setEditingId] = useState<number | null>(null);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchData = async () => {
    try {
      const designationData = await getDesignations();
      const departmentData = await getDepartments();

      setDesignations(designationData);
      setDepartments(departmentData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredDesignations = designations.filter((designation) =>
    designation.designationName
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleAdd = () => {
    setDesignationName("");
    setDepartmentId(0);
    setEditingId(null);
    setError("");
    setShowModal(true);
  };

  const handleEdit = (designation: DesignationType) => {
    setDesignationName(designation.designationName);
    setDepartmentId(designation.departmentId);
    setEditingId(designation.designationId);
    setError("");
    setShowModal(true);
  };

  
const handleSave = async () => {
  setError("");

  const result = designationSchema.safeParse({
    designationName,
    departmentId,
  });

  if (!result.success) {
    setError(
      result.error.flatten().fieldErrors.designationName?.[0] ||
      result.error.flatten().fieldErrors.departmentId?.[0] ||
      ""
    );
     setTimeout(() => {
    setError("");
  }, 3000);
    return;
  }

  try {
    const payload = {
      designationName,
      departmentId,
    };

    if (editingId) {
      await updateDesignation(editingId, payload);
      setSuccessMessage("Designation updated successfully!");
    } else {
      await createDesignation(payload);
      setSuccessMessage("Designation added successfully!");
    }

    setShowModal(false);
    await fetchData();

    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);

  } catch (error: any) {
  if (axios.isAxiosError(error)) {
    setError(error.response?.data?.message || "Failed to save designation");
  } else {
    setError("Something went wrong.");
  }

  setTimeout(() => {
    setError("");
  }, 3000);
}
};

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this designation?"
    );

    if (!confirmDelete) return;

    try {
      await deleteDesignation(id);

      setError(
        "Designation deleted successfully!"
      );

      fetchData();

      setTimeout(() => {
        setError("");
      }, 3000);
    } catch {
      setError("Failed to delete designation");
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar collapsed={collapsed} />

      <div className="main-section">
        <Header
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        <main className="designation-content">
          <div className="page-header">
            <div className="page-icon">
              <FaClipboardList />
            </div>

            <div>
              <h2 className="page-title">
                Designations
              </h2>

              <p className="page-subtitle">
                Manage all designations in your organization
              </p>
            </div>
          </div>

          {error && (
            <div className="error">{error}</div>
          )}

          {successMessage && (
            <div className="success">
              {successMessage}
            </div>
          )}

          <div className="designation-container">
            <div className="designation-header">
              <input
                type="text"
                className="search-box"
                placeholder="Search Designation..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

              <button
                className="add-btn"
                onClick={handleAdd}
              >
                <FaPlus />
                Add Designation
              </button>
            </div>

            {loading ? (
              <h3>Loading...</h3>
            ) : (
              <table className="designation-table">
                <thead>
                  <tr>
                    <th>Designation</th>
                    <th>Department</th>
                    <th>Created Date</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredDesignations.length > 0 ? (
                    filteredDesignations.map(
                      (designation) => (
                        <tr
                          key={
                            designation.designationId
                          }
                        >
                          <td>
                            {
                              designation.designationName
                            }
                          </td>

                          <td>
                            {
                              designation.departmentName
                            }
                          </td>

                          <td>
                            {designation.createdAt
                              ? new Date(
                                  designation.createdAt
                                ).toLocaleDateString(
                                  "en-GB"
                                )
                              : "-"}
                          </td>

                          <td className="action-column">
                            <button
                            className="action-btn edit-btn"
                            onClick={() => handleEdit(designation)}
                          >
                            ✏️
                          </button>
                          <button
                            className="action-btn delete-btn"
                            onClick={() => handleDelete(designation.designationId)}
                          >
                            🗑️
                          </button>
                          </td>
                        </tr>
                      )
                    )
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        style={{
                          textAlign: "center",
                        }}
                      >
                        No Designations Found
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

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>
              {editingId
                ? "Edit Designation"
                : "Add Designation"}
            </h3>

            <input
              type="text"
              placeholder="Designation Name"
              value={designationName}
              onChange={(e) =>
                setDesignationName(
                  e.target.value
                )
              }
            />

            <select
              value={departmentId}
              onChange={(e) =>
                setDepartmentId(
                  Number(e.target.value)
                )
              }
            >
              <option value={0}>
                Select Department
              </option>

              {departments.map(
                (department) => (
                  <option
                    key={
                      department.departmentId
                    }
                    value={
                      department.departmentId
                    }
                  >
                    {
                      department.departmentName
                    }
                  </option>
                )
              )}
            </select>
            <div className="modal-actions">
              <button
                onClick={handleSave}
              >
                Save
              </button>

              <button
                onClick={() =>
                  setShowModal(false)
                }
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

export default Designation;