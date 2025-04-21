import { NavLink } from "react-router-dom";

export default function FrontDeskSidebar({ user }) {
  if (!user) {
    return <div className="text-danger">Failed to load frontdesk data.</div>;
  }

  const basePath = `/frontdesk/${user.user_id}`;

  return (
    <>
      <NavLink to="/frontdesk" className="sidebar-link" end>
        Dashboard
      </NavLink>
      <NavLink to={`${basePath}/addpatient`} className="sidebar-link">
        Register Patient
      </NavLink>
      <NavLink to={`${basePath}/appointment`} className="sidebar-link">
        Appointment
      </NavLink>
      <NavLink to={`${basePath}/admitpatient`} className="sidebar-link">
        Admit Patient
      </NavLink>
      <NavLink to={`${basePath}/dischargepatient`} className="sidebar-link">
        Discharge Patients
      </NavLink>
      <NavLink to={`${basePath}/doctorslist`} className="sidebar-link">
        Doctors List
      </NavLink>
      <NavLink to={`${basePath}/patientslist`} className="sidebar-link">
        Patients List
      </NavLink>
      <NavLink to={`${basePath}/rooms`} className="sidebar-link">
        Rooms List
      </NavLink>
    </>
  );
}
