import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import BaseTablesCustom from "../../_shared/tables/BaseTablesCustom";
import ModalLesson from "./components/Modal/ModalLesson";
import Sidebar from "./components/Sidebar/Sidebar";
import LessonCrud from "./_redux/LessonCrud";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { toAbsoluteUrl } from "../../helpers/AssetsHelpers";
import { useParams } from "react-router-dom";
import { isDevelopment } from "../../helpers/DevelopmentHelpers";
import { getRequestParams } from "../../helpers/ParamsHelpers";
import Select from "react-select";

const ListKHOI = () => {
  const List = [];
  for (let x = 1; x <= 12; x++) {
    List.push({
      label: "Khối " + x,
      value: x,
    });
  }
  return List;
};

const LessonContext = createContext();

export const useLession = () => useContext(LessonContext);

function UploadFiles({ onChange, accept = "*" }) {
  const inputRef = useRef();

  const chooseFile = () => {
    inputRef.current.click();
  };

  return (
    <>
      <button
        onClick={chooseFile}
        type="button"
        className="text-success border-0 bg-transparent p-0 text-underline"
        style={{ fontWeight: "500", fontSize: "13px" }}
      >
        Upload
      </button>
      <input
        value={""}
        onChange={async (event) => {
          toast.loading("Đang upload...");

          if (event.target.files && event.target.files[0]) {
            const { name } = event.target.files[0];
            try {
              const { name: nameFile } = await LessonCrud.uploadFile(
                name,
                event.target.files[0]
              );
              onChange(nameFile);
            } catch (error) {
              console.log(error);
            }
          }
        }}
        id="select-file"
        type="file"
        ref={inputRef}
        className="d-none"
        accept={accept}
      />
    </>
  );
}

