import React from "react";
import { ScaForm } from "../../forms/sca";
import { Typography } from "antd";

export const ScaPage = () => {
  return (
    <>
      <Typography.Title level={2}>
        SCA 2.1 – Sound Change Applier
      </Typography.Title>
      <Typography.Paragraph className="pb-5">
        This is a React based app to implement sound changes.
      </Typography.Paragraph>

      <ScaForm />
    </>
  );
};
