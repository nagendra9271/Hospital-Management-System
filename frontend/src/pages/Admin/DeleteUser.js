import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuth } from "../../context/authContext";
import { useSearchParams } from "react-router-dom";

export default function DeleteUser() {
  const { user: currentUser, Loading: currentUserLoading } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("name") || "");
  const [roleFilter, setRoleFilter] = useState(searchParams.get("role") || "");

  // Memoize the fetchUsers function
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/user/users", {
        params: {
          name: searchParams.get("name") || "",
          role: searchParams.get("role") || "",
        },
      });
      setUsers(res.data.users);
    } catch (err) {
      toast.error("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchUsers();
  }, [searchParams, fetchUsers]); // Now fetchUsers is stable and won't cause unnecessary re-renders

  const handleSearch = () => {
    const params = {};
    if (search) params.name = search;
    if (roleFilter) params.role = roleFilter;
    setSearchParams(params);
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`/api/user/${userId}`);
      toast.success("User deleted.");
      fetchUsers();
    } catch (err) {
      const msg =
        err.response?.data?.error || "deleting user failed. Try again.";
      toast.error(msg);
    }
  };

  if (currentUserLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Delete User</h2>

      <div className="row mb-4">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Doctor">Doctor</option>
            <option value="FrontDesk">Front Desk</option>
            <option value="Nurse">Nurse</option>
          </select>
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary w-100" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading users...</p>
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="row">
          {users.map((user) => (
            <div className="col-md-4 mb-4" key={user.user_id}>
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">{user.name}</h5>
                  <p className="card-text mb-1">
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p className="card-text mb-1">
                    <strong>Phone:</strong> {user.phone_no}
                  </p>
                  <p className="card-text mb-3">
                    <strong>Role:</strong> {user.role}
                  </p>
                  {user.role !== "Admin" ? (
                    <button
                      className="btn btn-danger"
                      disabled={
                        user.role === "Admin" ||
                        user.user_id === currentUser.user_id
                      }
                      onClick={() => handleDelete(user.user_id)}
                    >
                      <FaTrash className="me-2" />
                      Delete
                    </button>
                  ) : (
                    <div></div>
                  )}
                  {/* <button
                    className="btn btn-danger"
                    disabled={
                      user.role === "Admin" ||
                      user.user_id === currentUser.user_id
                    }
                    onClick={() => handleDelete(user.user_id)}
                  >
                    <FaTrash className="me-2" />
                    Delete
                  </button> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
