// Import necessary dependencies and components
import { useState,  } from "react";
import { Container, Row, Col, Nav } from "react-bootstrap";
import { FaCalendarAlt,  FaChartBar, FaCog } from "react-icons/fa";


import AdminNavbar from "../components/adminComponents/AdminNavbar";
import Analytics from "../components/adminComponents/Analytics";
import Settings from "../components/adminComponents/Settings";

import CreateAvailabilityTab from "../components/adminComponents/CreateAvailabilityTab";



// Define the AdminDashboard component
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("bookings"); //used for rendering the components{choices:"bookings","analytics","settings"}

  {
  // // State variable to store admin statistic **not useful now
  // const [stats, setStats] = useState({
  //   totalUsers: 0,
  //   totalBookings: 0,
  //   revenueThisMonth: 0,
  // });

  // // Custom hook for managing alert state and showing alerts
  // const { alert, showAlert } = useAlert();

  // // Function to fetch admin stats from the server 
  // const fetchAdminStats = useCallback(async () => {
  //   try {
  //     const data = await fetchData(
  //       `${import.meta.env.VITE_SERVER}/admin/stats`,
  //       "Failed to fetch admin stats"
  //     );
  //     // Update the stats state with fetched data
  //     setStats(data);
  //   } catch (error) {
  //     // Show an alert if there's an error fetching data
  //     showAlert(error.message, "danger");
  //   }
  // }, [showAlert]);

  // // Effect to fetch admin stats when the component mounts
  // // Currently commented out, but can be enabled to load data on mount
  // useEffect(() => {
  //   // fetchAdminStats();
  // }, [fetchAdminStats]);

  }

  // Render the component
  return (
    <div className="min-vh-100 bg-light">
      <AdminNavbar />
      <Container fluid className="py-4">
        {/* Dashboard header */}
        <Row className="mb-4">
          <Col>
            <h1>Admin Dashboard</h1>
          </Col>
        </Row>

        {/* Navigation tabs */}
        <Row className="mb-4">
          <Col>
            <Nav variant="tabs">
              {/* Bookings tab */}
              <Nav.Item>
                <Nav.Link
                  active={activeTab === "bookings"}
                  onClick={() => setActiveTab("bookings")}
                >
                  <FaCalendarAlt className="me-2" />
                  Bookings
                </Nav.Link>
              </Nav.Item>
              {/* Analytics tab */}
              <Nav.Item>
                <Nav.Link
                  active={activeTab === "analytics"}
                  onClick={() => setActiveTab("analytics")}
                >
                  <FaChartBar className="me-2" />
                  Analytics
                </Nav.Link>
              </Nav.Item>
              {/* Settings tab */}
              <Nav.Item>
                <Nav.Link
                  active={activeTab === "settings"}
                  onClick={() => setActiveTab("settings")}
                >
                  <FaCog className="me-2" />
                  Settings
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
        </Row>

        {/* Render active tab content based on activeTab state */}
        {activeTab === "bookings" && (
          <CreateAvailabilityTab
            stats={stats}
            alert={alert}
            showAlert={showAlert}
          />
        )}
        {activeTab === "analytics" && <Analytics stats={stats} />}
        {activeTab === "settings" && <Settings />}
      </Container>
    </div>
  );
};

export default AdminDashboard;
