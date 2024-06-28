import { Form } from "react-bootstrap";

const FilterSelect = ({ value, onChange }) => {
  return (
    <Form.Select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ width: "auto" }}
    >
      <option value="all">All Time</option>
      <option value="week">This Week</option>
      <option value="month">This Month</option>
      <option value="active">Active</option>
    </Form.Select>
  );
};

export default FilterSelect;