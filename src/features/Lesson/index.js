import React, { useState } from "react";
import BaseTablesCustom from "../../_shared/tables/BaseTablesCustom";
import ModalLesson from "./components/Modal/ModalLesson";
import Sidebar from "./components/Sidebar/Sidebar";

function Lesson(props) {
  const [filters, setFilters] = useState({
    Key: "",
    Pi: 1,
    Ps: 10,
  });
  const [PageTotal, setPageTotal] = useState(1);
  const [ModalAdd, setModalAdd] = useState(false);

  const onOpenModal = () => {
    setModalAdd(true);
  };

  const onHideModal = () => {
    setModalAdd(false);
  };

  return (
    <div className="container-fluid py-3">
      <div className="hpanel">
        <div className="panel-body">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="text-uppercase font-size-h3 mb-0">
              Quản lý nhóm bài giảng / Bài giảng
            </h2>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-4">
          <Sidebar />
        </div>
        <div className="col-lg-8">
          <div className="hpanel hgreen">
            <div className="panel-heading hbuilt">
              Danh sách bài giảng
              <button
                className="btn btn-sm btn-success position-absolute top-9px right-9px"
                onClick={() => onOpenModal()}
              >
                Thêm mới
              </button>
            </div>
            <div className="panel-body overflow-visible">
              <BaseTablesCustom
                data={[{ Id: 1, Name: "abc" }]}
                options={{
                  custom: true,
                  totalSize: PageTotal,
                  page: filters.Pi,
                  sizePerPage: filters.Ps,
                  alwaysShowAllBtns: true,
                  onSizePerPageChange: (sizePerPage) => {
                    // setTreatmentInfo([]);
                    // const Ps = sizePerPage;
                    // setFilters({ ...filters, Ps: Ps });
                  },
                  onPageChange: (page) => {
                    // setTreatmentInfo([]);
                    // const Pi = page;
                    // setFilters({ ...filters, Pi: Pi });
                  },
                }}
                columns={[
                  {
                    dataField: "",
                    text: "STT",
                    formatter: (cell, row, rowIndex) => {
                      const rowNumber =
                        filters.Ps * (filters.Pi - 1) + (rowIndex + 1);
                      return rowNumber;
                    },
                    headerStyle: () => {
                      return { width: "60px", fontWeight: "800" };
                    },
                    headerAlign: "center",
                    style: { textAlign: "center" },
                    attrs: { "data-title": "STT" },
                  },
                ]}
                loading={false}
                keyField="Id"
                className="table-responsive-attr"
                classes="table table-bordered"
              />
            </div>
          </div>
        </div>
        <ModalLesson show={ModalAdd} onHide={onHideModal} />
      </div>
    </div>
  );
}

export default Lesson;
