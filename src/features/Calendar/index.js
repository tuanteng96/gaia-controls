import React, { Fragment } from 'react';
import { Table } from 'react-bootstrap';
import { isDevelopment } from '../../helpers/DevelopmentHelpers';

function Calendar(props) {
    return (
      <div className={`container-fluid ${isDevelopment() ? "py-3" : "p-0"}`}>
        <div className="hpanel">
          <div className="panel-body">
            <div className="d-flex justify-content-between align-items-center">
              <h2 className="text-uppercase font-size-h3 mb-0">Bảng lịch</h2>
            </div>
          </div>
        </div>
        <div className="bg-white">
          <Table bordered responsive className="mb-0">
            <thead>
              <tr>
                <th
                  colSpan={2}
                  rowSpan={2}
                  className="text-center w-200px min-w-200px"
                >
                  Trường
                </th>
                <th colSpan={2} className="p-0 text-center w-200px min-w-200px">
                  <div className="h-35px border-bottom d-flex align-items-center justify-content-center">
                    Thứ 2
                  </div>
                  <div className="d-flex">
                    <div className="w-50 border-right h-35px d-flex align-items-center justify-content-center">
                      Sáng
                    </div>
                    <div className="w-50 h-35px d-flex align-items-center justify-content-center">
                      Chiều
                    </div>
                  </div>
                </th>
                <th colSpan={2} className="p-0 text-center w-200px min-w-200px">
                  <div className="h-35px border-bottom d-flex align-items-center justify-content-center">
                    Thứ 3
                  </div>
                  <div className="d-flex">
                    <div className="w-50 border-right h-35px d-flex align-items-center justify-content-center">
                      Sáng
                    </div>
                    <div className="w-50 h-35px d-flex align-items-center justify-content-center">
                      Chiều
                    </div>
                  </div>
                </th>
                <th colSpan={2} className="p-0 text-center w-200px min-w-200px">
                  <div className="h-35px border-bottom d-flex align-items-center justify-content-center">
                    Thứ 4
                  </div>
                  <div className="d-flex">
                    <div className="w-50 border-right h-35px d-flex align-items-center justify-content-center">
                      Sáng
                    </div>
                    <div className="w-50 h-35px d-flex align-items-center justify-content-center">
                      Chiều
                    </div>
                  </div>
                </th>
                <th colSpan={2} className="p-0 text-center w-200px min-w-200px">
                  <div className="h-35px border-bottom d-flex align-items-center justify-content-center">
                    Thứ 5
                  </div>
                  <div className="d-flex">
                    <div className="w-50 border-right h-35px d-flex align-items-center justify-content-center">
                      Sáng
                    </div>
                    <div className="w-50 h-35px d-flex align-items-center justify-content-center">
                      Chiều
                    </div>
                  </div>
                </th>
                <th colSpan={2} className="p-0 text-center w-200px min-w-200px">
                  <div className="h-35px border-bottom d-flex align-items-center justify-content-center">
                    Thứ 6
                  </div>
                  <div className="d-flex">
                    <div className="w-50 border-right h-35px d-flex align-items-center justify-content-center">
                      Sáng
                    </div>
                    <div className="w-50 h-35px d-flex align-items-center justify-content-center">
                      Chiều
                    </div>
                  </div>
                </th>
                <th colSpan={2} className="p-0 text-center w-200px min-w-200px">
                  <div className="h-35px border-bottom d-flex align-items-center justify-content-center">
                    Thứ 7
                  </div>
                  <div className="d-flex">
                    <div className="w-50 border-right h-35px d-flex align-items-center justify-content-center">
                      Sáng
                    </div>
                    <div className="w-50 h-35px d-flex align-items-center justify-content-center">
                      Chiều
                    </div>
                  </div>
                </th>
                <th colSpan={2} className="p-0 text-center w-200px min-w-200px">
                  <div className="h-35px border-bottom d-flex align-items-center justify-content-center">
                    CN
                  </div>
                  <div className="d-flex">
                    <div className="w-50 border-right h-35px d-flex align-items-center justify-content-center">
                      Sáng
                    </div>
                    <div className="w-50 h-35px d-flex align-items-center justify-content-center">
                      Chiều
                    </div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {Array(5)
                .fill()
                .map((item, x) => (
                  <tr key={x}>
                    <td>Trường tiếu học Minh Sơn {x + 1}</td>
                    <td className="p-0 w-80px">
                      <div className="border-bottom px-2 h-35px d-flex align-items-center">
                        Lớp 1
                      </div>
                      <div className="border-bottom px-2 h-35px d-flex align-items-center">
                        Lớp 2
                      </div>
                      <div className="border-bottom px-2 h-35px d-flex align-items-center">
                        Lớp 3
                      </div>
                      <div className="border-bottom px-2 h-35px d-flex align-items-center">
                        Lớp 4
                      </div>
                      <div className="px-2 h-35px d-flex align-items-center">
                        Lớp 5
                      </div>
                    </td>
                    {Array(7)
                      .fill()
                      .map((item, index) => (
                        <Fragment key={index}>
                          <td className="p-0">
                            {Array(5)
                              .fill()
                              .map((item, idx) => (
                                <div
                                  className={`${
                                    idx !== 4 ? "border-bottom" : ""
                                  } px-2 h-35px d-flex align-items-center justify-content-center`}
                                  key={idx}
                                >
                                  <div className="d-flex border border-end-0">
                                    {Array(6)
                                      .fill()
                                      .map((item, o) => (
                                        <div
                                          className={`w-15px h-20px border-right ${o ===
                                            idx && "bg-primary"}`}
                                          key={o}
                                        ></div>
                                      ))}
                                  </div>
                                </div>
                              ))}
                          </td>
                          <td className="p-0">
                            {Array(5)
                              .fill()
                              .map((item, idx) => (
                                <div
                                  className={`${
                                    idx !== 4 ? "border-bottom" : ""
                                  } px-2 h-35px d-flex align-items-center justify-content-center`}
                                  key={idx}
                                >
                                  <div className="d-flex border border-end-0">
                                    {Array(6)
                                      .fill()
                                      .map((item, o) => (
                                        <div
                                          className={`w-15px h-20px border-right ${o ===
                                            idx && "bg-primary"}`}
                                          key={o}
                                        ></div>
                                      ))}
                                  </div>
                                </div>
                              ))}
                          </td>
                        </Fragment>
                      ))}
                  </tr>
                ))}
            </tbody>
          </Table>
        </div>
      </div>
    );
}

export default Calendar;