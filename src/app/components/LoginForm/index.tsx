"use client";
import { useState } from "react";
import { Button, Input, message, Form, Card, Typography } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleLogin = (values: { email: string; password: string }) => {
    setLoading(true);
    setTimeout(() => {
      if (values.email === "admin@gmail.com" && values.password === "123") {
        message.success("Đăng nhập thành công!");
        router.push("/admin/products");
      } else {
        message.error("Sai tài khoản hoặc mật khẩu!");
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="p-5">
      <Typography.Title level={2} className="text-center mb-4">
        Đăng nhập
      </Typography.Title>

      <Form form={form} layout="vertical" onFinish={handleLogin}>
        <Form.Item
          label="Tài khoản"
          name="email"
          rules={[{ required: true, message: "Tài khoản không được bỏ trống!" }]}
        >
          <Input prefix={<MailOutlined />} placeholder="admin@gmail.com" size="large" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Mật khẩu"
          rules={[{ required: true, message: "Mật khẩu không được bỏ trống!" }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="123" size="large" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full" loading={loading} size="large">
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
