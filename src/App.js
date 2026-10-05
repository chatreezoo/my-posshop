import React, { useState } from 'react';
import './App.css';

// ตัวอย่างรายการสินค้าในคาเฟ่ แยกตามหมวดหมู่
const categories = ['ทั้งหมด', 'กาแฟ', 'เครื่องดื่ม', 'เบเกอรี่', 'ของทานเล่น'];

const products = [
  { id: 1, name: 'Iced Americano', price: 65, category: 'กาแฟ', image: '☕' },
  { id: 2, name: 'Iced Latte', price: 75, category: 'กาแฟ', image: '☕' },
  { id: 3, name: 'Caramel Macchiato', price: 85, category: 'กาแฟ', image: '☕' },
  { id: 4, name: 'Thai Milk Tea', price: 60, category: 'เครื่องดื่ม', image: '🧋' },
  { id: 5, name: 'Matcha Green Tea', price: 80, category: 'เครื่องดื่ม', image: '🍵' },
  { id: 6, name: 'Croissant', price: 70, category: 'เบเกอรี่', image: '🥐' },
  { id: 7, name: 'Butter Toast', price: 55, category: 'เบเกอรี่', image: '🍞' },
  { id: 8, name: 'French Fries', price: 69, category: 'ของทานเล่น', image: '🍟' },
];

function App() {
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  const [cart, setCart] = useState([]);
  const [cashReceived, setCashReceived] = useState('');
  const [orderComplete, setOrderComplete] = useState(false);

  // กรองสินค้าตามหมวดหมู่
  const filteredProducts = selectedCategory === 'ทั้งหมด' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  // เพิ่มสินค้าลงตะกร้า
  const addToCart = (product) => {
    setOrderComplete(false);
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        return prevCart.map(item => 
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prevCart, { ...product, qty: 1 }];
    });
  };

  // เปลี่ยนแปลงจำนวนสินค้า
  const updateQty = (id, delta) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id === id) {
          const newQty = item.qty + delta;
          return newQty > 0 ? { ...item, qty: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  // คำนวณราคารวม
  const subTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const vat = subTotal * 0.07; // ตัวอย่าง VAT 7% (ถ้ามี)
  const total = subTotal; // หรือ subTotal + vat ตามชอบ

  // คำนวณเงินทอน
  const cashNum = parseFloat(cashReceived) || 0;
  const change = cashNum >= total ? cashNum - total : 0;

  // กดชำระเงิน
  const handleCheckout = () => {
    if (cart.length === 0) return;
    if (cashNum < total) {
      alert('จำนวนเงินรับมาน้อยกว่ายอดรวมครับ');
      return;
    }
    setOrderComplete(true);
  };

  // ล้างตะกร้า / เริ่มออร์เดอร์ใหม่
  const handleNewOrder = () => {
    setCart([]);
    setCashReceived('');
    setOrderComplete(false);
  };

  return (
    <div className="pos-container">
      {/* ส่วนซ้าย: รายการสินค้า */}
      <div className="product-section">
        <header className="pos-header">
          <h1>☕ Café POS System</h1>
          <p>เลือกรายการสินค้าเพื่อสร้างออร์เดอร์</p>
        </header>

        {/* หมวดหมู่สินค้า */}
        <div className="category-tabs">
          {categories.map(cat => (
            <button
              key={cat}
              className={`cat-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ตารางแสดงสินค้า */}
        <div className="product-grid">
          {filteredProducts.map(product => (
            <div 
              key={product.id} 
              className="product-card"
              onClick={() => addToCart(product)}
            >
              <div className="product-icon">{product.image}</div>
              <h3>{product.name}</h3>
              <p className="product-price">{product.price} ฿</p>
            </div>
          ))}
        </div>
      </div>

      {/* ส่วนขวา: ตะกร้าสินค้าและระบบชำระเงิน */}
      <div className="cart-section">
        <h2>🛒 รายการสั่งซื้อ</h2>
        
        {/* รายการในตะกร้า */}
        <div className="cart-items">
          {cart.length === 0 ? (
            <p className="empty-cart">ยังไม่มีสินค้าในตะกร้า</p>
          ) : (
            cart.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-info">
                  <span className="item-name">{item.name}</span>
                  <span className="item-price">{item.price * item.qty} ฿</span>
                </div>
                <div className="item-actions">
                  <button onClick={() => updateQty(item.id, -1)}>-</button>
                  <span>{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)}>+</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* สรุปยอดเงิน */}
        <div className="cart-summary">
          <div className="summary-row">
            <span>รวมทั้งหมด:</span>
            <span className="total-price">{total} ฿</span>
          </div>

          <div className="cash-input-row">
            <span>รับเงินมา:</span>
            <input 
              type="number" 
              placeholder="0.00" 
              value={cashReceived}
              onChange={(e) => setCashReceived(e.target.value)}
            />
          </div>

          <div className="summary-row change-row">
            <span>เงินทอน:</span>
            <span className="change-price">{change.toFixed(2)} ฿</span>
          </div>

          {orderComplete ? (
            <div className="success-box">
              <p>✅ ชำระเงินสำเร็จ! เงินทอน: <strong>{change.toFixed(2)} ฿</strong></p>
              <button className="new-order-btn" onClick={handleNewOrder}>ออร์เดอร์ใหม่</button>
            </div>
          ) : (
            <button 
              className="checkout-btn" 
              onClick={handleCheckout}
              disabled={cart.length === 0}
            >
              ชำระเงิน ({total} ฿)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;