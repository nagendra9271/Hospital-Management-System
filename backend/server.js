const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const userRoutes = require("./routes/user");
// const frontdeskRoutes = require("./routes/frontdesk");
const patientRoutes = require("./routes/Patients");
const doctorRoutes = require("./routes/Doctor");
const appointmentRoutes = require("./routes/appointment");
const nurseRoutes = require("./routes/nurse");
const adminRoutes = require("./routes/admin");
const frontDeskRoutes = require("./routes/frontdesk");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/nurse", nurseRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/frontdesk", frontDeskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
