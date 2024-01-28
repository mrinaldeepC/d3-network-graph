import React from "react";
import LinkButton from "../LinkButton";
import PrimaryButton from "../PrimaryButton";

const ModalAction = ({
  showSubmit,
  showCancel,
  submitTitle,
  cancelTitle,
  onCancelClick,
  marginTop,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: marginTop,
      }}
    >
      {showSubmit && <PrimaryButton title={submitTitle} type={"submit"} />}
      {showCancel && <LinkButton title={cancelTitle} onClick={onCancelClick} />}
    </div>
  );
};

export default ModalAction;
