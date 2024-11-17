  import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
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
  import Header2 from "../Header2/Header2";
  import FilterBar from "../FilterBar/FilterBar";
  import ActionPopup from "../ActionPopup/ActionPopup";
  import Notification from "../Notification/Notification";

  const ProductList = () => {
    const [allData, setAllData] = useState(() => {
      return data.map((item, index) => ({ ...item, _uniqueId: index }));
    });
    const [deleteTargetIds, setDeleteTargetIds] = useState(new Set());
    const [filteredData, setFilteredData] = useState(allData);
    const [selectedRowIds, setSelectedRowIds] = useState(new Set());
    const [openDropdown, setOpenDropdown] = useState(null);
    const [selectedStatuses, setSelectedStatuses] = useState(["Đang soạn thảo"]);
    const [searchText, setSearchText] = useState("");
    const [notification, setNotification] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(25); 
    const [isActionPopupOpen, setIsActionPopupOpen] = useState(false);
    const header2Ref = useRef(null);

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

    const paginatedData = useMemo(() => {
      const start = (currentPage - 1) * rowsPerPage;
      const end = start + rowsPerPage;
      return filteredData.slice(start, end);
    }, [filteredData, currentPage, rowsPerPage]);

    const handleDeleteConfirm = useCallback(() => {
      setAllData((prevData) =>
        prevData.filter((item) => !deleteTargetIds.has(item._uniqueId))
      );
      showNotification(actionMessages.delete, "success");
      setSelectedRowIds((prevSelected) => {
        const newSelected = new Set(prevSelected);
        deleteTargetIds.forEach((id) => newSelected.delete(id));
        return newSelected;
      });
      setDeleteTargetIds(new Set());
      setShowDeleteConfirm(false);
    }, [deleteTargetIds, showNotification, actionMessages.delete]);
    

    const handleDeleteCancel = () => {
      setShowDeleteConfirm(false);
      setSelectedRowIds(new Set());
    };

    const handleDelete = useCallback(() => {
      if (selectedRowIds.size > 0) {
        setDeleteTargetIds(new Set(selectedRowIds));
        setShowDeleteConfirm(true);
      }
    }, [selectedRowIds]);
    

    const handleDropdownAction = useCallback(
      (action, itemUniqueId) => {
        const item = allData.find((item) => item._uniqueId === itemUniqueId);
        if (!item) return;
    
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
          showNotification(actionMessages.edit, "success");
        } else if (action === "view") {
          showNotification(actionMessages.view, "success");
        } else if (action === "delete") {
          setDeleteTargetIds(new Set([itemUniqueId]));
          setShowDeleteConfirm(true);
          return;
        } else {
          const newStatus = getNewStatus(action);
          setAllData((prevData) =>
            prevData.map((i) =>
              i._uniqueId === itemUniqueId ? { ...i, status: newStatus } : i
            )
          );
          showNotification(
            actionMessages[action] || "Thao tác thành công",
            "success"
          );
        }
        setOpenDropdown(null);
      },
      [allData, showNotification, actionMessages]
    );
    

    const handleAction = (action) => {
      const selectedItems = allData.filter((item) => selectedRowIds.has(item._uniqueId));

      const statusMap = {
        send: ["Đang soạn thảo", "Trả về"],
        approve: ["Gửi duyệt", "Ngừng áp dụng"],
        hide: ["Duyệt áp dụng"],
        return: ["Gửi duyệt", "Ngừng áp dụng"],
      };
      
      const invalidItems = selectedItems.filter(
        (item) => !statusMap[action].includes(item.status)
      );

      const incompleteItems = selectedItems.filter(
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

      const newStatus = getNewStatus(action);

      setAllData((prevData) =>
        prevData.map((item) =>
          selectedRowIds.has(item._uniqueId)
            ? { ...item, status: newStatus }
            : item
        )
      );

      showNotification(
        actionMessages[action] || "Thao tác thành công",
        "success"
      );

      setSelectedRowIds(new Set());
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

    const handleResetFilters = () => {
      setSelectedStatuses(["Đang soạn thảo"]);
      setSearchText("");
      if (header2Ref.current) {
        header2Ref.current.resetFilters();
      }
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
      setCurrentPage(1); 
      setSelectedRowIds(new Set()); 
    }, [allData, selectedStatuses, searchText]);

    const handleSelectAll = (event) => {
      const newSelectedRowIds = new Set(selectedRowIds);
      if (event.target.checked) {
        paginatedData.forEach((row) => newSelectedRowIds.add(row._uniqueId));
      } else {
        paginatedData.forEach((row) => newSelectedRowIds.delete(row._uniqueId));
      }
      setSelectedRowIds(newSelectedRowIds);
    };

    const handleRowSelect = (event, row) => {
      const newSelectedRowIds = new Set(selectedRowIds);
      if (event.target.checked) {
        newSelectedRowIds.add(row._uniqueId);
      } else {
        newSelectedRowIds.delete(row._uniqueId);
      }
      setSelectedRowIds(newSelectedRowIds);
    };

    const isRowSelected = (row) => selectedRowIds.has(row._uniqueId);

    const areAllRowsSelected = useMemo(
      () =>
        paginatedData.length > 0 &&
        paginatedData.every((row) => selectedRowIds.has(row._uniqueId)),
      [paginatedData, selectedRowIds]
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
                    const someSelected = paginatedData.some((row) =>
                      selectedRowIds.has(row._uniqueId)
                    );
                    input.indeterminate =
                      someSelected && !areAllRowsSelected;
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
                title={row.question}
              >
                <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
                  {row.question}
                </div>
                <div style={{ fontSize: "13px" }}>
                  ID: {row.id} <span style={{ color: "#BDC2D2" }}> | </span> Type: {row.type}
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
          cell: (row) => <div title={row.description}>{row.description}</div>, 
        },
        {
          name: "Thời gian làm",
          cell: (row) => (
            <div
              style={{ textAlign: "center", fontWeight: "bold" }}
              title={row.duration} 
            >
              {row.duration}
            </div>
          ),
          width: "15%",
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
              title={row.status}
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
                          key={`${row._uniqueId}-${action}`}
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
          width: "auto",
        },
      ],
      [openDropdown, selectedRowIds, areAllRowsSelected, paginatedData]
    );

    const conditionalRowStyles = useMemo(
      () => [
        {
          when: (row) => selectedRowIds.has(row._uniqueId),
          style: {
            backgroundColor: "#1A6634",
            color: "#fff",
          },
        },
      ],
      [selectedRowIds]
    );

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (!event.target.closest(".option-button-container")) setOpenDropdown(null);
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getStatusColor = (status) => {
      return {
        "Đang soạn thảo": "#000",
        "Gửi duyệt": "#007bff",
        "Duyệt áp dụng": "#1A6634",
        "Ngừng áp dụng": "#FF0000",
        "Trả về": "#9E9E00",
      }[status] || "#000";
    };

    const toggleDropdown = (uniqueId) => {
      setOpenDropdown(openDropdown === uniqueId ? null : uniqueId);
    };

    useEffect(() => {
      if (selectedRowIds.size > 0) {
        setIsActionPopupOpen(true);
      } else {
        setIsActionPopupOpen(false);
      }
    }, [selectedRowIds]);

    const handleChangePage = (page) => {
      setCurrentPage(page);
    };

    const handleChangeRowsPerPage = (newPerPage) => {
      setRowsPerPage(newPerPage);
      setCurrentPage(1); 
      setSelectedRowIds(new Set()); 
    };

    return (
      <div className="product-list">
        <Header2 ref={header2Ref} onFilterChange={handleFilterChange} isDisabled={selectedRowIds.size > 0 || showDeleteConfirm} />
        <FilterBar onSearch={handleSearch} isDisabled={selectedRowIds.size > 0 || showDeleteConfirm} onReset={handleResetFilters} />
        
        <div className="table-container">
          <DataTable
            style={{borderBottom:"1px solid black"}}
            className="data-table"
            columns={columns}
            data={paginatedData} 
            keyField="_uniqueId"
            highlightOnHover
            noHeader
            pagination={false} 
            conditionalRowStyles={conditionalRowStyles}
          />
          <CustomPagination
            rowsPerPage={rowsPerPage}
            rowCount={filteredData.length}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            currentPage={currentPage}
          />
        </div>

        {isActionPopupOpen && (
          <ActionPopup
            selectedCount={selectedRowIds.size}
            statuses={allData
              .filter((item) => selectedRowIds.has(item._uniqueId))
              .map((item) => item.status)}
            onSend={() => handleAction("send")}
            onApprove={() => handleAction("approve")}
            onHide={() => handleAction("hide")}
            onReturn={() => handleAction("return")}
            onDelete={handleDelete}
            onClose={() => {
              setSelectedRowIds(new Set());
              setIsActionPopupOpen(false);
            }}
          />
        )}

{showDeleteConfirm && (
  <div className="delete-confirm-modal">
    <div className="delete">
      <img src={danger_icon} alt="Danger" />
      <p>{"XÓA CÂU HỎI"}</p>
    </div>
    <div className="confirm-delete">
      <p>Bạn có chắc chắn muốn xóa {deleteTargetIds.size > 1 ? "các câu hỏi này?" : "câu hỏi này?"}</p>
      {deleteTargetIds.size === 1 ? (
        <p style={{ color: '#36C8CF' }}>
          {allData.find((item) => item._uniqueId === Array.from(deleteTargetIds)[0])?.question}
        </p>
      ) : (
        <ul style={{ color: '#36C8CF', listStyleType: 'none', padding: 0 }}>
          {Array.from(deleteTargetIds).slice(0, 3).map((id) => (
            <li key={id}>{allData.find((item) => item._uniqueId === id)?.question}</li>
          ))}
          {deleteTargetIds.size > 3 && <li>...</li>}
        </ul>
      )}
      <p style={{ color: '#000' }}>
        Đơn vị bị xóa sẽ <strong>KHÔNG</strong> thể khôi phục lại
      </p>
    </div>
    <div className="delete-button">
      <button onClick={handleDeleteCancel}>KHÔNG XÓA</button>
      <button onClick={handleDeleteConfirm}>
        <img src={delete_icon} alt="Xóa" />
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
