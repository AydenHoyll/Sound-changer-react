import React from "react";
import { Button, Input, Typography, Form } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { Title } from "../../components/Title/title";
import { TOOLTIPS } from "./utils";

export const ScaInputs = ({ title, placeholder, name }) => {
  const rules = {
    categories: [
      {
        message: `Input should be as ${placeholder}`,
        pattern: /^([a-zA-Z])(=)(.+)$/gm,
      },
    ],
    sounds: [
      {
        message: `Input should be as ${placeholder}`,
        pattern: /[\/_]/gm,
      },
    ],
    rules: [
      {
        message: `Input should be as ${placeholder}`,
        pattern: /^(.+)(\|)(.+)$/gm,
      },
    ],
  };

  return (
    <>
      <Title hintText={TOOLTIPS[name]}>{title}</Title>

      <Form.List name={name}>
        {(fields, { add, remove }) =>
          fields.map(({ key, ...rest }, index) => (
            <div className="flex" key={index}>
              <Form.Item
                rules={rules[name] || []}
                className="flex w-full"
                {...rest}
                rootClassName="mainInputs"
              >
                <Input
                  placeholder={placeholder}
                  size="large"
                  style={{ width: "100%" }}
                  rootClassName="input"
                />
              </Form.Item>
              <Button
                className="ml-2"
                disabled={key === 0}
                onClick={() => remove(index)}
              >
                <MinusOutlined style={{ display: "block", fontSize: 10 }} />
              </Button>
              <Button className="ml-2" onClick={() => add("")}>
                <PlusOutlined style={{ display: "block", fontSize: 10 }} />
              </Button>
            </div>
          ))
        }
      </Form.List>
    </>
  );
};
