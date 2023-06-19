import { Layout } from "antd";
import { Route, Routes } from "react-router-dom";

import Head from "./components/Header";
import { ScaPage } from "./pages/sca";
import { HelpPage } from "./pages/help";
import { ContactsPage } from "./pages/contacts";

import "./App.css";

const { Content } = Layout;

const App = () => {
  return (
    <Layout className="layout">
      <Head />

      <Content className="content-wrapper">
        <Routes>
          <Route path="/" element={<ScaPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/contacts" element={<ContactsPage />} />
        </Routes>
      </Content>
    </Layout>
  );
};

export default App;
