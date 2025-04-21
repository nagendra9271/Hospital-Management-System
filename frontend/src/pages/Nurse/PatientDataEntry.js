import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiFileText, FiCheck, FiSearch } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/PatientDataEntry.css";

const Inbox = () => {
  const [tests, setTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [testResults, setTestResults] = useState({});
  const [testDates, setTestDates] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("patient");
  const [expandedCard, setExpandedCard] = useState(null);

  useEffect(() => {
    const fetchTests = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("/api/nurse/testresults"); // replace with your real API
        const testData = response.data;
        setTests(testData);
        setFilteredTests(testData.filter((test) => test.status === "pending"));
      } catch (error) {
        const msg = error?.response?.data?.error;
        console.error("Fetch error:", msg || "Server Error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTests();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredTests(tests.filter((test) => test.status === "pending"));
      return;
    }
    const lowerSearch = searchTerm.toLowerCase();
    const filtered = tests.filter((test) => {
      const matches =
        (searchType === "patient" &&
          test.patient_name.toLowerCase().includes(lowerSearch)) ||
        (searchType === "doctor" &&
          test.doctor_name.toLowerCase().includes(lowerSearch)) ||
        (searchType === "test" &&
          test.test_name.toLowerCase().includes(lowerSearch));
      return matches && test.status === "pending";
    });
    setFilteredTests(filtered);
  }, [searchTerm, searchType, tests]);

  const handleResultChange = (c_id, value) => {
    setTestResults((prev) => ({ ...prev, [c_id]: value }));
  };

  const handleDateChange = (c_id, value) => {
    setTestDates((prev) => ({ ...prev, [c_id]: value }));
  };

  const submitTestResult = async (c_id) => {
    const result = testResults[c_id];
    const t_date = testDates[c_id];

    if (!result || !t_date) {
      toast.error("Please select both date and result");
      return;
    }

    try {
      // Send data to backend
      await axios.post(`/api/nurse/submittest/${c_id}`, {
        c_id: c_id,
        t_result: result,
        t_date: t_date,
      });

      toast.success("Test results submitted");

      // Update frontend state
      setTests((prev) =>
        prev.map((test) =>
          test.c_id === c_id
            ? { ...test, t_result: result, t_date, status: "completed" }
            : test
        )
      );

      setTestResults((prev) => {
        const copy = { ...prev };
        delete copy[c_id];
        return copy;
      });

      setTestDates((prev) => {
        const copy = { ...prev };
        delete copy[c_id];
        return copy;
      });

      setExpandedCard(null);
    } catch (error) {
      const msg = error?.response?.data?.error;
      toast.error(msg || "Submission failed");
    }
  };

  if (isLoading) {
    return (
      <div className="loader-container">
        <div className="loader" />
      </div>
    );
  }

  return (
    <div className="inbox-container">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="filter-header">
        <div>
          <h2 className="section-title">Test Results Entry</h2>
          <p className="section-subtitle">
            Enter test results for pending tests
          </p>
        </div>
        <div className="search-container">
          <div className="search-select-input">
            <div className="search-input-wrapper">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder={`Search by ${searchType}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="search-select"
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="test">Test</option>
            </select>
          </div>
        </div>
      </div>

      {filteredTests.length === 0 ? (
        <div className="no-appointments">
          <h3>No tests found</h3>
        </div>
      ) : (
        filteredTests.map((test) => (
          <TestEntryCard
            key={test.c_id}
            test={test}
            result={testResults[test.c_id] || ""}
            testDate={testDates[test.c_id] || ""}
            expanded={expandedCard === test.c_id}
            onToggle={() =>
              setExpandedCard(expandedCard === test.c_id ? null : test.c_id)
            }
            onResultChange={(value) => handleResultChange(test.c_id, value)}
            onDateChange={(value) => handleDateChange(test.c_id, value)}
            onSubmit={() => submitTestResult(test.c_id)}
          />
        ))
      )}
    </div>
  );
};

const TestEntryCard = ({
  test,
  expanded,
  onToggle,
  result,
  testDate,
  onResultChange,
  onDateChange,
  onSubmit,
}) => {
  return (
    <div className="test-entry-card">
      <div className="test-entry-header">
        <div onClick={onToggle} style={{ flex: 1, cursor: "pointer" }}>
          <h3>{test.patient_name}</h3>
          <p className="doctor-name">Doctor: {test.doctor_name}</p>
          <span className="test-name">{test.test_name}</span>
        </div>
        <button
          onClick={onToggle}
          className="dropdown-toggle-btn"
          aria-label="Toggle test details"
        >
          {expanded ? "−" : "+"}
        </button>
      </div>

      {expanded && (
        <div className="test-entry-body">
          <label>Test Conducted Date:</label>
          <input
            type="date"
            value={testDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="form-control"
          />

          <label style={{ marginTop: "10px" }}>Test Result:</label>
          <textarea
            value={result}
            onChange={(e) => onResultChange(e.target.value)}
            className="form-control"
            rows="4"
            placeholder="Enter test result details..."
          />

          <div className="test-entry-actions">
            <button className="btn btn-success mt-2" onClick={onSubmit}>
              <FiCheck /> Submit Results
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inbox;
