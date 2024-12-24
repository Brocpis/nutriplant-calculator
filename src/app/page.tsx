'use client'
import React, { useState } from 'react'
import { Select, InputNumber, Button, Table, Tabs } from 'antd'

const { Option } = Select

const plantStages = {
  ข้าว: ['อุ่มท้อง', 'ติดเม็ด'],
  อ้อย: ['แง้ง', 'เร่งให้ลงหัว'],
  ข้าวโพด: ['เจริญเติบโต', 'ติดฝักอ่อน']
}

const usageData = {
  ทางใบ: {
    ข้าว: {
      อุ่มท้อง: { 'ไนโตรเจน พลัส': 20, 'เอ็นเทค พลัส': 80 },
      ติดเม็ด: { 'ไนโตรเจน พลัส': 40, 'เอ็นเทค พลัส': 40 }
    },
    อ้อย: {
      แง้ง: { 'ไนโตรเจน พลัส': 50, 'เอ็นเทค พลัส': 60 },
      เร่งให้ลงหัว: { 'ไนโตรเจน พลัส': 40, 'เอ็นเทค พลัส': 40 }
    },
    ข้าวโพด: {
      เจริญเติบโต: { 'ไนโตรเจน พลัส': 60, 'เอ็นเทค พลัส': 40 },
      ติดฝักอ่อน: { 'ไนโตรเจน พลัส': 40, 'เอ็นเทค พลัส': 40 }
    }
  },
  ทางดิน: {
    ข้าว: {
      อุ่มท้อง: { 'ไนโตรเจน พลัส': 30, 'เอ็นเทค พลัส': 90 },
      ติดเม็ด: { 'ไนโตรเจน พลัส': 50, 'เอ็นเทค พลัส': 50 }
    },
    อ้อย: {
      แง้ง: { 'ไนโตรเจน พลัส': 60, 'เอ็นเทค พลัส': 70 },
      เร่งให้ลงหัว: { 'ไนโตรเจน พลัส': 50, 'เอ็นเทค พลัส': 50 }
    },
    ข้าวโพด: {
      เจริญเติบโต: { 'ไนโตรเจน พลัส': 70, 'เอ็นเทค พลัส': 50 },
      ติดฝักอ่อน: { 'ไนโตรเจน พลัส': 50, 'เอ็นเทค พลัส': 50 }
    }
  }
}

const fertilizerPrices = {
  'ไนโตรเจน พลัส': 100, // price per liter
  'เอ็นเทค พลัส': 150 // price per liter
}

const cropImages = {
  ข้าว: 'https://via.placeholder.com/400x200?text=ข้าว',
  อ้อย: 'https://via.placeholder.com/400x200?text=อ้อย',
  ข้าวโพด: 'https://via.placeholder.com/400x200?text=ข้าวโพด'
}

const App: React.FC = () => {
  const [selectedType, setSelectedType] = useState('ทางใบ')
  const [selectedPlant, setSelectedPlant] = useState(null)
  const [selectedStage, setSelectedStage] = useState(null)
  const [area, setArea] = useState(0)
  const [summary, setSummary] = useState([])

  const calculateUsage = () => {
    if (selectedPlant && selectedStage && area > 0) {
      const stageData = usageData[selectedType][selectedPlant][selectedStage]
      const result = Object.entries(stageData).map(([item, amount]) => {
        const liters = Math.ceil((amount * area) / 1000) // convert to liters and round up
        const price = liters * fertilizerPrices[item]
        return {
          item,
          amount: amount * area,
          liters,
          price
        }
      })
      setSummary(result)
    }
  }

  const columns = [
    {
      title: 'ปุ๋ย',
      dataIndex: 'item',
      key: 'item'
    },
    {
      title: 'ปริมาณที่ต้องใช้ (ซีซี)',
      dataIndex: 'amount',
      key: 'amount'
    },
    {
      title: 'ขนาด (ลิตร)',
      dataIndex: 'liters',
      key: 'liters'
    },
    {
      title: 'ราคา (บาท)',
      dataIndex: 'price',
      key: 'price'
    }
  ]

  const totalPrice = summary.reduce((total, item) => total + item.price, 0)

  return (
    <div
      style={{
        padding: 24,
        maxWidth: 800,
        margin: '0 auto',
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#e8f5e9',
        borderRadius: '10px'
      }}
    >
      <img
        src="https://via.placeholder.com/200x100?text=Logo"
        alt="Logo"
        style={{ marginBottom: 16 }}
      />
      <h3 style={{ marginBottom: 24, color: '#388e3c' }}>
        คำนวนปริมาณปุ๋ยที่ต้องใช้
      </h3>
      <Tabs
        defaultActiveKey="ทางใบ"
        onChange={(key) => {
          setSelectedType(key)
          setSelectedPlant(null)
          setSelectedStage(null)
        }}
        style={{ marginBottom: 24 }}
      >
        <Tabs.TabPane
          tab={<span style={{ color: '#388e3c' }}>ทางใบ</span>}
          key="ทางใบ"
        />
        <Tabs.TabPane
          tab={<span style={{ color: '#388e3c' }}>ทางดิน</span>}
          key="ทางดิน"
        />
      </Tabs>
      <div style={{ marginBottom: 16 }}>
        <Select
          placeholder="เลือกชนิดพืช"
          style={{ width: 200, marginRight: 16 }}
          onChange={(value) => {
            setSelectedPlant(value)
            setSelectedStage(null)
          }}
        >
          {Object.keys(plantStages).map((plant) => (
            <Option key={plant} value={plant}>
              {plant}
            </Option>
          ))}
        </Select>
        <Select
          placeholder="เลือกจังหวะพืช"
          style={{ width: 200, marginRight: 16 }}
          disabled={!selectedPlant}
          onChange={(value) => setSelectedStage(value)}
        >
          {(plantStages[selectedPlant] || []).map((stage) => (
            <Option key={stage} value={stage}>
              {stage}
            </Option>
          ))}
        </Select>
        <InputNumber
          placeholder="จำนวนไร่"
          min={1}
          style={{ width: 120, marginRight: 16 }}
          onChange={(value) => setArea(value || 0)}
        />
        <Button
          type="primary"
          style={{ backgroundColor: '#388e3c', borderColor: '#388e3c' }}
          onClick={calculateUsage}
        >
          คำนวน
        </Button>
      </div>
      {selectedPlant && (
        <img
          src={cropImages[selectedPlant]}
          alt={selectedPlant}
          style={{
            width: '100%',
            maxHeight: 200,
            objectFit: 'cover',
            marginBottom: 24,
            borderRadius: '10px'
          }}
        />
      )}
      <Table
        columns={columns}
        dataSource={summary}
        rowKey="item"
        pagination={false}
        style={{ backgroundColor: '#f1f8e9', borderRadius: '10px' }}
      />
      {summary.length > 0 && (
        <h4 style={{ marginTop: 16, color: '#388e3c' }}>
          ราคาทั้งหมด: {totalPrice.toLocaleString()} บาท
        </h4>
      )}
    </div>
  )
}

export default App
