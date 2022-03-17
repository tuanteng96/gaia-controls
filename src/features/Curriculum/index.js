import React, { useEffect, useRef, useState } from "react";
import { isDevelopment } from "../../helpers/DevelopmentHelpers";
import { getRequestParams } from "../../helpers/ParamsHelpers";
import BaseTablesCustom from "../../_shared/tables/BaseTablesCustom";
import CurriculumCrud from "./_redux/CurriculumCrud";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import ModalKTT from "./components/Modal/ModalKTT";

function Curriculum(props) {
  const [filters, setFilters] = useState({
    _pi: 1,
    _ps: 10,
    _key: "",
    Status: 1,
    _orders: {},
    _ignoredf: ["Status"],
  });
  const [PageTotal, setPageTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [ListCurriculum, setListCurriculum] = useState([]);
  const [VisibleModal, setVisibleModal] = useState(false);
  const [defaultValues, setDefaultValues] = useState({});
  const [btnLoading, setBtnLoading] = useState(false);

  const typingTimeoutRef = useRef(null);

  const retrieveCurriculum = (callback) => {
    !loading && setLoading(true);
    const params = getRequestParams(filters);
    CurriculumCrud.getAll(params)
      .then(({ list, total, error, right }) => {
        if (error && right) {
          Swal.fire({
            icon: "error",
            title: "Bạn không có quyền.",
            text: "Vui lòng xin cấp quyền để truy cập !",
            confirmButtonColor: "#3699FF",
            allowOutsideClick: false,
          }).then(() => {
            window.location.href = "/";
          });
        } else {
          setListCurriculum(list);
          setPageTotal(total);
          setLoading(false);
          callback && callback();
        }
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    retrieveCurriculum();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const openModal = (item = {}) => {
    setDefaultValues(item);
    setVisibleModal(true);
  };
  const hideModal = (item = {}) => {
    setDefaultValues(item);
    setVisibleModal(false);
  };

  const onAddEdit = (values) => {
    setBtnLoading(true);
    const objPost = {
      ...values,
      Status: values.Status ? values.Status.value : 1,
      SchoolList:
        values.SchoolList && values.SchoolList.length > 0
          ? values.SchoolList.map((item) => ({
              ID: item.ID,
              Title: item.Title,
            }))
          : [],
      Levels: values.Levels ? values.Levels.value : "",
    };
    CurriculumCrud.addEdit(objPost)
      .then((response) => {
        retrieveCurriculum(() => {
          hideModal();
          setBtnLoading(false);
          toast.success(
            values.ID ? "Cập nhập thành công !" : "Thêm mới thành công",
            {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 1500,
            }
          );
        });
      })
      .catch((error) => console.log(error));
  };
  const onDelete = (item) => {
    if (!item.ID) return;
    const dataPost = {
      deleteId: item.ID,
    };
    Swal.fire({
      title: "Bạn muốn xóa Khung trương trình ?",
      text: "Bạn có chắc chắn muốn xóa Khung trương trình này không ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6e7881",
      confirmButtonText: "Tôi muốn xóa!",
      cancelButtonText: "Đóng",
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
      preConfirm: () => {
        return new Promise((resolve, reject) => {
          CurriculumCrud.Delete(dataPost)
            .then(() => {
              retrieveCurriculum(() => {
                setTimeout(() => {
                  resolve();
                }, 300);
              });
            })
            .catch((error) => console.log(error));
        });
      },
    }).then((result) => {
      if (result.isConfirmed) {
        toast.success("Xóa Khung trương trình thành công !", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1500,
        });
      }
    });
  };

  const RenderCountLess = (lessons) => {
    if (lessons && lessons.length === 0) {
      return (
        <span className="text-decoration-underline cursor-pointer">
          Chưa có bài giảng
        </span>
      );
    }
    if (lessons && lessons.length > 0) {
      var total = 0;
      for (var lesson of lessons) {
        total += lesson.Lessons.length;
      }
      return (
        <span className="text-decoration-underline cursor-pointer">
          Có {total} bài giảng
        </span>
      );
    }
  };

  const onChangeSearch = (value) => {
    setLoading(true);
    setListCurriculum([]);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      if (value) {
        setFilters({ ...filters, _Pi: 1, _key: value });
      } else {
        setFilters({ ...filters, _Pi: 1, _key: value });
      }
    }, 500);
  };

  return (
    <div className={`container-fluid ${isDevelopment() ? "py-3" : "p-0"}`}>
      <div className="hpanel">
        <div className="panel-body">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="text-uppercase font-size-h3 mb-0">
              Khung chương trình
            </h2>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="hpanel hgreen">
            <div className="panel-heading hbuilt">
              Danh sách khung chương trình
              <button
                type="button"
                className="btn btn-sm btn-fix btn-success position-absolute top-9px right-9px"
                onClick={openModal}
              >
                Thêm mới
              </button>
            </div>
            <div className="panel-body overflow-visible">
              <div className="max-w-450px mb-4 position-relative">
                <input
                  type="text"
                  className="form-control pr-50px"
                  placeholder="Nhập tên khung chương trình ..."
                  onChange={(e) => onChangeSearch(e.target.value)}
                />
                <div className="position-absolute top-12px right-15px pointer-events-none">
                  <i className="far fa-search"></i>
                </div>
              </div>
              <BaseTablesCustom
                data={ListCurriculum}
                textDataNull="Không có dữ liệu."
                options={{
                  custom: true,
                  totalSize: PageTotal,
                  page: filters._pi,
                  sizePerPage: filters._ps,
                  alwaysShowAllBtns: true,
                  onSizePerPageChange: (sizePerPage) => {
                    setListCurriculum([]);
                    const Ps = sizePerPage;
                    setFilters({ ...filters, _ps: Ps });
                  },
                  onPageChange: (page) => {
                    setListCurriculum([]);
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
                    text: "Tên khung chương trình",
                    //headerAlign: "center",
                    //style: { textAlign: "center" },
                    attrs: { "data-title": "Tên trường" },
                    headerStyle: () => {
                      return { minWidth: "250px", width: "250px" };
                    },
                  },
                  {
                    dataField: "Cấp",
                    text: "Cấp",
                    //headerAlign: "center",
                    //style: { textAlign: "center" },
                    attrs: { "data-title": "Số điện thoại" },
                    formatter: (cell, row) => (
                      <div>
                        {row.Levels ? `Cấp ${row.Levels}` : "Chưa chọn cấp"}
                      </div>
                    ),
                    headerStyle: () => {
                      return { minWidth: "100px", width: "100px" };
                    },
                  },
                  {
                    dataField: "SchoolList",
                    text: "Trường",
                    //headerAlign: "center",
                    //style: { textAlign: "center" },
                    attrs: { "data-title": "Trường" },
                    formatter: (cell, row) => (
                      <div>
                        {row.SchoolList && row.SchoolList.length > 0
                          ? row.SchoolList.map((item) => item.Title).join(", ")
                          : "Chưa có trường"}
                      </div>
                    ),
                    headerStyle: () => {
                      return { minWidth: "250px", width: "250px" };
                    },
                  },
                  {
                    dataField: "Desc",
                    text: "Mô tả",
                    //headerAlign: "center",
                    //style: { textAlign: "center" },
                    attrs: { "data-title": "Mô tả" },
                    formatter: (cell, row) => (
                      <div>{row.Desc ? row.Desc : "Chưa có mô tả"}</div>
                    ),
                    headerStyle: () => {
                      return { minWidth: "200px", width: "200px" };
                    },
                  },
                  {
                    dataField: "LessonList",
                    text: "Bài giảng",
                    //headerAlign: "center",
                    //style: { textAlign: "center" },
                    attrs: { "data-title": "Bài giảng" },
                    formatter: (cell, row) => (
                      <div
                        onClick={() => openModal({ ...row, isLesson: true })}
                      >
                        {RenderCountLess(row.LessonList)}
                      </div>
                    ),
                    headerStyle: () => {
                      return { minWidth: "250px", width: "250px" };
                    },
                  },
                  {
                    dataField: "Status",
                    text: "Trạng thái",
                    //headerAlign: "center",
                    //style: { textAlign: "center" },
                    attrs: { "data-title": "Trạng thái" },
                    formatter: (cell, row) => (
                      <div>
                        <label
                          className={`label label-${
                            Number(row.Status) ? "success" : "danger"
                          }`}
                        >
                          {Number(row.Status) === 1
                            ? "Hoạt động"
                            : "Ngừng hoạt động"}
                        </label>
                      </div>
                    ),
                    headerStyle: () => {
                      return { minWidth: "150px", width: "150px" };
                    },
                  },
                  {
                    dataField: "#",
                    text: "#",
                    formatter: (cell, row) => {
                      return (
                        <div className="text-center">
                          <button
                            type="button"
                            className="btn btn-sm btn-primary w-24px h-24px"
                            onClick={() => openModal(row)}
                          >
                            <i
                              className="fas fa-pen icon-sm pe-0"
                              aria-hidden="true"
                            ></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-danger ms-2 w-24px h-24px"
                            onClick={() => onDelete(row)}
                          >
                            <i
                              className="fas fa-trash icon-sm pe-0"
                              aria-hidden="true"
                            ></i>
                          </button>
                        </div>
                      );
                    },
                    headerAlign: "center",
                    headerStyle: () => {
                      return { minWidth: "85px", width: "85px" };
                    },
                    attrs: { "data-action": "true" },
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
      <ModalKTT
        show={VisibleModal}
        onHide={hideModal}
        defaultValues={defaultValues}
        onAddEdit={onAddEdit}
        btnLoading={btnLoading}
      />
    </div>
  );
}

export default Curriculum;
