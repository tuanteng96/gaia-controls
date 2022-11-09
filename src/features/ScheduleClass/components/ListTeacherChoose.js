import React from 'react'
import PropTypes from 'prop-types'

function ListTeacherChoose({ item }) {
  return (
    <div className="p-15px">
      {item?.AvaiList && item?.AvaiList.length > 0 ? (
        <div className="checkbox-list">
          {item?.AvaiList.map((teacher, index) => (
            <label className="radio" key={index}>
              <input type="radio" name="teacher" />
              <span />
              <div className='d-flex flex-column'>
                <span className="text">
                    {teacher?.FullName}
                </span>
                <span className="location">Khoảng {teacher?.DurationText}</span>
              </div>
            </label>
          ))}
        </div>
      ) : (
        <div>Không có giáo viên phù hợp.</div>
      )}
    </div>
  )
}

ListTeacherChoose.propTypes = {
    item: PropTypes.object
}

export default ListTeacherChoose
