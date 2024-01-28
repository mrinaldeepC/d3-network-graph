import React from "react";

const FormInfo = ({ message }) => {
  return (
    <p
      style={{
        marginBottom: "10px",
        marginTop: "0",
        fontSize: "14px",
        color: "#919191",
      }}
    >
      <i dangerouslySetInnerHTML={{ __html: message }} />
    </p>
  );
};

export default FormInfo;
