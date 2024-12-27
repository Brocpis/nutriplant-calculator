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
  usableArea: number
}

const NutriplantFarmer: React.FC = () => {
  const [ourSummary, setOurSummary] = useState<FertilizerUsage[]>([])
  const [isMainModalVisible, setIsMainModalVisible] = useState<boolean>(false)
  const [selectedFertilizer, setSelectedFertilizer] = useState<string | null>(
    null
  )
  const [amountPerUse, setAmountPerUse] = useState<number>(0)
  const [totalAmount, setTotalAmount] = useState<number>(0)
  const [totalPrice, setTotalPrice] = useState<number>(0)
  const [fertilizerType, setFertilizerType] = useState<
    'market' | 'nutriplant' | null
  >(null)

  const openMainModal = () => setIsMainModalVisible(true)
  const closeMainModal = () => {
    setIsMainModalVisible(false)
    setSelectedFertilizer(null)
    setAmountPerUse(0)
    setTotalAmount(0)
    setTotalPrice(0)
    setFertilizerType(null)
  }

  const confirmFertilizer = () => {
    if (selectedFertilizer && amountPerUse > 0) {
      const pricePerCC =
        fertilizerType === 'market'
          ? totalPrice / totalAmount || 0
          : FertilizerPrices[selectedFertilizer as FertilizerType] / 1000 || 0
      const pricePerUsePerArea = pricePerCC * amountPerUse
      const usableArea =
        fertilizerType === 'market'
          ? totalAmount / amountPerUse
          : 1000 / amountPerUse

      const newFertilizer: FertilizerUsage = {
        fertilizer: selectedFertilizer,
        amountPerUse,
        price: pricePerCC,
        pricePerUsePerArea,
        usableArea
      }

      setOurSummary((prev) => [...prev, newFertilizer])
      closeMainModal()
    } else {
      alert('กรุณาเลือกปุ๋ยและป้อนปริมาณการใช้ก่อนกดยืนยัน')
    }
  }

  const columns = [
    { title: 'ชื่อปุ๋ย', dataIndex: 'fertilizer', key: 'fertilizer' },
    {
      title: 'ปริมาณต่อไร่ (ซีซี)',
      dataIndex: 'amountPerUse',
      key: 'amountPerUse'
    },
    { title: 'ราคา (บาท/ซีซี)', dataIndex: 'price', key: 'price' },
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

      {/* Main Modal */}
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
              onClick={() => setFertilizerType('market')}
            >
              ปุ๋ยท้องตลาด
            </Button>
          </Col>
          <Col span={12}>
            <Button
              type="primary"
              style={{ width: '100%', height: '45px' }}
              onClick={() => setFertilizerType('nutriplant')}
            >
              ปุ๋ย Nutriplant
            </Button>
          </Col>
        </Row>
      </Modal>

      {/* Fertilizer Modal */}
      {fertilizerType && (
        <Modal
          open={!!fertilizerType}
          onCancel={closeMainModal}
          onOk={confirmFertilizer}
          okText="ยืนยัน"
          cancelText="ยกเลิก"
          centered
        >
          {fertilizerType === 'market' ? (
            <>
              <h3>เพิ่มปุ๋ยของชาวสวน</h3>
              <AutoComplete
                style={{ width: '100%', marginBottom: '16px' }}
                options={[
                  { value: 'ปุ๋ยทางดินธาตุอาหารหลัก' },
                  { value: 'ปุ๋ยทางใบธาตุอาหารหลัก' },
                  { value: 'ปุ๋ยทางดินธาตุอาหารรอง' }
                ]}
                placeholder="ชื่อปุ๋ย"
                value={selectedFertilizer || ''}
                onChange={(value) => setSelectedFertilizer(value)}
              />
              <InputNumber
                placeholder="ปริมาณทั้งหมด (ซีซี)"
                style={{ width: '100%', marginBottom: '16px' }}
                value={totalAmount}
                onChange={(value) => value && setTotalAmount(value)}
              />
              <InputNumber
                placeholder="ปริมาณการใช้ต่อไร่ (ซีซี)"
                style={{ width: '100%', marginBottom: '16px' }}
                value={amountPerUse}
                onChange={(value) => value && setAmountPerUse(value)}
              />
              <InputNumber
                placeholder="ราคา (บาททั้งหมด)"
                style={{ width: '100%', marginBottom: '16px' }}
                value={totalPrice}
                onChange={(value) => value && setTotalPrice(value)}
              />
            </>
          ) : (
            <>
              <h3>เลือกปุ๋ย Nutriplant</h3>
              <Row gutter={[16, 16]}>
                {Object.entries(FertilizerPrices).map(([fertilizer, price]) => (
                  <Col
                    span={12}
                    key={fertilizer}
                    style={{ marginBottom: '16px' }}
                  >
                    <div
                      style={{
                        border:
                          selectedFertilizer === fertilizer
                            ? '2px solid #10B981'
                            : '1px solid #d9d9d9',
                        borderRadius: '8px',
                        padding: '16px',
                        textAlign: 'center',
                        cursor: 'pointer'
                      }}
                      onClick={() => setSelectedFertilizer(fertilizer)}
                    >
                      <Image
                        src={FertilizerImage[fertilizer as FertilizerType]}
                        alt={fertilizer}
                        width={50}
                        height={50}
                        style={{ marginBottom: '8px' }}
                        preview={false}
                      />
                      <h4>{fertilizer}</h4>
                      <p>ราคา: {price.toLocaleString()} บาท/ซีซี</p>
                    </div>
                  </Col>
                ))}
              </Row>
              <InputNumber
                placeholder="ปริมาณการใช้ต่อไร่ (ซีซี)"
                style={{ width: '100%', marginTop: '16px' }}
                value={amountPerUse}
                onChange={(value) => value && setAmountPerUse(value)}
              />
            </>
          )}
        </Modal>
      )}
    </>
  )
}

export default NutriplantFarmer
