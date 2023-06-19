import React from "react";
import { Layout, Menu } from "antd";
import { HEADER_LINKS } from "./constants";
import { Link } from "react-router-dom";

const { Header } = Layout;

const Head = () => {
  return (
    <Header>
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
        {HEADER_LINKS.map(({ label, key, link }) => (
          <Menu.Item key={key}>
            <Link to={link}>{label}</Link>
          </Menu.Item>
        ))}
      </Menu>
    </Header>
  );
};

export default Head;
