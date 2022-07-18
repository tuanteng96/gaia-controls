import React from 'react'
import TeacherCrud from "../../features/Teacher/_redux/TeacherCrud"
import { AsyncPaginate } from "react-select-async-paginate";

function AsyncSelectTeachers(props) {
    const getAllTeacher = async (search, loadedOptions, { page }) => {
        const newPost = {
          _pi: page,
          _ps: 10,
          _key: search,
          Status: 0,
          _orders: {
            Id: true,
          },
          _appends: {
            IsSchoolTeacher: 0,
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
        <AsyncPaginate
            {...props}
            classNamePrefix="select"
            isClearable={true}
            loadOptions={getAllTeacher}
            additional={{
                page: 1,
            }}
        />
    )
}

export default AsyncSelectTeachers
