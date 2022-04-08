import React, { Fragment, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AlertError } from "../../../../helpers/AlertHelpers";
import { getRequestParams } from "../../../../helpers/ParamsHelpers";
import BaseTablesCustom from "../../../../_shared/tables/BaseTablesCustom";
import ToolsEmExCrud from "../../_redux/ToolsEmExCrud";
import Select from "react-select";
import { AsyncPaginate } from "react-select-async-paginate";
import TeacherCrud from "../../../Teacher/_redux/TeacherCrud";

function Inventory(props) {
  const [filters, setFilters] = useState({
    _key: "",
    _teacherid: 0,
    _pi: 1,
    _ps: 10,
  });
  const [ListInventory, setListInventory] = useState([]);
  const [PageTotal, setPageTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [Type, setType] = useState({
    label: "Tồn kho tổng",
    value: 0,
  });
  const [TeacherCurrent, setTeacherCurrent] = useState(null);
  const typingTimeoutRef = useRef(null);

  const retrieveInventory = (callback) => {
    !loading && setLoading(true);
    const params = getRequestParams(filters);
    ToolsEmExCrud.getInventory(params)
      .then(({ list, total, error, right }) => {
        if (error && right) {
          AlertError({
            title: "Xảy ra lỗi",
            errorTitle: "Bạn không có quyền truy cập chức năng này.",
            error: error,
          });
        } else {
          setListInventory(list);
          setPageTotal(total);
          setLoading(false);
          callback && callback();
        }
      })
      .catch(({ response }) => {
        AlertError({
          title: "Xảy ra lỗi",
          errorTitle: "Không thể truy cập chức năng này.",
          error: response.data.error,
        });
      });
  };

  useEffect(() => {
    retrieveInventory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const onChangeSearch = (value) => {
    setLoading(true);
    setListInventory([]);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setFilters({ ...filters, _Pi: 1, _key: value });
    }, 500);
  };

  const getAllTeacher = async (search, loadedOptions, { page }) => {
    const newPost = {
      _pi: page,
      _ps: 10,
      _key: search,
      Status: 1,
      _orders: {
        Id: true,
      },
      _appends: {
        IsSchoolTeacher: 1,
      },
      _ignoredf: ["Status"],
    };

    const { list, pcount } = await TeacherCrud.getAllTeacher(newPost);
    const newData =
      list && list.length > 0
        ? list.map((item) => ({
            ...item,
            label: item.FullName,
            value: item.ID,
          }))
        : [];
    return {
      options: newData,
      hasMore: page < pcount,
      additional: {
        page: page + 1,
      },
    };
  };

  return (
    <Fragment>
      <div className="hpanel">
        <div className="panel-body">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="text-uppercase font-size-h3 mb-0">Hàng tồn</h2>
            <div>
              <Link
                to="/nhap-xuat-giao-cu"
                className="btn btn-outline-secondary"
              >
                <i className="fal fa-angle-double-left"></i>Quay lại
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="hpanel hgreen">
            <div className="panel-heading hbuilt">Danh sách tồn kho</div>
            <div className="panel-body overflow-visible">
              <div className="mb-4 d-flex">
                <div className="w-350px position-relative">
                  <input
                    type="text"
                    className="form-control pr-50px"
                    placeholder="Nhập tên ..."
                    onChange={(e) => onChangeSearch(e.target.value)}
                  />
                  <div className="position-absolute top-12px right-15px pointer-events-none">
                    <i className="far fa-search"></i>
                  </div>
                </div>
                <div className="w-250px ml-10px">
                  <Select
                    className="select-control"
                    classNamePrefix="select"
                    name="Status"
                    options={[
                      {
                        label: "Tồn kho tổng",
                        value: 0,
                      },
                      {
                        label: "Tồn kho giáo viên",
                        value: 1,
                      },
                    ]}
                    placeholder="Trạng thái"
                    value={Type}
                    onChange={(option) => {
                      setType(option);
                      setTeacherCurrent(null);
                    }}
                    menuPosition="fixed"
                  />
                </div>
                {Type.value === 1 && (
                  <div className="w-250px ml-10px">
                    <AsyncPaginate
                      className="select-control"
                      classNamePrefix="select"
                      isClearable={true}
                      name="TeacherID"
                      loadOptions={getAllTeacher}
                      placeholder="Chọn giáo viên"
                      value={TeacherCurrent}
                      onChange={(option) => {
                        setLoading(true);
                        setFilters({
                          ...filters,
                          _teacherid: option?.ID ? option.ID : 0,
                        });
                        setTeacherCurrent(option);
                      }}
                      additional={{
                        page: 1,
                      }}
                    />
                  </div>
                )}
              </div>
              <BaseTablesCustom
                data={ListInventory}
                textDataNull="Không có dữ liệu."
                options={{
                  custom: true,
                  totalSize: PageTotal,
                  page: filters._pi,
                  sizePerPage: filters._ps,
                  alwaysShowAllBtns: true,
                  onSizePerPageChange: (sizePerPage) => {
                    setListInventory([]);
                    const Ps = sizePerPage;
                    setFilters({ ...filters, _ps: Ps });
                  },
                  onPageChange: (page) => {
                    setListInventory([]);
                    const Pi = page;
                    setFilters({ ...filters, _pi: Pi });
                  },
                }}
                columns={[
                  {
                    dataField: "",
                    text: "STT",
                    formatter: (cell, row, rowIndex) => {
                      const rowNumber =
                        filters._ps * (filters._pi - 1) + (rowIndex + 1);
                      return rowNumber;
                    },
                    headerStyle: () => {
                      return { width: "60px", fontWeight: "800" };
                    },
                    headerAlign: "center",
                    style: { textAlign: "center" },
                    attrs: { "data-title": "STT" },
                  },
                  {
                    dataField: "Title",
                    text: "Tên",
                    //headerAlign: "center",
                    //style: { textAlign: "center" },
                    attrs: { "data-title": "Tên" },
                    headerStyle: () => {
                      return { minWidth: "350px" };
                    },
                  },
                  {
                    dataField: "Code",
                    text: "Hàng tồn",
                    headerAlign: "center",
                    style: { textAlign: "center" },
                    attrs: { "data-title": "Mã" },
                    formatter: (cell, row) => <div>{row.RemainQty}</div>,
                    headerStyle: () => {
                      return { minWidth: "200px", width: "200px" };
                    },
                  },
                ]}
                loading={loading}
                keyField="ID"
                className="table-responsive-attr"
                classes="table table-bordered"
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default Inventory;
