import { Button, Input, Space, Drawer, Table, List, Typography } from "antd";
import { useCallback, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { BarChartOutlined, SearchOutlined } from "@ant-design/icons";

export const ScaDrawer = ({ transformed }) => {
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="default"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: "Word",
      dataIndex: "word",
      key: "word",
      width: "30%",
      ...getColumnSearchProps("word"),
    },
    {
      title: "Transformation",
      dataIndex: "changelog",
      key: "changelog",
    },
  ];

  const getDataForList = (item) => {
    if (!item.rulesApplied.length) return ["No rules applied"];

    const flow = item.rulesApplied.map(
      (item) => `Rule: ${item[0]} -> ${item[1]}`
    );
    return flow;
  };

  const getData = useCallback(() => {
    return transformed.map((item, ix) => ({
      key: String(ix + 1),
      word: item.was,
      changelog: (
        <List
          size="small"
          bordered
          dataSource={getDataForList(item)}
          footer={
            item.was !== item.became ? (
              <Typography.Text className="font-medium">
                Result: {item.became}
              </Typography.Text>
            ) : null
          }
          renderItem={(item) => <List.Item>{item}</List.Item>}
        />
      ),
    }));
  }, [transformed]);

  return (
    <>
      <Button
        className="text-xl"
        disabled={transformed.length === 0}
        onClick={showDrawer}
      >
        <BarChartOutlined style={{ display: "block" }} />
      </Button>
      <Drawer
        size="large"
        title="Changelog"
        placement="right"
        onClose={onClose}
        open={open}
      >
        <Table columns={columns} dataSource={getData()} pagination={false} />
      </Drawer>
    </>
  );
};
