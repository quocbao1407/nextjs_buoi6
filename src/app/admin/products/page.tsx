"use client";
import { Card, Col, Row, Typography, Table, Button, message, Modal } from "antd";
import React, { useState, useEffect } from "react";

const { Title } = Typography;

interface Product {
  product_id: number;
  product_name: string;
  category: string;
  price: number;
  stock: number;
}

const productList: Product[] = [
  { product_id: 1, product_name: "iPhone 14 Pro Max", category: "Điện tử", price: 29990000, stock: 15 },
  { product_id: 2, product_name: "Samsung Galaxy S23 Ultra", category: "Điện tử", price: 27990000, stock: 20 },
  { product_id: 3, product_name: "MacBook Pro M2", category: "Laptop", price: 45990000, stock: 10 },
  { product_id: 4, product_name: "Dell XPS 15", category: "Laptop", price: 35990000, stock: 12 },
  { product_id: 5, product_name: "Sony WH-1000XM5", category: "Phụ kiện", price: 8490000, stock: 30 },
  { product_id: 6, product_name: "Apple Watch Series 8", category: "Đồng hồ", price: 12990000, stock: 25 },
  { product_id: 7, product_name: "AirPods Pro 2", category: "Phụ kiện", price: 5790000, stock: 40 },
  { product_id: 8, product_name: "iPad Pro M2 12.9 inch", category: "Máy tính bảng", price: 34990000, stock: 18 },
  { product_id: 9, product_name: "Asus ROG Phone 6", category: "Điện tử", price: 22990000, stock: 10 },
  { product_id: 10, product_name: "Nintendo Switch OLED", category: "Máy chơi game", price: 9990000, stock: 35 },
];

export default function Products() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<Product[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const newCart = [...prevCart, product];
      localStorage.setItem("cart", JSON.stringify(newCart));
      return newCart;
    });
  
    setTimeout(() => {
      window.dispatchEvent(new Event("cartUpdated")); 
    }, 0);
  };
  

  const showProductDetails = (product: Product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const columns = [
    { title: "ID", dataIndex: "product_id", key: "product_id", render: (id: number) => `SP-${id}` },
    { title: "Tên sản phẩm", dataIndex: "product_name", key: "product_name" },
    { title: "Danh mục", dataIndex: "category", key: "category" },
    { title: "Giá (VND)", dataIndex: "price", key: "price", render: (price: number) => price.toLocaleString() + " VND" },
    { title: "Số lượng tồn kho", dataIndex: "stock", key: "stock" },
    { 
      title: "Thao tác", 
      key: "actions", 
      render: (_: unknown, record: Product) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Button type="primary" onClick={() => addToCart(record)}>Thêm vào giỏ</Button>
          <Button onClick={() => showProductDetails(record)}>Xem</Button>
        </div>
      ) 
    }
  ];

  return (
    <section>
      <Row gutter={16} className="mt-4">
        <Col span={8}>
          <div className="p-5" title="Tổng số sản phẩm">
            <Title level={3}>{productList.length}</Title>
          </div>
        </Col>
      </Row>
      <Row className="mt-6">
        <Col span={24}>
          <div className="p-5" title="Danh sách sản phẩm">
            <Table 
              dataSource={productList} 
              columns={columns} 
              rowKey="product_id" 
              pagination={{ pageSize: 5 }}
            />
          </div>
        </Col>
      </Row>
      <Modal 
        title="Chi tiết sản phẩm" 
        open={modalVisible} 
        onCancel={() => setModalVisible(false)} 
        footer={null}
      >
        {selectedProduct && (
          <div>
            <p><strong>ID:</strong> {selectedProduct.product_id}</p>
            <p><strong>Tên sản phẩm:</strong> {selectedProduct.product_name}</p>
            <p><strong>Danh mục:</strong> {selectedProduct.category}</p>
            <p><strong>Giá:</strong> {selectedProduct.price.toLocaleString()} VND</p>
            <p><strong>Số lượng tồn kho:</strong> {selectedProduct.stock}</p>
          </div>
        )}
      </Modal>
    </section>
  );
}
