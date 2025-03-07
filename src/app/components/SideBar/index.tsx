"use client";

import { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Button, Layout, Menu, message, theme } from "antd";
import { useRouter, usePathname } from "next/navigation";

const { Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

interface SidebarProps {
  setLoading: (value: boolean) => void;
}

export default function Sidebar({ setLoading }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [selectedKey, setSelectedKey] = useState<string>(pathname);

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === "/admin/products" || key === "/" || key ==='/admin/categories') {
      setLoading(true);
      setSelectedKey(key);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
      router.push(key);
    } else {
      message.info("Các tính năng này sẽ phát triển cho phần admin của đồ án");
    }
  };

  const menuItems: MenuItem[] = [
    !collapsed ? { key: "group_product", label: "Quản lý sản phẩm", type: "group" } : { type: "divider" },
    { key: "/admin/products", label: "Danh sách sản phẩm", icon: <ShoppingCartOutlined /> },
    { key: "/admin/categories", label: "Danh mục sản phẩm", icon: <ShoppingCartOutlined /> },

    !collapsed ? { key: "group_customer", label: "Quản lý khách hàng", type: "group" } : { type: "divider" },
    { key: "/dashboard/customers", label: "Danh sách khách hàng", icon: <UserOutlined /> },
    { key: "/dashboard/customers/orders", label: "Đơn hàng", icon: <ShoppingCartOutlined /> },
    { key: "/dashboard/customers/reviews", label: "Đánh giá & Phản hồi", icon: <UserOutlined /> },

    !collapsed ? { key: "group_settings", label: "Cài đặt", type: "group" } : { type: "divider" },
    { key: "/dashboard/settings", label: "Cấu hình hệ thống", icon: <SettingOutlined /> },
    { key: "/", label: "Đăng xuất", icon: <LogoutOutlined />, danger: true },
  ];

  const {
    token: { colorBgBase, colorTextBase },
  } = theme.useToken();

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={250}
      style={{ background: colorBgBase }}
    >
      <div className="relative px-4">
        <div className="h-16">
          {!collapsed ? (
            <div className="flex items-center text-center w-full h-full py-2">
              <div className="border border-red-500 w-1/3 h-full mx-auto flex items-center justify-center text-red-500">Logo</div> 
            </div>
          ) : (
            ""
          )}
        </div>
        <Button
          className="absolute left-[95%] -top-[52px]"
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            fontSize: "16px",
            color: colorTextBase,
            background: colorBgBase,
          }}
        />
      </div>
      <div style={{ maxHeight: "calc(100vh - 64px)", overflowY: "auto" }}>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[selectedKey]}
          style={{ background: colorBgBase, color: colorTextBase }}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </div>
    </Sider>
  );
}