import React from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";

ModalKTT.propTypes = {
  show: PropTypes.bool,
};

function ModalKTT({ show, onHide, onAddEdit, defaultValues, btnLoading }) {
  return (
    <Modal
      show={show}
      onHide={onHide}
      dialogClassName="modal-max2-sm"
      scrollable={true}
    >
      KTT
    </Modal>
  );
}

export default ModalKTT;
