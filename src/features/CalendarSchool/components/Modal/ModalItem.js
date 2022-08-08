import React from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";

ModalItem.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func,
};

function ModalItem({ show, onHide, IdModal }) {
  return (
    <Modal
      show={show}
      onHide={onHide}
      dialogClassName="modal-max2-sm"
      scrollable={true}
      enforceFocus={false}
      contentClassName="h-60"
    >
      {IdModal && (
        <iframe
          className="w-100 h-100 border-0 d-block m-0 p-0"
          src={`/AdminCp/tools/dayitem.aspx?id=${IdModal}`}
          frameBorder="0"
          title={IdModal}
        ></iframe>
      )}
    </Modal>
  );
}

export default ModalItem;