function Lesson(props) {
  const { id } = useParams();
  const [filters, setFilters] = useState({
    Type: 662,
    _pi: 1,
    _ps: 10,
    _key: "",
    _orders: {
      RenewDate: true,
    },
    Version: "",
  });
  const [TitleCate, setTitleCate] = useState("Tất cả");
  const [ListLesson, setListLesson] = useState([]);
  const [PageTotal, setPageTotal] = useState(0);
  const [ModalAdd, setModalAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [defaultValues, setDefaultValues] = useState({});

  const typingTimeoutRef = useRef(null);

  const retrieveLesson = (callback) => {
    !loading && setLoading(true);
    const params = getRequestParams(filters);

    LessonCrud.getListLesson(params)
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
          setListLesson(list);
          setPageTotal(total);
          setLoading(false);
          callback && callback();
        }
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    if (id) {
      setFilters((prevState) => ({ ...prevState, Type: id }));
    }
  }, [id]);

  useEffect(() => {
    retrieveLesson();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const onOpenModal = (item = {}) => {
    setDefaultValues(item);
    setModalAdd(true);
  };

  const onHideModal = () => {
    setDefaultValues({});
    setModalAdd(false);
  };

  const onAddEdit = ({ List, ...values }) => {
    setBtnLoading(true);
    const dataPost = {
      list:
        List &&
        List.map((x) => ({
          ...x,
          FileMaHoa: x.FileMaHoa ? x.FileMaHoa.value : "",
          LinkOnline: x.LinkOnline ? x.LinkOnline.value : "",
        })),
    };

    LessonCrud.addEditLessonMuti(dataPost)
      .then(() => {
        retrieveLesson(() => {
          onHideModal();
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

  const onUpdate = (values) =>
    new Promise((resolve) => {
      const objPost = {
        ...values,
      };
      LessonCrud.addEditLesson(objPost)
        .then(() => {
          retrieveLesson(() => {
            resolve();
          });
        })
        .catch((error) => console.log(error));
    });

  const onDelete = (item) => {
    if (!item.ID) return;
    const dataPost = {
      deleteId: item.ID,
    };
    Swal.fire({
      title: "Bạn muốn xóa bài giảng ?",
      text: "Bạn có chắc chắn muốn xóa bài giảng này không ?",
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
          LessonCrud.deleteLesson(dataPost)
            .then(() => {
              retrieveLesson(() => {
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
        toast.success("Xóa bài giảng thành công !", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1500,
        });
      }
    });
  };

  const onChangeSearch = (value) => {
    setLoading(true);
    setListLesson([]);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      if (value) {
        setFilters({ ...filters, _Pi: 1, _key: value, Type: 662 });
      } else {
        setFilters({ ...filters, _Pi: 1, _key: value, Type: id });
      }
    }, 500);
  };

  return (
    <LessonContext.Provider
      value={{
        updateTitle: (val) => setTitleCate(val),
      }}
    >
      <div className={`container-fluid ${isDevelopment() ? "py-3" : "p-0"}`}>
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
            <Sidebar openModal={onOpenModal} />
          </div>
          <div className="col-lg-8">
            <div className="hpanel hgreen">
              <div className="panel-heading hbuilt">
                Danh sách bài giảng - {TitleCate}
                <button
                  type="button"
                  className="btn btn-sm btn-fix btn-success position-absolute top-9px right-9px"
                  onClick={() => onOpenModal(id ? { Type: id } : "")}
                >
                  Thêm mới
                </button>
              </div>
              <div className="panel-body overflow-visible">
                <div className="d-flex mb-4">
                  <div className="w-400px position-relative mr-12px">
                    <input
                      type="text"
                      className="form-control pr-50px"
                      placeholder="Nhập tên bài giảng ..."
                      onChange={(e) => onChangeSearch(e.target.value)}
                    />
                    <div className="position-absolute top-12px right-15px pointer-events-none">
                      <i className="far fa-search"></i>
                    </div>
                  </div>
                  <Select
                    className={`select-control w-200px`}
                    classNamePrefix="select"
                    isClearable
                    isSearchable={true}
                    name="Version"
                    options={ListKHOI()}
                    placeholder="Chọn khối"
                    value={filters.Version}
                    onChange={(option) => {
                      setFilters((prevState) => ({
                        ...prevState,
                        Version: option,
                      }));
                    }}
                  />
                </div>
                <BaseTablesCustom
                  data={ListLesson}
                  textDataNull="Không có dữ liệu."
                  options={{
                    custom: true,
                    totalSize: PageTotal,
                    page: filters._pi,
                    sizePerPage: filters._ps,
                    alwaysShowAllBtns: true,
                    onSizePerPageChange: (sizePerPage) => {
                      setListLesson([]);
                      const Ps = sizePerPage;
                      setFilters({ ...filters, _ps: Ps });
                    },
                    onPageChange: (page) => {
                      setListLesson([]);
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
                      text: "Tên bài giảng",
                      //headerAlign: "center",
                      //style: { textAlign: "center" },
                      attrs: { "data-title": "Tên" },
                      headerStyle: () => {
                        return { minWidth: "250px", width: "250px" };
                      },
                    },
                    // {
                    //   dataField: "DynamicID",
                    //   text: "Mã",
                    //   //headerAlign: "center",
                    //   //style: { textAlign: "center" },
                    //   attrs: { "data-title": "Mã" },
                    //   headerStyle: () => {
                    //     return { minWidth: "100%", width: "85px" };
                    //   },
                    // },
                    {
                      dataField: "Version",
                      text: "Khối",
                      //headerAlign: "center",
                      //style: { textAlign: "center" },
                      attrs: { "data-title": "Khối" },
                      formatter: (cell, row) => <div>{row.Version}</div>,
                      headerStyle: () => {
                        return { minWidth: "100px", width: "100px" };
                      },
                    },
                    {
                      dataField: "GiaoAnPdf",
                      text: "Giáo án",
                      //headerAlign: "center",
                      //style: { textAlign: "center" },
                      attrs: { "data-title": "Giáo án" },
                      formatter: (cell, row) => (
                        <div className="w-100">
                          {row.GiaoAnPdf && (
                            <a
                              href={toAbsoluteUrl(
                                `/upload/image/${row.GiaoAnPdf}`
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="d-inline-block white-space-pw"
                            >
                              {row.GiaoAnPdf}
                            </a>
                          )}
                          <div className="d-flex">
                            <UploadFiles
                              accept="application/pdf,.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                              onChange={(val) => {
                                onUpdate({
                                  ID: row.ID,
                                  Title: row?.Title || "",
                                  Type: row?.Type || "",
                                  Thumbnail: row?.Thumbnail || "",
                                  GiaoAnPdf: val,
                                  LinkOnline: row?.LinkOnline || "",
                                  DynamicID: row?.DynamicID || "",
                                  Version: row?.Version || "",
                                  FileMaHoa: row?.FileMaHoa || "",
                                }).then(() => {
                                  toast.dismiss();
                                  toast.success("Cập nhập thành công !", {
                                    position: toast.POSITION.TOP_RIGHT,
                                    autoClose: 1500,
                                  });
                                });
                              }}
                            />
                            {row.GiaoAnPdf && (
                              <button
                                type="button"
                                className="text-danger border-0 bg-transparent p-0 ml-8px text-underline"
                                style={{ fontWeight: "500", fontSize: "13px" }}
                                onClick={() => {
                                  Swal.fire({
                                    title: "Bạn muốn xóa giáo án này ?",
                                    text:
                                      "Bạn có chắc chắn muốn xóa giáo án bài giảng này không ?",
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
                                        onUpdate({
                                          ID: row.ID,
                                          Title: row?.Title || "",
                                          Type: row?.Type || "",
                                          Thumbnail: row?.Thumbnail || "",
                                          GiaoAnPdf: "",
                                          LinkOnline: row?.LinkOnline || "",
                                          DynamicID: row?.DynamicID || "",
                                          Version: row?.Version || "",
                                          FileMaHoa: row?.FileMaHoa || "",
                                        }).then(() => {
                                          resolve();
                                        });
                                      });
                                    },
                                  }).then((result) => {
                                    if (result.isConfirmed) {
                                      toast.success("Xóa thành công !", {
                                        position: toast.POSITION.TOP_RIGHT,
                                        autoClose: 1500,
                                      });
                                    }
                                  });
                                }}
                              >
                                Xóa
                              </button>
                            )}
                          </div>
                        </div>
                      ),
                      headerStyle: () => {
                        return { minWidth: "215px", width: "250px" };
                      },
                    },
                    {
                      dataField: "FileMaHoa",
                      text: "File Mã hóa",
                      //headerAlign: "center",
                      //style: { textAlign: "center" },
                      attrs: { "data-title": "File Mã hóa" },
                      formatter: (cell, row) => (
                        <div className="w-100">
                          {row.FileMaHoa && (
                            <a
                              href={toAbsoluteUrl(`/${row.FileMaHoa}`)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="d-inline-block white-space-pw"
                            >
                              {row.FileMaHoa}
                            </a>
                          )}

                          <div className="d-flex">
                            <button
                              onClick={() => onOpenModal(row)}
                              type="button"
                              className="text-success border-0 bg-transparent p-0 text-underline"
                              style={{ fontWeight: "500", fontSize: "13px" }}
                            >
                              Upload
                            </button>
                            {row.FileMaHoa && (
                              <button
                                type="button"
                                className="text-danger border-0 bg-transparent p-0 ml-8px text-underline"
                                style={{ fontWeight: "500", fontSize: "13px" }}
                                onClick={() => {
                                  Swal.fire({
                                    title: "Bạn muốn xóa File Mã hóa này ?",
                                    text:
                                      "Bạn có chắc chắn muốn xóa File Mã hóa bài giảng này không ?",
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
                                        onUpdate({
                                          ID: row.ID,
                                          Title: row?.Title || "",
                                          Type: row?.Type || "",
                                          Thumbnail: row?.Thumbnail || "",
                                          GiaoAnPdf: row?.GiaoAnPdf || "",
                                          LinkOnline: row?.LinkOnline || "",
                                          DynamicID: row?.DynamicID || "",
                                          Version: row?.Version || "",
                                          FileMaHoa: "",
                                        }).then(() => {
                                          resolve();
                                        });
                                      });
                                    },
                                  }).then((result) => {
                                    if (result.isConfirmed) {
                                      toast.success("Xóa thành công !", {
                                        position: toast.POSITION.TOP_RIGHT,
                                        autoClose: 1500,
                                      });
                                    }
                                  });
                                }}
                              >
                                Xóa
                              </button>
                            )}
                          </div>
                        </div>
                      ),
                      headerStyle: () => {
                        return { minWidth: "215px", width: "250px" };
                      },
                    },
                    {
                      dataField: "Thumbnail",
                      text: "Hình ảnh",
                      //headerAlign: "center",
                      //style: { textAlign: "center" },
                      attrs: { "data-title": "Hình ảnh" },
                      formatter: (cell, row) => (
                        <div className="w-100px">
                          {row.Thumbnail && (
                            <a
                              href={toAbsoluteUrl(
                                `/upload/image/${row.Thumbnail}`
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="d-block text-center mb-3px"
                            >
                              <img
                                className="max-w-100"
                                src={toAbsoluteUrl(
                                  `/upload/image/${row.Thumbnail}`
                                )}
                                alt={row.Thumbnail}
                              />
                            </a>
                          )}

                          <div className="d-flex">
                            <UploadFiles
                              accept="image/*"
                              onChange={(val) => {
                                onUpdate({
                                  ID: row.ID,
                                  Title: row?.Title || "",
                                  Type: row?.Type || "",
                                  Thumbnail: val,
                                  GiaoAnPdf: row?.GiaoAnPdf || "",
                                  LinkOnline: row?.LinkOnline || "",
                                  DynamicID: row?.DynamicID || "",
                                  Version: row?.Version || "",
                                  FileMaHoa: row?.FileMaHoa || "",
                                }).then(() => {
                                  toast.dismiss();
                                  toast.success("Cập nhập thành công !", {
                                    position: toast.POSITION.TOP_RIGHT,
                                    autoClose: 1500,
                                  });
                                });
                              }}
                            />
                            {row.Thumbnail && (
                              <button
                                type="button"
                                className="text-danger border-0 bg-transparent p-0 ml-8px text-underline"
                                style={{ fontWeight: "500", fontSize: "13px" }}
                                onClick={() => {
                                  Swal.fire({
                                    title: "Bạn muốn xóa ảnh này ?",
                                    text:
                                      "Bạn có chắc chắn muốn xóa ảnh bài giảng này không ?",
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
                                        onUpdate({
                                          ID: row.ID,
                                          Title: row?.Title || "",
                                          Type: row?.Type || "",
                                          Thumbnail: "",
                                          GiaoAnPdf: row?.GiaoAnPdf || "",
                                          LinkOnline: row?.LinkOnline || "",
                                          DynamicID: row?.DynamicID || "",
                                          Version: row?.Version || "",
                                          FileMaHoa: row?.FileMaHoa || "",
                                        }).then(() => {
                                          resolve();
                                        });
                                      });
                                    },
                                  }).then((result) => {
                                    if (result.isConfirmed) {
                                      toast.success("Xóa thành công !", {
                                        position: toast.POSITION.TOP_RIGHT,
                                        autoClose: 1500,
                                      });
                                    }
                                  });
                                }}
                              >
                                Xóa
                              </button>
                            )}
                          </div>
                        </div>
                      ),
                      headerStyle: () => {
                        return { minWidth: "100%", width: "115px" };
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
                              onClick={() => onOpenModal(row)}
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
                        return { minWidth: "100%", width: "85px" };
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
          <ModalLesson
            show={ModalAdd}
            onHide={onHideModal}
            defaultValues={defaultValues}
            onAddEdit={onAddEdit}
            btnLoading={btnLoading}
          />
        </div>
      </div>
    </LessonContext.Provider>
  );
}

export default Lesson;
