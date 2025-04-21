import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./authContext"; // Import your auth context to get user_id

const DoctorContext = createContext();

export const useDoctor = () => {
  return useContext(DoctorContext) || {};
};

export const DoctorProvider = ({ children }) => {
  const { user } = useAuth(); // Get user from auth context
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== "Doctor") {
      setLoading(false);
      return;
    }
    const fetchDoctorDetails = async () => {
      if (!user?.user_id) return;

      try {
        const response = await axios.get(`/api/doctors/${user.user_id}`);
        setDoctorDetails(response.data.doctor);
      } catch (error) {
        console.error("Error fetching doctor details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorDetails();
  }, [user?.user_id, user.role]);

  return (
    <DoctorContext.Provider value={{ doctorDetails, loading }}>
      {children}
    </DoctorContext.Provider>
  );
};
