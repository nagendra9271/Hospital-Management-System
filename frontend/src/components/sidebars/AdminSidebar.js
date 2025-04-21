import { NavLink } from "react-router-dom";

export default function AdminSidebar({ user }) {
  if (!user) {
    return <div className="text-danger">Failed to load admin data.</div>;
  }

  const basePath = `/admin/${user.user_id}`;

  return (
    <>
      <NavLink to="/admin" className="sidebar-link" end>
        Dashboard
      </NavLink>
      <NavLink to={`${basePath}/adduser`} className="sidebar-link">
        Add User
      </NavLink>
      <NavLink to={`${basePath}/deleteuser`} className="sidebar-link">
        Delete User
      </NavLink>
      <NavLink to={`${basePath}/viewdoctors`} className="sidebar-link">
        View Doctors
      </NavLink>
      <NavLink to={`${basePath}/viewfrontdesk`} className="sidebar-link">
        View Front Desk
      </NavLink>
      <NavLink to={`${basePath}/viewnurses`} className="sidebar-link">
        View Nurses
      </NavLink>
    </>
  );
}
