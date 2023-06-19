import React, { useEffect, useState } from "react";
import { Col, Row, Form, Input, Button, Card, Divider, Upload } from "antd";
import { CloudDownloadOutlined, SaveOutlined } from "@ant-design/icons";
import { useDownloadFile } from "react-downloadfile-hook";

import { ScaInputs } from "./inputs";
import { ScaSettings } from "./settings";
import { useSca } from "../../hooks/sca/sca_logic";
import { FORM_INPUTS, INITIAL_VALUES } from "./contants";

import "./styles.css";
import { ScaDrawer } from "./drawer";
import { Title } from "../../components/Title/title";
import { TOOLTIPS } from "./utils";

export const ScaForm = () => {
  const [isOutputDisabled, setIsOutputDisabled] = useState(true);
  const [form] = Form.useForm();

  const { calc, result, error, summary, transformed } = useSca();

  useEffect(() => {
    if (error) {
      setIsOutputDisabled(true);
    }

    if (!error && result.length) {
      form.setFieldValue("output", result.join("\n"));
      setIsOutputDisabled(false);
    }
  }, [result, error, form]);

  const { downloadFile } = useDownloadFile({
    fileName: `output-${Date.now()}`,
    format: "txt",
    data: result.join("\n"),
  });

  const uploadProps = {
    accept: ".txt",
    showUploadList: false,
    macCount: 1,
    beforeUpload: (file) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        form.setFieldValue("lexicon", e.target.result);
      };

      reader.readAsText(file);

      return false;
    },
  };

  return (
    <Form
      form={form}
      name="sca"
      initialValues={INITIAL_VALUES}
      onFinish={(data) => calc(data)}
    >
      <Row gutter={16}>
        <Col span={12}>
          <div className="flex justify-between">
            <Title hintText={TOOLTIPS.lexicon}>Lexicon</Title>

            <Upload {...uploadProps}>
              <Button className="text-xl">
                <CloudDownloadOutlined style={{ display: "block" }} />
              </Button>
            </Upload>
          </div>
          <Form.Item name="lexicon">
            <Input.TextArea rows={30} style={{ resize: "none" }} />
          </Form.Item>

          <Form.Item>
            <Button
              type="default"
              htmlType="submit"
              size="large"
              className="w-full"
            >
              Submit
            </Button>
          </Form.Item>
        </Col>

        <Col span={12}>
          <div className="flex justify-between">
            <Title>Output</Title>
            <div className="flex">
              <ScaDrawer transformed={transformed} />

              <Button
                className="text-xl ml-2"
                onClick={downloadFile}
                disabled={isOutputDisabled}
              >
                <SaveOutlined style={{ display: "block" }} />
              </Button>
            </div>
          </div>
          <Form.Item name="output">
            <Input.TextArea
              rows={24}
              disabled={isOutputDisabled}
              style={{ resize: "none" }}
            />
          </Form.Item>

          <Card title="Summary" size="small">
            <p>Categories: {summary.categories || "In process"}</p>
            <p>Valid rules: {summary.validSounds}</p>
            <p>Words processed / changed: {summary.words.join(" / ")}</p>
          </Card>
        </Col>

        <Col span={24}>
          <Divider orientation="center" />
        </Col>

        <Col span={6}>
          <ScaSettings />
        </Col>

        {FORM_INPUTS.map((input) => (
          <Col key={input.title} span={6}>
            <ScaInputs {...input} />
          </Col>
        ))}
      </Row>
    </Form>
  );
};
