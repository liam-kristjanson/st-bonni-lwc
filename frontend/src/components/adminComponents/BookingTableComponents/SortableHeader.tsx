import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

const SortableHeader = ({ name, label, sortConfig, requestSort }) => {
  const getSortIcon = () => {
    if (sortConfig.key === name) {
      return sortConfig.direction === "ascending" ? (
        <FaSortUp />
      ) : (
        <FaSortDown />
      );
    }
    return <FaSort />;
  };

  return (
    <th onClick={() => requestSort(name)}>
      {label} {getSortIcon()}
    </th>
  );
};

export default SortableHeader;