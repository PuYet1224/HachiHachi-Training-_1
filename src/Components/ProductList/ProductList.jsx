import React, { useState, useEffect, useCallback, useMemo } from "react";
import "./ProductList.css";
import DataTable from "react-data-table-component";
import option_icon from "../../Assets/option.png";
import view_icon from "../../Assets/view.png";
import edit_icon from "../../Assets/pencil.png";
import send_icon from "../../Assets/share.png";
import approve_icon from "../../Assets/check.png";
import hide_icon from "../../Assets/traffic-signal.png";
import return_icon from "../../Assets/turn-back.png";
import delete_icon from "../../Assets/delete.png";
import danger_icon from "../../Assets/triangle-exclamation-solid.svg";
import data from "../../Assets/data";
import CustomPagination from "../CustomPagination/CustomPagination";
import Toolbar from "../Toolbar/Toolbar";
import FilterHeader from "../FilterHeader/FilterHeader";
import ActionPopup from "../ActionPopup/ActionPopUp";
import Notification from "../Notification/Notification";

const ProductList = () => {
  // Initialize allData with unique _uniqueId for each row
  const [allData, setAllData] = useState(() => {
    return data.map((item, index) => ({ ...item, _uniqueId: index }));
  });
  const [filteredData, setFilteredData] = useState(allData);
  const [selectedRows, setSelectedRows] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedStatuses, setSelectedStatuses] = useState([
    "Đang soạn thảo",
  ]);
  const [searchText, setSearchText] = useState("");
  const [notification, setNotification] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const actionMessages = {
    send: "Gửi duyệt thành công",
    approve: "Áp dụng thành công",
    hide: "Ngừng áp dụng thành công",
    return: "Trả về thành công",
    delete: "Xóa thành công",
    deleteError: "Đã xảy ra lỗi khi xóa, không được phép xóa câu hỏi này",
    edit: "Chỉnh sửa thành công",
    view: "Xem chi tiết thành công",
  };

  const showNotification = useCallback((message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const handleDeleteConfirm = () => {
    const selectedIds = selectedRows.map((row) => row._uniqueId);
    setAllData((prevData) =>
      prevData.filter((item) => !selectedIds.includes(item._uniqueId))
    );
    showNotification(actionMessages.delete, "success");
    setSelectedRows([]);
    setShowDeleteConfirm(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setSelectedRows([]);
  };

  const handleDelete = () => {
    if (selectedRows.length > 1) {
      setShowDeleteConfirm(true);
    } else {
      handleDeleteConfirm();
    }
  };

  const handleDropdownAction = (action, itemUniqueId) => {
    const itemIndex = allData.findIndex(
      (item) => item._uniqueId === itemUniqueId
    );
    if (itemIndex === -1) return;

    const item = allData[itemIndex];

    // Check if item has full information before sending or approving
    if (
      (action === "send" || action === "approve") &&
      (!item.type || item.type.trim() === "")
    ) {
      showNotification(
        "Không thể thực hiện hành động vì câu hỏi chưa đầy đủ thông tin",
        "error"
      );
    } else if (
      action === "delete" &&
      (!item.type || item.type.trim() === "")
    ) {
      showNotification(actionMessages.deleteError, "error");
    } else if (action === "edit") {
      showNotification("Chỉnh sửa thành công", "success");
    } else if (action === "view") {
      showNotification("Xem chi tiết thành công", "success");
    } else {
      const newStatus = getNewStatus(action);
      const updatedItem = { ...item, status: newStatus };
      setAllData((prevData) => {
        const newData = [...prevData];
        newData[itemIndex] = updatedItem;
        return newData;
      });
      showNotification(
        actionMessages[action] || "Thao tác thành công",
        "success"
      );
    }
    setOpenDropdown(null);
  };

  const handleAction = (action) => {
    const statusMap = {
      send: ["Đang soạn thảo", "Trả về"],
      approve: ["Gửi duyệt", "Ngừng áp dụng"],
      hide: ["Duyệt áp dụng"],
      return: ["Gửi duyệt", "Ngừng áp dụng"],
    };
    const invalidItems = selectedRows.filter(
      (item) => !statusMap[action].includes(item.status)
    );

    const incompleteItems = selectedRows.filter(
      (item) =>
        (!item.type || item.type.trim() === "") &&
        (action === "send" || action === "approve")
    );

    if (invalidItems.length || incompleteItems.length) {
      showNotification(
        "Không thể thực hiện hành động với một số câu hỏi",
        "error"
      );
      return;
    }

    const selectedIds = selectedRows.map((row) => row._uniqueId);
    const newStatus = getNewStatus(action);

    setAllData((prevData) =>
      prevData.map((item) =>
        selectedIds.includes(item._uniqueId)
          ? { ...item, status: newStatus }
          : item
      )
    );
    showNotification(
      actionMessages[action] || "Thao tác thành công",
      "success"
    );
    setSelectedRows([]);
  };

  const getNewStatus = (action) => {
    switch (action) {
      case "send":
        return "Gửi duyệt";
      case "approve":
        return "Duyệt áp dụng";
      case "hide":
        return "Ngừng áp dụng";
      case "return":
        return "Trả về";
      default:
        return "";
    }
  };

  const handleFilterChange = (statuses) => {
    setSelectedStatuses(statuses);
  };

  const handleSearch = (text) => {
    setSearchText(text);
  };

  useEffect(() => {
    let statusesToFilter = selectedStatuses;
    if (selectedStatuses.includes("Đang soạn thảo")) {
      statusesToFilter = statusesToFilter.concat("Trả về");
    }
    const filtered = allData.filter(
      (item) =>
        (statusesToFilter.length === 0 ||
          statusesToFilter.includes(item.status)) &&
        (item.question.toLowerCase().includes(searchText.toLowerCase()) ||
          item.id.toLowerCase().includes(searchText.toLowerCase()))
    );
    setFilteredData(filtered);
  }, [allData, selectedStatuses, searchText]);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedRows(filteredData);
    } else {
      setSelectedRows([]);
    }
  };

  const handleRowSelect = (event, row) => {
    if (event.target.checked) {
      setSelectedRows([...selectedRows, row]);
    } else {
      setSelectedRows(
        selectedRows.filter((r) => r._uniqueId !== row._uniqueId)
      );
    }
  };

  const isRowSelected = (row) => {
    return selectedRows.some((r) => r._uniqueId === row._uniqueId);
  };

  const areAllRowsSelected = useMemo(
    () =>
      selectedRows.length === filteredData.length && filteredData.length > 0,
    [selectedRows, filteredData]
  );

  const statusButtonsMap = {
    "Đang soạn thảo": ["Chỉnh sửa", "Gửi duyệt", "Xóa"],
    "Gửi duyệt": ["Chỉnh sửa", "Phê duyệt", "Trả về"],
    "Duyệt áp dụng": ["Xem chi tiết", "Ngừng hiển thị"],
    "Ngừng áp dụng": ["Xem chi tiết", "Phê duyệt", "Trả về"],
    "Trả về": ["Chỉnh sửa", "Gửi duyệt"],
  };

  const buttonActionMap = {
    "Chỉnh sửa": "edit",
    "Gửi duyệt": "send",
    "Phê duyệt": "approve",
    "Xem chi tiết": "view",
    "Ngừng hiển thị": "hide",
    "Trả về": "return",
    "Xóa": "delete",
  };

  const columns = useMemo(
    () => [
      {
        name: (
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type="checkbox"
              onChange={handleSelectAll}
              checked={areAllRowsSelected}
              ref={(input) => {
                if (input) {
                  input.indeterminate =
                    selectedRows.length > 0 &&
                    selectedRows.length < filteredData.length;
                }
              }}
            />
            <span style={{ marginLeft: "5px" }}>Câu hỏi</span>
          </div>
        ),
        cell: (row) => (
          <div
            className="question-cell"
            style={{ display: "flex", alignItems: "center" }}
          >
            <input
              type="checkbox"
              checked={isRowSelected(row)}
              onChange={(e) => handleRowSelect(e, row)}
            />
            <div
              style={{ marginLeft: "5px" }}
              title={row.question} // Tooltip on hover
            >
              <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
                {row.question}
              </div>
              <div style={{ fontSize: "13px" }}>
                ID: {row.id}{" "}
                <span style={{ color: "#BDC2D2" }}> | </span> Type: {row.type}
              </div>
            </div>
          </div>
        ),
        width: "45%",
      },
      {
        name: "Phân nhóm",
        selector: (row) => row.description,
        width: "15%",
        cell: (row) => (
          <div title={row.description}>{row.description}</div>
        ), // Tooltip on hover
      },
      {
        name: "Thời gian làm",
        cell: (row) => (
          <div
            style={{ textAlign: "center", fontWeight: "bold" }}
            title={row.duration} // Tooltip on hover
          >
            {row.duration}
          </div>
        ),
        width: "15%",
        center: true,
      },
      {
        name: "Tình Trạng",
        cell: (row) => (
          <span
            style={{
              color: getStatusColor(row.status),
              textAlign: "right",
              display: "block",
              width: "100%",
            }}
            title={row.status} // Tooltip on hover
          >
            {row.status}
          </span>
        ),
        width: "15%",
      },
      {
        name: "",
        cell: (row) => {
          const allowedButtons = statusButtonsMap[row.status] || [];

          return (
            <div className="option-button-container">
              <div
                className="option-container"
                onClick={() => toggleDropdown(row._uniqueId)}
              >
                <img src={option_icon} alt="Options" className="option-button" />
              </div>
              {openDropdown === row._uniqueId && (
                <div className="dropdown-menu">
                  {allowedButtons.map((button) => {
                    const action = buttonActionMap[button];
                    return (
                      <div
                        key={action}
                        className="dropdown-item"
                        onClick={() => handleDropdownAction(action, row._uniqueId)}
                      >
                        <img
                          src={
                            action === "edit"
                              ? edit_icon
                              : action === "view"
                              ? view_icon
                              : action === "send"
                              ? send_icon
                              : action === "approve"
                              ? approve_icon
                              : action === "hide"
                              ? hide_icon
                              : action === "return"
                              ? return_icon
                              : action === "delete"
                              ? delete_icon
                              : null
                          }
                          alt={button}
                        />
                        <a href="#">{button}</a>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        },
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
        width: "auto",
      },
    ],
    [
      openDropdown,
      selectedRows,
      areAllRowsSelected,
      filteredData.length,
      selectedRows.length,
    ]
  );

  const conditionalRowStyles = useMemo(
    () => [
      {
        when: (row) =>
          selectedRows.some(
            (selectedRow) => selectedRow._uniqueId === row._uniqueId
          ),
        style: {
          backgroundColor: "#1A6634",
          color: "#fff",
        },
      },
    ],
    [selectedRows]
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".option-button-container"))
        setOpenDropdown(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getStatusColor = (status) => {
    return (
      {
        "Đang soạn thảo": "#000",
        "Gửi duyệt": "#007bff",
        "Duyệt áp dụng": "#1A6634",
        "Ngừng áp dụng": "#FF0000",
        "Trả về": "#9E9E00",
      }[status] || "#000"
    );
  };

  const toggleDropdown = (uniqueId) => {
    setOpenDropdown(openDropdown === uniqueId ? null : uniqueId);
  };

  const isMultipleSelection = selectedRows.length > 1;

  useEffect(() => {
    if (selectedRows.length > 0 || showDeleteConfirm) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }, [selectedRows, showDeleteConfirm]);

  return (
    <div className="product-list">
      {}
      {(selectedRows.length > 0 || showDeleteConfirm) && (
        <div className="overlay"></div>
      )}

      <Toolbar
        onFilterChange={handleFilterChange}
        selectedStatuses={selectedStatuses}
        isDisabled={isMultipleSelection} // Pass disable state
      />
      <FilterHeader
        onSearch={handleSearch}
        isDisabled={isMultipleSelection} // Pass disable state
      />
      <div className="table-container">
        <DataTable
          className="data-table"
          columns={columns}
          data={filteredData}
          keyField="_uniqueId"
          pagination
          paginationPerPage={25}
          highlightOnHover
          paginationComponent={CustomPagination}
          noHeader
          conditionalRowStyles={conditionalRowStyles}
        />
      </div>
      {selectedRows.length > 0 && (
        <ActionPopup
          selectedCount={selectedRows.length}
          statuses={selectedRows.map((row) => row.status)}
          onSend={() => handleAction("send")}
          onApprove={() => handleAction("approve")}
          onHide={() => handleAction("hide")}
          onReturn={() => handleAction("return")}
          onDelete={handleDelete}
          onClose={() => {
            setSelectedRows([]);
          }}
        />
      )}
      {showDeleteConfirm && (
        <div className="delete-confirm-modal">
          <div className="delete">
            <img src={danger_icon} alt="" />
            <p>XÓA CÂU HỎI</p>
          </div>
          <div className="confirm-delete">
            <p>Bạn có chắc chắn muốn xóa phân nhóm</p>
            <p>Hệ thống cửa hàng Hachi Hachi có mặt từ năm nào?</p>
            <p>
              Đơn vị bị xóa sẽ <strong>KHÔNG</strong> thể khôi phục lại
            </p>
          </div>
          <div className="delete-button">
            <button onClick={handleDeleteCancel}>KHÔNG XÓA</button>
            <button onClick={handleDeleteConfirm}>
              <img src={delete_icon} alt="" />
              <p>XÓA</p>
            </button>
          </div>
        </div>
      )}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default ProductList;
