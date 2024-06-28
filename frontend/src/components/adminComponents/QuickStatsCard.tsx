import { Card } from "react-bootstrap";
import { FaCalendarAlt, FaUsers, FaChartBar } from "react-icons/fa";

const QuickStatsCard = ({ stats }) => (
  <Card className="shadow-sm mb-4">
    <Card.Body>
      <Card.Title>Quick Stats</Card.Title>
      <div className="d-flex justify-content-between align-items-center mt-3">
        <div>
          <h3>{stats.totalBookings}</h3>
          <p className="text-muted">Total Bookings</p>
        </div>
        <FaCalendarAlt size={30} className="text-primary" />
      </div>
      <div className="d-flex justify-content-between align-items-center mt-3">
        <div>
          <h3>{stats.totalUsers}</h3>
          <p className="text-muted">Total Users</p>
        </div>
        <FaUsers size={30} className="text-success" />
      </div>
      <div className="d-flex justify-content-between align-items-center mt-3">
        <div>
          <h3>${stats.revenueThisMonth}</h3>
          <p className="text-muted">Revenue This Month</p>
        </div>
        <FaChartBar size={30} className="text-info" />
      </div>
    </Card.Body>
  </Card>
);

export default QuickStatsCard;