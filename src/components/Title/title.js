import { Typography, Tooltip } from "antd";
import { QuestionCircleTwoTone } from "@ant-design/icons";

export const Title = ({ children, hintText, ...props }) => {
  return (
    <div className="flex items-center">
      <Typography.Title level={4} {...props}>
        {children}
      </Typography.Title>
      {hintText && (
        <Tooltip title={hintText} color="blue" className="ml-2 mb-2">
          <QuestionCircleTwoTone style={{ fontSize: 18 }} />
        </Tooltip>
      )}
    </div>
  );
};
