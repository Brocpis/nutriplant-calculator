import React, { useState } from 'react'
import {
  Select,
  InputNumber,
  Button,
  Row,
  Col,
  Table,
  Modal,
  Image
} from 'antd'
import {
  DeleteOutlined,
  RollbackOutlined,
  PlusOutlined,
  CalculatorOutlined
} from '@ant-design/icons'
import {
  FertilizerType,
  FertilizerPrices,
  FertilizerImage,
  CanopySize
} from './enums'

const { Option } = Select

interface FertilizerUsage {
  fertilizer: string
  amountPerUse: number
  pricePerCC: number
  pricePerUsePerArea: number
  pricePerUseTotalArea: number
  pricePerUseTotalAreaTimes: number
}

const PriceCal: React.FC = () => {
  const [area, setArea] = useState<number>(0)
  const [times, setTimes] = useState<number>(0)
  const [selectedCanopySize, setSelectedCanopySize] = useState<number>(
    CanopySize.SMALL
  )
  const [summary, setSummary] = useState<FertilizerUsage[]>([])
  const [removedItems, setRemovedItems] = useState<FertilizerUsage[]>([])
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const [selectedFertilizer, setSelectedFertilizer] =
    useState<FertilizerType | null>(null)
  const [amountPerUse, setAmountPerUse] = useState<number>(0)

  const openFertilizerModal = () => {
    setIsModalVisible(true)
  }

  const closeModal = () => {
    setIsModalVisible(false)
    setSelectedFertilizer(null)
    setAmountPerUse(0)
  }

  const confirmFertilizer = () => {
    if (selectedFertilizer && amountPerUse > 0) {
      const pricePerCC = FertilizerPrices[selectedFertilizer] / 1000 // Convert to price per cc
      const newFertilizer: FertilizerUsage = {
        fertilizer: selectedFertilizer,
        amountPerUse,
        pricePerCC,
        pricePerUsePerArea: pricePerCC * amountPerUse,
        pricePerUseTotalArea: pricePerCC * amountPerUse * area,
        pricePerUseTotalAreaTimes: pricePerCC * amountPerUse * area * times
      }
      setSummary((prev) => [...prev, newFertilizer])
      closeModal()
    }
  }

  const removeRow = (record: FertilizerUsage) => {
    setRemovedItems((prev) => [...prev, record])
    setSummary((prev) =>
      prev.filter((item) => item.fertilizer !== record.fertilizer)
    )
  }

  const addRow = (record: FertilizerUsage) => {
    setRemovedItems((prev) =>
      prev.filter((item) => item.fertilizer !== record.fertilizer)
    )
    setSummary((prev) => [...prev, record])
  }

  const calculateTotal = () => {
    console.log('Calculating totals...')
    // Placeholder for additional calculation logic if needed
  }

  const columns = [
    {
      title: 'ชื่อปุ๋ย',
      dataIndex: 'fertilizer',
      key: 'fertilizer',
      width: 120,
      render: (text: string) => (
        <span style={{ color: '#10B981', cursor: 'pointer' }}>{text}</span>
      )
    },
    {
      title: 'ปริมาณต่อไร่ (ซีซี)',
      dataIndex: 'amountPerUse',
      key: 'amountPerUse'
    },
    {
      title: 'ราคา / ซีซี',
      dataIndex: 'pricePerCC',
      key: 'pricePerCC'
    },
    {
      title: 'ราคาต่อการใช้ 1 ไร่',
      dataIndex: 'pricePerUsePerArea',
      key: 'pricePerUsePerArea'
    },
    {
      title: `ราคาต่อการใช้ ${area || '0'} ไร่`,
      dataIndex: 'pricePerUseTotalArea',
      key: 'pricePerUseTotalArea'
    },
    {
      title: `ราคาต่อการใช้ ${area || '0'} ไร่ ${times || '0'} ครั้ง`,
      dataIndex: 'pricePerUseTotalAreaTimes',
      key: 'pricePerUseTotalAreaTimes'
    },
    {
      title: 'จัดการ',
      key: 'action',
      render: (_: any, record: FertilizerUsage) => (
        <Button type="link" danger onClick={() => removeRow(record)}>
          <DeleteOutlined />
        </Button>
      )
    }
  ]

  const totalPricePerArea = summary.reduce(
    (total, item) => total + item.pricePerUsePerArea,
    0
  )
  const totalPricePerTotalArea = summary.reduce(
    (total, item) => total + item.pricePerUseTotalArea,
    0
  )

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <InputNumber
            placeholder="จำนวนไร่"
            min={1}
            style={{ width: '100%' }}
            onChange={(value) => setArea(value || 0)}
            addonAfter={'ไร่'}
          />
        </Col>
        <Col span={8}>
          <InputNumber
            placeholder="จำนวนครั้ง"
            min={1}
            style={{ width: '100%' }}
            onChange={(value) => setTimes(value || 0)}
            addonAfter={'ครั้ง'}
          />
        </Col>
        <Col span={8}>
          <Select
            placeholder="เลือกขนาดทรงพุ่ม"
            style={{ width: '100%' }}
            value={selectedCanopySize}
            onChange={(value) => setSelectedCanopySize(value as number)}
          >
            <Option value={CanopySize.SMALL}>พุ่มขนาดเล็ก (20ลิตร/ไร่)</Option>
            <Option value={CanopySize.MEDIUM}>พุ่มขนาดกลาง (30ลิตร/ไร่)</Option>
            <Option value={CanopySize.LARGE}>พุ่มขนาดใหญ่ (40ลิตร/ไร่)</Option>
          </Select>
        </Col>
      </Row>
      <Row justify="space-between" style={{ marginTop: 16 }}>
        <Col>
          <Button
            type="primary"
            shape="circle"
            icon={<PlusOutlined />}
            onClick={openFertilizerModal}
          />
        </Col>
        <Col>
          <Button
            type="default"
            shape="circle"
            icon={<CalculatorOutlined />}
            onClick={calculateTotal}
          />
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={summary}
        rowKey={(record) => `${record.fertilizer}-${record.pricePerCC}`}
        pagination={false}
        style={{ marginTop: 16 }}
      />
      {summary.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <h4>
            ราคารวมปุ๋ยทั้งหมดต่อไร่: {totalPricePerArea.toLocaleString()} บาท
          </h4>
          <h4>
            ราคารวมปุ๋ยทั้งหมดต่อ {area || '0'} ไร่:{' '}
            {totalPricePerTotalArea.toLocaleString()} บาท
          </h4>
        </div>
      )}
      {removedItems.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <h4>ปุ๋ยที่ลบออก:</h4>
          {removedItems.map((item) => (
            <div key={item.fertilizer} style={{ marginBottom: 8 }}>
              <span>{item.fertilizer}</span>
              <Button
                type="link"
                onClick={() => addRow(item)}
                style={{ marginLeft: 8 }}
              >
                <RollbackOutlined />
              </Button>
            </div>
          ))}
        </div>
      )}
      <Modal
        open={isModalVisible}
        onCancel={closeModal}
        onOk={confirmFertilizer}
        okText="ยืนยัน"
        cancelText="ยกเลิก"
        centered
      >
        <h3>เลือกปุ๋ย</h3>
        <Row gutter={[16, 16]}>
          {Object.entries(FertilizerPrices).map(([fertilizer, price]) => (
            <Col span={12} key={fertilizer} style={{ marginBottom: 16 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  border:
                    selectedFertilizer === fertilizer
                      ? '2px solid #10B981'
                      : '1px solid #d9d9d9',
                  borderRadius: '8px',
                  padding: '8px'
                }}
                onClick={() =>
                  setSelectedFertilizer(fertilizer as FertilizerType)
                }
              >
                <Image
                  src={FertilizerImage[fertilizer as FertilizerType]}
                  alt={fertilizer}
                  width={50}
                  height={50}
                  style={{ marginRight: '16px' }}
                  preview={false}
                />
                <div>
                  <h4 style={{ margin: 0 }}>{fertilizer}</h4>
                  <p style={{ margin: 0 }}>
                    ราคา: {(price / 1000).toLocaleString()} บาท/ซีซี
                  </p>
                </div>
              </div>
            </Col>
          ))}
        </Row>
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col span={24}>
            <InputNumber
              placeholder="ปริมาณการใช้ต่อไร่ (ซีซี)"
              min={1}
              style={{ width: '100%' }}
              onChange={(value) => setAmountPerUse(value || 0)}
              addonAfter="ซีซี"
            />
          </Col>
        </Row>
      </Modal>
    </>
  )
}

export default PriceCal
