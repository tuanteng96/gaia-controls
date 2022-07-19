import React from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import CalendarSchoolCrud from "../../features/CalendarSchool/_redux/CalendarSchoolCrud";

function AsyncSelectSkills(props) {
  const getAllSkill = async (search, loadedOptions, { page }, level) => {
    const { data } = await CalendarSchoolCrud.getAllSkills(search);
    const newData =
      data && data.length > 0
        ? data.map((item) => ({ ...item, label: item.text, value: item.id }))
        : [];
    return {
      options: newData,
      hasMore: false,
      additional: {
        page: page + 1,
      },
    };
  };
  return (
    <AsyncPaginate
      {...props}
      classNamePrefix="select"
      isClearable={true}
      loadOptions={getAllSkill}
      additional={{
        page: 1,
      }}
    />
  );
}

export default AsyncSelectSkills;
