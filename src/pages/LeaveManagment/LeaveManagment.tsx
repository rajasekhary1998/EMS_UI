import React, { useState } from "react";
import "./LeaveManagment.css";

import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

type Leave = {
  id: number;
  employeeName: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  status: "Pending" | "Approved" | "Rejected";
  createdAt: string;
};

const initialData: Leave[] = [
  {
    id: 1,
    employeeName: "John Doe",
    leaveType: "Sick Leave",
    fromDate: "2026-06-10",
    toDate: "2026-06-12",
    status: "Approved",
    createdAt: "17/06/2026",
  },
  {
    id: 2,
    employeeName: "Sarah Khan",
    leaveType: "Casual Leave",
    fromDate: "2026-06-15",
    toDate: "2026-06-16",
    status: "Pending",
    createdAt: "17/06/2026",
  },
];

const LeaveManagement: React.FC = () => {
  const [leaves, setLeaves] = useState<Leave[]>(initialData);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [form, setForm] = useState<Omit<Leave, "id" | "createdAt">>({
    employeeName: "",
    leaveType: "",
    fromDate: "",
    toDate: "",
    status: "Pending",
  });
  const [collapsed, setCollapsed] = useState(false);

  // Search
  const filtered = leaves.filter(
    (leave) =>
      leave.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      leave.leaveType.toLowerCase().includes(search.toLowerCase())
  );

  // Input Change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Reset Form
  const resetForm = () => {
    setForm({
      employeeName: "",
      leaveType: "",
      fromDate: "",
      toDate: "",
      status: "Pending",
    });

    setEditId(null);
  };

  // Save / Update
  const handleSubmit = () => {
    if (!form.employeeName || !form.leaveType) {
      alert("Please fill all required fields");
      return;
    }

    if (editId !== null) {
      setLeaves(
        leaves.map((leave) =>
          leave.id === editId ? { ...leave, ...form } : leave
        )
      );
    } else {
      const newLeave: Leave = {
        id: Date.now(),
        ...form,
        createdAt: new Date().toLocaleDateString(),
      };

      setLeaves([...leaves, newLeave]);
    }

    setShowModal(false);
    resetForm();
  };

  // Edit
  const handleEdit = (leave: Leave) => {
    setForm({
      employeeName: leave.employeeName,
      leaveType: leave.leaveType,
      fromDate: leave.fromDate,
      toDate: leave.toDate,
      status: leave.status,
    });

    setEditId(leave.id);
    setShowModal(true);
  };

  // Delete
  const handleDelete = (id: number) => {
    if (window.confirm("Delete this leave?")) {
      setLeaves(leaves.filter((leave) => leave.id !== id));
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} />

      {/* Main Content */}
      <div className="main-content">
        <Header
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
        <div className="content">

          <div className="leave-page">

            {/* Header */}
            <div className="leave-header">
              <div className="leave-title">
                <h2>Leave Management</h2>
                <p>Manage employee leave requests</p>
              </div>

              <button
                className="add-btn"
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
              >
                + Add Leave
              </button>
            </div>

            {/* Card */}

            <div className="leave-card">

              <div className="leave-top">
                <input
                  type="text"
                  className="search-box"
                  placeholder="Search Leave..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <table className="leave-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Leave Type</th>
                    <th>From Date</th>
                    <th>To Date</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.length > 0 ? (
                    filtered.map((leave) => (
                      <tr key={leave.id}>
                        <td>{leave.employeeName}</td>
                        <td>{leave.leaveType}</td>
                        <td>{leave.fromDate}</td>
                        <td>{leave.toDate}</td>

                        <td>
                          <span
                            className={`status ${
                              leave.status === "Approved"
                                ? "approved"
                                : leave.status === "Rejected"
                                ? "rejected"
                                : "pending"
                            }`}
                          >
                            {leave.status}
                          </span>
                        </td>

                        <td>{leave.createdAt}</td>

                        <td>
                          <button
                            className="action-btn edit-btn"
                            onClick={() => handleEdit(leave)}
                          >
                            ✏️
                          </button>

                          <button
                            className="action-btn delete-btn"
                            onClick={() => handleDelete(leave.id)}
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} style={{ textAlign: "center" }}>
                        No Leave Records Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Modal */}

            {showModal && (
              <div className="modal-overlay">
                <div className="modal">

                  <h3>{editId ? "Edit Leave" : "Add Leave"}</h3>

                  <div className="form-group">
                    <input
                      type="text"
                      name="employeeName"
                      placeholder="Employee Name"
                      value={form.employeeName}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <input
                      type="text"
                      name="leaveType"
                      placeholder="Leave Type"
                      value={form.leaveType}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <input
                      type="date"
                      name="fromDate"
                      value={form.fromDate}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <input
                      type="date"
                      name="toDate"
                      value={form.toDate}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  <div className="modal-footer">
                    <button
                      className="cancel-btn"
                      onClick={() => {
                        setShowModal(false);
                        resetForm();
                      }}
                    >
                      Cancel
                    </button>

                    <button
                      className="save-btn"
                      onClick={handleSubmit}
                    >
                      {editId ? "Update" : "Save"}
                    </button>
                  </div>

                </div>
              </div>
            )}

          </div>

        </div>

        <Footer />
      </div>
    </div>
  );
};

export default LeaveManagement;