'use client'
import React, { useState } from 'react'
import {
  Select,
  InputNumber,
  Button,
  Table,
  Tabs,
  Image,
  ConfigProvider
} from 'antd'

const { Option } = Select

interface UsageData {
  [fertilizer: string]: number
}

interface PlantStages {
  [plant: string]: string[]
}

interface UsageType {
  [plant: string]: {
    [stage: string]: UsageData
  }
}

interface FertilizerPrices {
  [fertilizer: string]: number
}

interface CropImages {
  [plant: string]: string
}

interface SummaryItem {
  item: string
  amount: number
  defaultAmount: number
  liters: number
  price: number
}

const plantStages: PlantStages = {
  ข้าว: ['อุ่มท้อง', 'ติดเม็ด'],
  อ้อย: ['แง้ง', 'เร่งให้ลงหัว'],
  ข้าวโพด: ['เจริญเติบโต', 'ติดฝักอ่อน']
}

const usageData: { [type: string]: UsageType } = {
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

const fertilizerPrices: FertilizerPrices = {
  'ไนโตรเจน พลัส': 100,
  'เอ็นเทค พลัส': 150
}

const cropImages: CropImages = {
  ข้าว: '/rice.jpg', // Updated to use rice.jpg from public folder
  อ้อย: '/sugarcane.jpg', // Replace with corresponding file if added
  ข้าวโพด: '/corn.jpg' // Replace with corresponding file if added
}

const App: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('ทางใบ')
  const [selectedPlant, setSelectedPlant] = useState<string | null>(null)
  const [selectedStage, setSelectedStage] = useState<string | null>(null)
  const [area, setArea] = useState<number>(0)
  const [summary, setSummary] = useState<SummaryItem[]>([])

  const calculateUsage = () => {
    if (selectedPlant && selectedStage && area > 0) {
      const stageData = usageData[selectedType][selectedPlant][selectedStage]
      const result: SummaryItem[] = Object.entries(stageData).map(
        ([item, defaultAmount]) => {
          const amount = defaultAmount * area
          const liters = Math.ceil(amount / 1000)
          const price = liters * fertilizerPrices[item]
          return {
            item,
            amount,
            defaultAmount,
            liters,
            price
          }
        }
      )
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
      title: 'ปริมาณที่ต้องใช้ต่อไร่ (ซีซี)',
      dataIndex: 'defaultAmount',
      key: 'defaultAmount'
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
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#388e3c',
          colorLink: '#388e3c',
          colorLinkHover: '#66bb6a',
          borderRadius: 8,
          colorBgLayout: '#e8f5e9',
          colorText: '#2e7d32',
          colorBgContainer: '#f1f8e9'
        }
      }}
    >
      <div
        style={{
          padding: 24,
          maxWidth: 800,
          margin: '0 auto',
          textAlign: 'center',
          fontFamily: 'Arial, sans-serif',
          borderRadius: '10px'
        }}
      >
        <Image
          src="/logo.jpg"
          width={150}
          alt="Logo"
          style={{ marginBottom: 16 }}
        />
        <h3 style={{ marginBottom: 24 }}>คำนวนปริมาณปุ๋ยที่ต้องใช้</h3>
        <Tabs
          defaultActiveKey="ทางใบ"
          onChange={(key) => {
            setSelectedType(key)
            setSelectedPlant(null)
            setSelectedStage(null)
          }}
          style={{ marginBottom: 24 }}
        >
          <Tabs.TabPane tab="ทางใบ" key="ทางใบ" />
          <Tabs.TabPane tab="ทางดิน" key="ทางดิน" />
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
            {(plantStages[selectedPlant!] || []).map((stage) => (
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
          <Button type="primary" onClick={calculateUsage}>
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
        />
        {summary.length > 0 && (
          <h4 style={{ marginTop: 16 }}>
            ราคาทั้งหมด: {totalPrice.toLocaleString()} บาท
          </h4>
        )}
      </div>
    </ConfigProvider>
  )
}

export default App
