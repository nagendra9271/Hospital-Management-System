import { NavLink } from "react-router-dom";
import { useDoctor } from "../../context/DoctorContext";

export default function DoctorSidebar({ user }) {
  const { doctorDetails: doctor, loading: doctorLoading } = useDoctor();

  if (doctorLoading) {
    return <div className="text-center">Loading Doctor Info...</div>;
  }

  if (!doctor) {
    return <div className="text-danger">Failed to load doctor data.</div>;
  }

  return (
    <>
      <NavLink to={`/doctor`} className="sidebar-link" end>
        Dashboard
      </NavLink>
      <NavLink
        to={`/doctor/${doctor?.d_id}/patientlist`}
        className="sidebar-link"
      >
        Patient List
      </NavLink>
      <NavLink to={`/doctor/${doctor?.d_id}/inbox`} className="sidebar-link">
        Inbox
      </NavLink>
      {/* <NavLink to={`/doctor/${doctor?.d_id}/addtest`} className="sidebar-link">
        Add Test
      </NavLink> */}
      <NavLink
        to={`/doctor/${doctor?.d_id}/testresultsroomassignment`}
        className="sidebar-link"
      >
        Test Results
      </NavLink>
    </>
  );
}
