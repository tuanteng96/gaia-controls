import React, { useRef, useState } from "react";
import AsyncSelect from "react-select/async";
import PropTypes from "prop-types";

import moment from "moment";
import "moment/locale/vi";
import CalendarSchoolCrud from "../_redux/CalendarSchoolCrud";
moment.locale("vi");

SelectTeachersParams.propTypes = {
  params: PropTypes.object,
};

const filterData = (inputValue, data) => {
  return data.filter((i) =>
    i.label.toLowerCase().includes(inputValue.toLowerCase())
  );
};

function SelectTeachersParams({ params, ...props }) {
  const [isLoading, setIsLoading] = useState(false);
  const typingTimeoutRef = useRef(null);

  const loadOptions = (inputValue, parameter) => {
    return new Promise((resolve) => {
      if (
        parameter.Date &&
        parameter.ClassID &&
        parameter.Index &&
        parameter.SchoolID
      ) {
        setIsLoading(true);
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(async () => {
          const { Date, ClassID, Index, SchoolID } = parameter;
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
          const indexClass = Previews.findIndex(
            (o) => o.ClassID === ClassID.ID
          );
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
          setIsLoading(false);
          resolve(filterData(inputValue, newAvaiList));
        }, 300);
      } else {
        resolve([]);
      }
    });
  };

  return (
    <AsyncSelect
      {...props}
      cacheOptions
      loadOptions={(inputValue) => loadOptions(inputValue, params)}
      defaultOptions
      //isDisabled={isLoading}
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
