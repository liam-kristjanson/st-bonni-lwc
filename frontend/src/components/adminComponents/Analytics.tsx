import React from "react";
import { Card } from "react-bootstrap";

const Analytics = ({ stats }) => (
  <Card className="shadow-sm">
    <Card.Body>
      <Card.Title>Analytics</Card.Title>
      <p>Total Users: {stats.totalUsers}</p>
      <p>Total Bookings: {stats.totalBookings}</p>
      <p>Revenue This Month: ${stats.revenueThisMonth}</p>
    </Card.Body>
  </Card>
);

export default Analytics;