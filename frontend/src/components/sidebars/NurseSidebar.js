import { NavLink } from "react-router-dom";

export default function NurseSidebar({ user }) {
  if (!user) {
    return <div className="text-danger">Failed to load nurse data.</div>;
  }
  return (
    <>
      <NavLink to={`/nurse`} className="sidebar-link" end>
        Dashboard
      </NavLink>
      <NavLink
        to={`/nurse/${user.user_id}/documentupdate`}
        className="sidebar-link"
      >
        Document Update
      </NavLink>
      <NavLink
        to={`/nurse/${user.user_id}/patientdataentry`}
        className="sidebar-link"
      >
        Patient Data Entry
      </NavLink>
      {/* <NavLink
        to={`/nurse/${user.user_id}/patientrecordupdate`}
        className="sidebar-link"
      >
        Patient Record Update
      </NavLink> */}
    </>
  );
}
