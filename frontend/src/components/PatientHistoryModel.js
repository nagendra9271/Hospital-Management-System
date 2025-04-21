import React from "react";
import "../styles/PatientHistoryModel.css"; // You can also merge this into Inbox.css if preferred

const PatientHistoryModal = ({ historyData, onClose }) => {
  if (!historyData) return null;

  return (
    <div className="custom-modal">
      <div className="custom-modal-content large">
        <button className="modal-close-button" onClick={onClose}>
          &times;
        </button>
        <h4>Patient ID: {historyData?.p_id}</h4>

        <h5>Previous Tests</h5>
        {historyData.tests.length > 0 ? (
          <ul>
            {historyData.tests.map((t, idx) => (
              <li key={idx}>
                <strong>{t?.test_name}</strong> - {t?.t_result} (
                {new Date(t?.t_date).toLocaleDateString()})
              </li>
            ))}
          </ul>
        ) : (
          <p>No test history found.</p>
        )}

        <h5>Previous Treatments</h5>
        {historyData.treatments.length > 0 ? (
          <ul>
            {historyData.treatments.map((treat, idx) => (
              <li key={idx}>
                <strong>
                  {new Date(treat.treatment_date)?.toLocaleDateString()}
                </strong>
                : {treat?.prescription} ({treat?.description})
              </li>
            ))}
          </ul>
        ) : (
          <p>No treatment history found.</p>
        )}
      </div>
    </div>
  );
};

export default PatientHistoryModal;
