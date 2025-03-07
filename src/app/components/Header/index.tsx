"use client";

import { useEffect, useState } from "react";
import {
  Layout,
  Breadcrumb,
  Avatar,
  Dropdown,
  MenuProps,
  Typography,
  Divider,
  Space,
  Badge,
} from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  LockOutlined,
  InfoCircleOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";

const { Header } = Layout;
const { Text } = Typography;

interface UserProps {
  user: {
    username: string;
    fullName: string;
    avatar: string | null;
    role: string;
  } | null;
}

export default function CustomHeader({ user }: UserProps) {
  const avatarSrc = user?.avatar && user.avatar !== "" ? user.avatar : null;
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter()

  useEffect(() => {
    const updateCart = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartCount(cart.length);
    };
  
    updateCart(); 
    window.addEventListener("cartUpdated", updateCart);
  
    return () => {
      window.removeEventListener("cartUpdated", updateCart);
    };
  }, []);
  
  

  const userMenuItems: MenuProps["items"] = [
    {
      key: "avatar",
      label: (
        <div className="w-44">
          <Space
            direction="horizontal"
            size="small"
            style={{ display: "flex" }}
          >
            <Avatar
              size={50}
              src={avatarSrc}
              icon={!avatarSrc ? <UserOutlined /> : undefined}
            />
            <div className="flex flex-col">
              <Text strong>{user?.fullName || "Người dùng"}</Text>
              <Text type="secondary">{user?.role || "Vai trò"}</Text>
            </div>
          </Space>
          <Divider style={{ margin: "10px 0" }} />
        </div>
      ),
    },
    { key: "profile", label: "Thông tin", icon: <InfoCircleOutlined /> },
    { key: "change-password", label: "Đổi mật khẩu", icon: <LockOutlined /> },
    { type: "divider" },
    {
      key: "logout",
      label: "Đăng xuất",
      icon: <LogoutOutlined />,
      danger: true,
    },
    { type: "divider" },
    {
      key: "version",
      label: "Hoàng Kha - 2025",
      disabled: true,
      style: { textAlign: "center" },
    },
  ];

  return (
    <Header
      style={{
        padding: "0 20px",
        background: "#ffffff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #f0f0f0",
      }}
    >
      <Breadcrumb
        items={[
          {
            title: "Trang chủ",
          },
          {
            title: <a href="/admin/products">Danh sách sản phẩm</a>,
          },
        ]}
      />

      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <Badge onClick={() => { router.push('/admin/cart') }} count={cartCount} showZero>
          <ShoppingCartOutlined style={{ fontSize: "20px", cursor: "pointer" }} />
        </Badge>
        <Dropdown
          menu={{ items: userMenuItems }}
          trigger={["click"]}
          placement="bottomRight"
          arrow
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              cursor: "pointer",
            }}
          >
            <Avatar
              size="default"
              src={avatarSrc}
              icon={!avatarSrc ? <UserOutlined /> : undefined}
            />
          </div>
        </Dropdown>
      </div>
    </Header>
  );
}