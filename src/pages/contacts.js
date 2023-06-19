import React from "react";
import { Typography } from "antd";

export const ContactsPage = () => {
  return (
    <>
      <Typography.Title level={2}>Contacts</Typography.Title>
      <Typography.Paragraph className="pb-7 contacts">
          You can contact me by sending an email to: akr64@missouri.edu
          or by clicking this link:
          <br/>
          <a href="mailto:akr64@mail.missouri.edu">Send me an email</a>
      </Typography.Paragraph>
    </>
  );
};
