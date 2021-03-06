import React, { useEffect, useState } from "react";
import { isDevelopment } from "../../helpers/DevelopmentHelpers";
import { getRequestParams } from "../../helpers/ParamsHelpers";
import BaseTablesCustom from "../../_shared/tables/BaseTablesCustom";
import ModalSchool from "./components/Modal/ModalSchool";
import ModalContacts from "./components/Modal/ModalContacts";
import SchoolManageCrud from "./_redux/SchoolManageCrud";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import ModalClass from "./components/Modal/ModalClass";
import FiltersSchool from "./components/Filters/FiltersSchool";

function SchoolManage(props) {
  const [filters, setFilters] = useState({
    _pi: 1,
    _ps: 10,
    _key: "",
    _orders: {
      Id: true,
    },
  });
  const [ListSchool, setListSchool] = useState([]);
  const [PageTotal, setPageTotal] = useState(0);
  const [VisibleModal, setVisibleModal] = useState({
    School: false,
    Contacts: false,
    Class: false,
  });
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState({
    School: false,
    Contacts: false,
    Class: false,
  });
  const [defaultValues, setDefaultValues] = useState({});

  const retrieveSchool = (callback) => {
    !loading && setLoading(true);
    const params = getRequestParams(filters);
    SchoolManageCrud.getAllSchool(params)
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
          setListSchool(list);
          setPageTotal(total);
          setLoading(false);
          callback && callback();
        }
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    retrieveSchool();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const onFilters = (values) => {
    const newObj = {
      _pi: 1,
      _key: values._key,
    };
    newObj.PID = values.PID ? values.PID.value : "";
    newObj.DID = values.DID ? values.DID.value : "";
    newObj.LevelJson = values.LevelJson ? `~${values.LevelJson.value}` : "";
    setFilters((prevState) => ({ ...prevState, ...newObj }));
  };

  const openModalSchool = (item = {}) => {
    setDefaultValues(item);
    setVisibleModal((prevState) => ({ ...prevState, School: true }));
  };
  const openModalContacts = (item = {}) => {
    setDefaultValues(item);
    setVisibleModal((prevState) => ({ ...prevState, Contacts: true }));
  };
  const openModalClass = (item = {}) => {
    setDefaultValues(item);
    setVisibleModal((prevState) => ({ ...prevState, Class: true }));
  };

  const hideModalSchool = () => {
    setDefaultValues({});
    setVisibleModal((prevState) => ({ ...prevState, School: false }));
  };

  const hideModalContacts = () => {
    setDefaultValues({});
    setVisibleModal((prevState) => ({ ...prevState, Contacts: false }));
  };
  const hideModalClass = () => {
    setDefaultValues({});
    setVisibleModal((prevState) => ({ ...prevState, Class: false }));
  };

  const onSubmitContacts = (values) => {
    const objPost = {
      ID: values.ID,
      Title: values.Title,
      Phone: values.Phone,
      Email: values.Email,
      Address: values.Address,
      Contacts:
        values.Contacts &&
        values.Contacts.filter((item) => typeof item === "object" && item.ten),
    };
    if (values.City) {
      objPost.PID = values.City.value;
      objPost.PTitle = values.City.label;
    }
    if (values.District) {
      objPost.DID = values.District.value;
      objPost.DTitle = values.District.label;
    }
    objPost.Levels = values.Levels ? [values.Levels] : [];
    setBtnLoading((prevState) => ({ ...prevState, Contacts: true }));
    SchoolManageCrud.addEditSchool(objPost)
      .then((response) => {
        retrieveSchool(() => {
          hideModalContacts();
          setBtnLoading((prevState) => ({ ...prevState, Contacts: false }));
          toast.success("Cập nhập liên hệ thành công", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1500,
          });
        });
      })
      .catch((error) => console.log(error));
  };

  const onSubmitClass = (values) => {
    setBtnLoading((prevState) => ({ ...prevState, Class: true }));
    const objSubmit = {
      SchoolID: values.ID,
      ClassList: values.ClassList.filter(
        (item) => typeof item === "object" && item.Title
      ).map((item) => ({
        ...item,
        Level: item?.Level?.value ? item.Level.value : "",
      })),
    };
    SchoolManageCrud.addEditClass(objSubmit)
      .then((response) => {
        retrieveSchool(() => {
          hideModalClass();
          setBtnLoading((prevState) => ({ ...prevState, Class: false }));
          toast.success("Cập nhập lớp thành công", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1500,
          });
        });
      })
      .catch((error) => console.log(error));
  };

  const onAddEdit = (values) => {
    const objPost = {
      Title: values.Title,
      Phone: values.Phone,
      Email: values.Email,
      Address: values.Address,
      Contacts: values.Contacts,
      Lat: values.Lat,
      Lng: values.Lng,
      HourScheduleList: values.HourScheduleList
    };
    if (values.ID) {
      objPost.ID = values.ID;
    }
    if (values.City) {
      objPost.PID = values.City.value;
      objPost.PTitle = values.City.label;
    }
    if (values.District) {
      objPost.DID = values.District.value;
      objPost.DTitle = values.District.label;
    }
    objPost.Levels = values.Levels ? [values.Levels] : [];
    setBtnLoading((prevState) => ({ ...prevState, School: true }));
    SchoolManageCrud.addEditSchool(objPost)
      .then((response) => {
        retrieveSchool(() => {
          hideModalSchool();
          setBtnLoading((prevState) => ({ ...prevState, School: false }));
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
    if (item.ClassList && item.ClassList.length > 0) {
      Swal.fire({
        title: `Không thể xóa trường ${item.Title} ?`,
        text: "Bạn cần xóa hết danh sách lớp để có thể thực hiện xóa trường ?",
        icon: "warning",
        confirmButtonColor: "#3699FF",
        cancelButtonText: "Đóng",
        showLoaderOnConfirm: true,
      });
      return;
    }
    const dataPost = {
      deleteId: item.ID,
    };
    Swal.fire({
      title: "Bạn muốn xóa trường ?",
      text: "Bạn có chắc chắn muốn xóa trường này không ?",
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
          SchoolManageCrud.deleteSchool(dataPost)
            .then(() => {
              retrieveSchool(() => {
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
        toast.success("Xóa trường thành công !", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1500,
        });
      }
    });
  };

  return (
    <div className={`container-fluid ${isDevelopment() ? "py-3" : "p-0"}`}>
      <div className="hpanel">
        <div className="panel-body">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="text-uppercase font-size-h3 mb-0">
              Quản lý trường lớp
            </h2>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="hpanel hgreen">
            <div className="panel-heading hbuilt">
              Danh sách trường lớp
              <button
                type="button"
                className="btn btn-sm btn-fix btn-success position-absolute top-9px right-9px"
                onClick={openModalSchool}
              >
                Thêm mới
              </button>
            </div>
            <div className="panel-body overflow-visible">
              <FiltersSchool onSubmit={onFilters} loading={loading} />
              <BaseTablesCustom
                data={ListSchool}
                textDataNull="Không có dữ liệu."
                options={{
                  custom: true,
                  totalSize: PageTotal,
                  page: filters._pi,
                  sizePerPage: filters._ps,
                  alwaysShowAllBtns: true,
                  onSizePerPageChange: (sizePerPage) => {
                    setListSchool([]);
                    const Ps = sizePerPage;
                    setFilters({ ...filters, _ps: Ps });
                  },
                  onPageChange: (page) => {
                    setListSchool([]);
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
                    text: "Tên trường",
                    //headerAlign: "center",
                    //style: { textAlign: "center" },
                    attrs: { "data-title": "Tên trường" },
                    headerStyle: () => {
                      return { minWidth: "200px", width: "200px" };
                    },
                  },
                  {
                    dataField: "Email",
                    text: "TEL / Email",
                    //headerAlign: "center",
                    //style: { textAlign: "center" },
                    attrs: { "data-title": "TEL / Email" },
                    formatter: (cell, row) => (
                      <div>
                        <div>{row.Phone}</div>
                        <div>{row.Email}</div>
                      </div>
                    ),
                    headerStyle: () => {
                      return { minWidth: "200px", width: "200px" };
                    },
                  },
                  {
                    dataField: "LevelJson",
                    text: "Cấp",
                    //headerAlign: "center",
                    //style: { textAlign: "center" },
                    attrs: { "data-title": "Cấp" },
                    formatter: (cell, row) => (
                      <div>
                        {row.LevelJson &&
                          JSON.parse(row.LevelJson) &&
                          JSON.parse(row.LevelJson)[0]?.Title}
                      </div>
                    ),
                    headerStyle: () => {
                      return { minWidth: "100px", width: "100px" };
                    },
                  },
                  {
                    dataField: "Address",
                    text: "Địa chỉ",
                    //headerAlign: "center",
                    //style: { textAlign: "center" },
                    attrs: { "data-title": "Địa chỉ" },
                    formatter: (cell, row) => (
                      <div>
                        <div>{row.Address}</div>
                        <div>
                          Tỉnh : {row.PTitle ? row.PTitle : "Chưa có tỉnh"}
                        </div>
                        <div>
                          Huyện : {row.DTitle ? row.DTitle : "Chưa có huyện"}
                        </div>
                      </div>
                    ),
                    headerStyle: () => {
                      return { minWidth: "250px", width: "250px" };
                    },
                  },
                  {
                    dataField: "Contacts",
                    text: "Người liên hệ",
                    //headerAlign: "center",
                    //style: { textAlign: "center" },
                    attrs: { "data-title": "Người liên hệ" },
                    formatter: (cell, row) => (
                      <div
                        className="text-underline cursor-pointer"
                        onClick={() => openModalContacts(row)}
                      >
                        <span className="font-weight-border">
                          [{row.Contacts.length}]
                        </span>{" "}
                        liên hệ
                      </div>
                    ),
                    headerStyle: () => {
                      return { minWidth: "150px", width: "150px" };
                    },
                  },
                  {
                    dataField: "ClassList",
                    text: "Lớp",
                    //headerAlign: "center",
                    //style: { textAlign: "center" },
                    attrs: { "data-title": "Lớp" },
                    formatter: (cell, row) => (
                      <div
                        className="text-underline cursor-pointer"
                        onClick={() => openModalClass(row)}
                      >
                        <span className="font-weight-border">
                          [{(row.ClassList && row.ClassList.length) || 0}]
                        </span>{" "}
                        lớp
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
                            onClick={() => openModalSchool(row)}
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
      <ModalSchool
        show={VisibleModal.School}
        onHide={hideModalSchool}
        onAddEdit={onAddEdit}
        btnLoading={btnLoading.School}
        defaultValues={defaultValues}
      />
      <ModalContacts
        defaultValues={defaultValues}
        show={VisibleModal.Contacts}
        onHide={hideModalContacts}
        onAddEdit={onSubmitContacts}
        btnLoading={btnLoading.Contacts}
      />
      <ModalClass
        defaultValues={defaultValues}
        show={VisibleModal.Class}
        onHide={hideModalClass}
        onAddEdit={onSubmitClass}
        btnLoading={btnLoading.Class}
      />
    </div>
  );
}

export default SchoolManage;
