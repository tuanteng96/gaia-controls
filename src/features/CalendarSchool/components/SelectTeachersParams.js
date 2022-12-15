import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import CalendarSchoolCrud from "../_redux/CalendarSchoolCrud";

import moment from "moment";
import "moment/locale/vi";

moment.locale("vi");

SelectTeachersParams.propTypes = {
  params: PropTypes.object,
};

function SelectTeachersParams({ params, ...props }) {
  const [isLoading, setIsLoading] = useState(false);
  const [ListTeacher, setListTeacher] = useState([]);

  useEffect(() => {
    if (params.Date && params.ClassID && params.Index && params.SchoolID) {
      getListTeachers();
    } else {
      setListTeacher([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const getListTeachers = async () => {
    setIsLoading(true);
    const { Date, ClassID, Index, SchoolID } = params;
    const DayOfWeek = moment(Date).day();
    const newValues = {
      SchoolID: SchoolID.ID,
      From: moment(Date).format("DD/MM/YYYY"),
      To: moment(Date).format("DD/MM/YYYY"),
      CalendarList: [
        {
          ClassID: ClassID.ID,
          Days: [
            {
              DayOfWeek: DayOfWeek,
              Items: Index.map((item) => item.Title),
            },
          ],
        },
      ],
    };
    const { Previews } = await CalendarSchoolCrud.previewScheduleClass(
      newValues
    );
    const indexClass = Previews.findIndex((o) => o.ClassID === ClassID.ID);
    let newAvaiList = [];
    if (indexClass > -1) {
      const { AvaiList } = Previews[indexClass];
      newAvaiList = AvaiList
        ? AvaiList.map((o) => ({
            ...o,
            label: o.FullName,
            value: o.ID,
          }))
        : [];
    }
    setListTeacher(newAvaiList);
    setIsLoading(false);
  };

  return (
    <Select
      {...props}
      options={ListTeacher}
      isDisabled={isLoading}
      isLoading={isLoading}
      classNamePrefix="select"
      noOptionsMessage={({ inputValue }) =>
        !inputValue
          ? "Danh sách giáo viên trống"
          : "Không tìm thấy giáo viên phù hợp."
      }
      placeholder="Chọn giáo viên"
      menuPosition="fixed"
    />
  );
}

export default SelectTeachersParams;
