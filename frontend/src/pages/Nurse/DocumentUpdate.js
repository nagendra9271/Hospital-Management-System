// src/Nurse/DocumentUpload.js
import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function DocumentUpload() {
  const { recordId } = useParams();
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFiles) {
      toast.error("Please select at least one file.");
      return;
    }

    const formData = new FormData();
    // Append each file to the form data. The backend should be ready to accept these files.
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("documents", selectedFiles[i]);
    }

    setLoading(true);
    try {
      await axios.post(
        `/api/patient-data/record/${recordId}/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast.success("Documents uploaded successfully!");
      navigate("/nurse/records/dashboard");
    } catch (err) {
      const msg = err.response?.data?.error || "Upload failed. Try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Upload Documents for Record #{recordId}</h2>
      <form
        onSubmit={handleUpload}
        className="card p-4 shadow-sm mx-auto"
        style={{ maxWidth: "500px" }}
      >
        <div className="mb-3">
          <label htmlFor="documents" className="form-label">
            Select Files
          </label>
          <input
            type="file"
            className="form-control"
            id="documents"
            multiple
            onChange={handleFileChange}
          />
        </div>
        <button type="submit" className="btn btn-info w-100" disabled={loading}>
          {loading ? "Uploading..." : "Upload Documents"}
        </button>
      </form>
    </div>
  );
}
