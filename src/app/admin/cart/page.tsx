"use client"
import React, { useEffect, useState } from "react";
import { Table, Button, message, Popconfirm, Card, Typography } from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";

const { Title } = Typography;

interface Product {
  product_id: number;
  product_name: string;
  category: string;
  price: number;
  stock: number;
  quantity?: number;
}

export default function Cart() {
  const [cart, setCart] = useState<Product[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      const parsedCart: Product[] = JSON.parse(storedCart);
      const mergedCart = mergeDuplicateProducts(parsedCart);
      setCart(mergedCart);
    }
  }, []);

  const mergeDuplicateProducts = (cartItems: Product[]) => {
    const groupedCart: { [key: number]: Product } = {};
    cartItems.forEach((item) => {
      if (groupedCart[item.product_id]) {
        groupedCart[item.product_id].quantity! += 1;
      } else {
        groupedCart[item.product_id] = { ...item, quantity: 1 };
      }
    });
    return Object.values(groupedCart);
  };

  const updateLocalStorage = (newCart: Product[]) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const removeFromCart = (productId: number) => {
    const newCart = cart.filter((item) => item.product_id !== productId);
    updateLocalStorage(newCart);
    message.success("Đã xoá sản phẩm khỏi giỏ hàng!");
  };

  const clearCart = () => {
    updateLocalStorage([]);
    message.success("Giỏ hàng đã được làm trống!");
  };

  const checkout = () => {
    message.success("Thanh toán thành công!");
    clearCart();
  };

  const increaseQuantity = (productId: number) => {
    const newCart = cart.map((item) =>
      item.product_id === productId ? { ...item, quantity: (item.quantity ?? 1) + 1 } : item
    );
    updateLocalStorage(newCart);
  };

  const decreaseQuantity = (productId: number) => {
    const newCart = cart
      .map((item) =>
        item.product_id === productId ? { ...item, quantity: (item.quantity ?? 1) - 1 } : item
      )
      .filter((item) => item.quantity! > 0); 
    updateLocalStorage(newCart);
  };

  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "product_name",
      key: "product_name",
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Giá (VND)",
      dataIndex: "price",
      key: "price",
      render: (price: number) => price.toLocaleString() + " VND",
    },
    {
      title: "Số lượng",
      key: "quantity",
      render: (_: unknown, record: Product) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Button size="small" icon={<MinusOutlined />} onClick={() => decreaseQuantity(record.product_id)} />
          <span>{record.quantity}</span>
          <Button size="small" icon={<PlusOutlined />} onClick={() => increaseQuantity(record.product_id)} />
        </div>
      ),
    },
    {
      title: "Tổng giá",
      key: "total",
      render: (_: unknown, record: Product) => (
        <strong>{(record.price * (record.quantity ?? 1)).toLocaleString()} VND</strong>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_: unknown, record: Product) => (
        <Popconfirm
          title="Bạn có chắc chắn muốn xoá sản phẩm này?"
          onConfirm={() => removeFromCart(record.product_id)}
          okText="Có"
          cancelText="Không"
        >
          <Button danger>Xoá</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div title="Giỏ hàng của bạn" style={{ maxWidth: "1200px", margin: "auto", marginTop: "20px" }}>
      {cart.length > 0 ? (
        <>
          <Table dataSource={cart} columns={columns} rowKey="product_id" pagination={false} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "16px" }}>
            <Popconfirm
              title="Bạn có chắc chắn muốn làm trống giỏ hàng?"
              onConfirm={clearCart}
              okText="Có"
              cancelText="Không"
            >
              <Button danger>Xoá giỏ hàng</Button>
            </Popconfirm>
            <Button type="primary" onClick={checkout}>
              Thanh toán
            </Button>
          </div>
        </>
      ) : (
        <Title level={4} style={{ textAlign: "center", color: "gray" }}>
          Giỏ hàng trống!
        </Title>
      )}
    </div>
  );
}
