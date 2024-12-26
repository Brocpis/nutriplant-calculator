import React, { useState } from 'react'
import {
  Button,
  Table,
  Modal,
  Row,
  Col,
  InputNumber,
  Image,
  AutoComplete
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { FertilizerType, FertilizerPrices, FertilizerImage } from '../enums'

interface FertilizerUsage {
  fertilizer: string
  amountPerUse: number
  price: number
  pricePerUsePerArea: number
  usableArea: number // ใช้ได้กี่ไร่
}

const NutriplantFarmer: React.FC = () => {
  const [ourSummary, setOurSummary] = useState<FertilizerUsage[]>([])
  const [isMainModalVisible, setIsMainModalVisible] = useState<boolean>(false)
  const [isSubModalVisible, setIsSubModalVisible] = useState<boolean>(false)
  const [isMarketModalVisible, setIsMarketModalVisible] =
    useState<boolean>(false)
  const [isNutriplantAmountModalVisible, setIsNutriplantAmountModalVisible] =
    useState<boolean>(false)

  const [selectedFertilizer, setSelectedFertilizer] = useState<string | null>(
    null
  )
  const [amountPerUse, setAmountPerUse] = useState<number>(0)
  const [totalAmount, setTotalAmount] = useState<number>(0)
  const [totalPrice, setTotalPrice] = useState<number>(0)

  const openMainModal = () => setIsMainModalVisible(true)
  const closeMainModal = () => {
    setIsMainModalVisible(false)
    setIsSubModalVisible(false)
    setIsMarketModalVisible(false)
    setIsNutriplantAmountModalVisible(false)
    setSelectedFertilizer(null)
    setAmountPerUse(0)
    setTotalAmount(0)
    setTotalPrice(0)
  }

  const confirmFertilizer = () => {
    if (selectedFertilizer && amountPerUse > 0) {
      const pricePerCC = totalPrice / totalAmount || 0
      const pricePerUsePerArea = pricePerCC * amountPerUse
      const usableArea = totalAmount / amountPerUse

      const newFertilizer: FertilizerUsage = {
        fertilizer: selectedFertilizer,
        amountPerUse,
        price: pricePerCC,
        pricePerUsePerArea,
        usableArea
      }
      setOurSummary((prev) => [...prev, newFertilizer])
      closeMainModal()
    }
  }

  const confirmNutriplantFertilizer = () => {
    if (selectedFertilizer && amountPerUse > 0) {
      const price = FertilizerPrices[selectedFertilizer as FertilizerType] || 0
      const pricePerCC = price / 1000
      const pricePerUsePerArea = pricePerCC * amountPerUse
      const totalFertilizerVolume = 1000
      const usableArea = totalFertilizerVolume / amountPerUse

      const newFertilizer: FertilizerUsage = {
        fertilizer: selectedFertilizer,
        amountPerUse,
        price: pricePerCC,
        pricePerUsePerArea,
        usableArea
      }

      setOurSummary((prev) => [...prev, newFertilizer])
      setIsNutriplantAmountModalVisible(false)
      setSelectedFertilizer(null)
      setAmountPerUse(0)
    } else {
      alert('กรุณาเลือกปุ๋ยและป้อนปริมาณการใช้ก่อนกดยืนยัน')
    }
  }

  const columns = [
    {
      title: 'ชื่อปุ๋ย',
      dataIndex: 'fertilizer',
      key: 'fertilizer'
    },
    {
      title: 'ปริมาณต่อไร่ (ซีซี)',
      dataIndex: 'amountPerUse',
      key: 'amountPerUse'
    },
    {
      title: 'ราคา (บาท/ซีซี)',
      dataIndex: 'price',
      key: 'price'
    },
    {
      title: 'ราคาต่อไร่',
      dataIndex: 'pricePerUsePerArea',
      key: 'pricePerUsePerArea'
    },
    {
      title: 'ใช้ได้กี่ไร่',
      dataIndex: 'usableArea',
      key: 'usableArea',
      render: (value: number) => value.toFixed(2)
    }
  ]

  const totalPriceSummary = ourSummary.reduce(
    (total, item) => total + item.pricePerUsePerArea,
    0
  )

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>สูตรใหม่</h2>
        <Button
          type="primary"
          shape="circle"
          icon={<PlusOutlined />}
          onClick={openMainModal}
        />
      </div>
      <Table
        columns={columns}
        dataSource={ourSummary}
        rowKey={(record) => `${record.fertilizer}-${record.price}`}
        pagination={false}
        style={{ marginTop: '16px' }}
      />
      <h4>ราคารวม: {totalPriceSummary.toLocaleString()} บาท/ไร่</h4>

      <Modal
        open={isMainModalVisible}
        onCancel={closeMainModal}
        footer={null}
        centered
      >
        <h3>เลือกประเภทปุ๋ย</h3>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Button
              type="primary"
              style={{ width: '100%', height: '45px' }}
              onClick={() => {
                setIsMarketModalVisible(true)
                setIsMainModalVisible(false)
              }}
            >
              ปุ๋ยท้องตลาด
            </Button>
          </Col>
          <Col span={12}>
            <Button
              type="primary"
              style={{ width: '100%', height: '45px' }}
              onClick={() => {
                setIsSubModalVisible(true)
                setIsMainModalVisible(false)
              }}
            >
              ปุ๋ย Nutriplant
            </Button>
          </Col>
        </Row>
      </Modal>

      <Modal
        open={isMarketModalVisible}
        onCancel={closeMainModal}
        onOk={confirmFertilizer}
        okText="ยืนยัน"
        cancelText="ยกเลิก"
        centered
      >
        <h3>เพิ่มปุ๋ยของชาวสวน</h3>
        <AutoComplete
          style={{ width: '100%', marginBottom: '16px' }}
          options={[
            { value: 'ปุ๋ยทางดินธาตุอาหารหลัก' },
            { value: 'ปุ๋ยทางใบธาตุอาหารหลัก' },
            { value: 'ปุ๋ยทางดินธาตุอาหารรอง' },
            { value: 'ปุ๋ยทางดินธาตุอาหารรอง' },
            { value: 'สารเสริมประสิทธิภาพ' },
            { value: 'ยาฆ่าแมลง' },
            { value: 'ฮอร์โมน' }
          ]}
          placeholder="ชื่อปุ๋ย"
          value={selectedFertilizer || ''}
          onChange={(value) => setSelectedFertilizer(value)}
        />
        <InputNumber
          placeholder="ปริมาณทั้งหมด (ซีซี)"
          style={{ width: '100%', marginBottom: '16px' }}
          value={totalAmount}
          onChange={(value) => {
            if (typeof value === 'number') {
              setTotalAmount(value)
            }
          }}
          addonAfter="ซีซี"
        />
        <InputNumber
          placeholder="ปริมาณการใช้ต่อไร่ (ซีซี)"
          style={{ width: '100%', marginBottom: '16px' }}
          value={amountPerUse}
          onChange={(value) => {
            if (typeof value === 'number') {
              setAmountPerUse(value)
            }
          }}
          addonAfter="ซีซี"
        />
        <InputNumber
          placeholder="ราคา (บาททั้งหมด)"
          style={{ width: '100%', marginBottom: '16px' }}
          value={totalPrice}
          onChange={(value) => {
            if (typeof value === 'number') {
              setTotalPrice(value)
            }
          }}
          addonAfter="บาท"
        />
      </Modal>

      <Modal
        open={isSubModalVisible}
        onCancel={closeMainModal}
        footer={null}
        centered
      >
        <h3>เลือกปุ๋ย Nutriplant</h3>
        <Row gutter={[16, 16]}>
          {Object.entries(FertilizerPrices).map(([fertilizer, price]) => (
            <Col span={12} key={fertilizer} style={{ marginBottom: 16 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  border:
                    selectedFertilizer === fertilizer
                      ? '2px solid #10B981'
                      : '1px solid #d9d9d9',
                  borderRadius: '8px',
                  padding: '16px',
                  height: '150px',
                  textAlign: 'center',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  setSelectedFertilizer(fertilizer)
                  setIsSubModalVisible(false)
                  setIsNutriplantAmountModalVisible(true) // เปิด Modal ของ Nutriplant
                }}
              >
                <Image
                  src={FertilizerImage[fertilizer as FertilizerType]}
                  alt={fertilizer}
                  width={50}
                  height={50}
                  style={{ marginBottom: '8px' }}
                  preview={false}
                />
                <div>
                  <h4 style={{ margin: 0 }}>{fertilizer}</h4>
                  <p style={{ margin: 0 }}>
                    ราคา: {price.toLocaleString()} บาท/ซีซี
                  </p>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Modal>

      <Modal
        open={isNutriplantAmountModalVisible}
        onCancel={() => {
          setIsNutriplantAmountModalVisible(false)
          setSelectedFertilizer(null)
          setAmountPerUse(0)
        }}
        onOk={() => {
          if (amountPerUse > 0) {
            confirmNutriplantFertilizer()
          } else {
            alert('กรุณาป้อนปริมาณการใช้ก่อนกดยืนยัน')
          }
        }}
        okText="ยืนยัน"
        cancelText="ยกเลิก"
        centered
      >
        <h3>ป้อนปริมาณการใช้ (ซีซี)</h3>
        <InputNumber
          placeholder="ปริมาณการใช้ต่อไร่ (ซีซี)"
          style={{ width: '100%', marginBottom: '16px' }}
          value={amountPerUse}
          onChange={(value) => {
            if (typeof value === 'number') {
              setAmountPerUse(value)
            }
          }}
        />
      </Modal>
    </>
  )
}

export default NutriplantFarmer
