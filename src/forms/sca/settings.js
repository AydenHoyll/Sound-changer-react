import React from "react";
import { Button, Form, Radio, Typography, Space, Checkbox } from "antd";

export const ScaSettings = () => {
  return (
    <>
      <Typography.Title level={4}>Settings:</Typography.Title>

      <Form.Item name="outputFormat">
        <Radio.Group size="small">
          <Typography.Title level={5}>Output format:</Typography.Title>
          <Space direction="vertical">
            <Radio value="default">Simple</Radio>
            <Radio value="arrow">Formatted (->)</Radio>
            <Radio value="words">Formatted (w-w)</Radio>
          </Space>
        </Radio.Group>
      </Form.Item>

      <Typography.Title level={5}>Extra:</Typography.Title>

      <Form.Item
        name="isRewriteOutputEnabled"
        initialValue={true}
        valuePropName="checked"
        className="mb-2"
      >
        <Checkbox>Rewrite on output</Checkbox>
      </Form.Item>

      <Form.Item
        name="isFilesIncludeInputLexiconEnabled"
        valuePropName="checked"
        initialValue={true}
        className="mb-2"
      >
        <Checkbox>Files include input lexicon</Checkbox>
      </Form.Item>

      <Form.Item
        name="isShowInterResultsEnabled"
        valuePropName="checked"
        className="mb-2"
      >
        <Checkbox>Show intermediate results</Checkbox>
      </Form.Item>

      <Form.Item
        name="isOnlyInterResultsEnabled"
        valuePropName="checked"
        className="mb-2"
      >
        <Checkbox>Intermediate results only</Checkbox>
      </Form.Item>
    </>
  );
};
