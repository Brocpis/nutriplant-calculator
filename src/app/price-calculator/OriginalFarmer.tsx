import React, { useState } from 'react'
import { Button, Table, Modal, AutoComplete, InputNumber } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

interface FertilizerUsage {
  fertilizer: string
  amountPerUse: number
  totalAmount: number
  totalPrice: number // ราคาทั้งหมด (บาท)
  pricePerCC: number // ราคา (บาท/ซีซี)
  pricePerUsePerArea: number // ราคาต่อไร่
  usableArea: number // ใช้ได้กี่ไร่
}

const OriginalFarmer: React.FC = () => {
  const [customSummary, setCustomSummary] = useState<FertilizerUsage[]>([])
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const [selectedFertilizer, setSelectedFertilizer] = useState<string | null>(
    null
  )
  const [amountPerUse, setAmountPerUse] = useState<number>(0)
  const [totalAmount, setTotalAmount] = useState<number>(0)
  const [totalPrice, setTotalPrice] = useState<number>(0)

  const openModal = () => setIsModalVisible(true)
  const closeModal = () => {
    setIsModalVisible(false)
    setSelectedFertilizer(null)
    setAmountPerUse(0)
    setTotalAmount(0)
    setTotalPrice(0)
  }

  const confirmFertilizer = () => {
    if (
      selectedFertilizer &&
      amountPerUse > 0 &&
      totalAmount > 0 &&
      totalPrice > 0
    ) {
      const pricePerCC = totalPrice / totalAmount
      const usableArea = totalAmount / amountPerUse
      const pricePerUsePerArea = pricePerCC * amountPerUse

      const newFertilizer: FertilizerUsage = {
        fertilizer: selectedFertilizer,
        amountPerUse,
        totalAmount,
        totalPrice,
        pricePerCC,
        pricePerUsePerArea,
        usableArea
      }
      setCustomSummary((prev) => [...prev, newFertilizer])
      closeModal()
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
      dataIndex: 'pricePerCC',
      key: 'pricePerCC',
      render: (value: number) => value.toFixed(2) // แสดงราคาเป็นทศนิยม 2 ตำแหน่ง
    },
    {
      title: 'ราคาต่อไร่',
      dataIndex: 'pricePerUsePerArea',
      key: 'pricePerUsePerArea',
      render: (value: number) => value.toLocaleString() // แสดงราคาเป็นตัวเลข
    },
    {
      title: 'ใช้ได้กี่ไร่',
      dataIndex: 'usableArea',
      key: 'usableArea',
      render: (value: number) => value.toFixed(2) // แสดงผลเป็นทศนิยม 2 ตำแหน่ง
    }
  ]

  const totalPriceSummary = customSummary.reduce(
    (total, item) => total + item.pricePerUsePerArea,
    0
  )

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>สูตรปกติ</h2>
        <Button
          type="primary"
          shape="circle"
          icon={<PlusOutlined />}
          onClick={openModal}
        />
      </div>
      <Table
        columns={columns}
        dataSource={customSummary}
        rowKey={(record) => `${record.fertilizer}-${record.totalPrice}`}
        pagination={false}
        style={{ marginTop: '16px' }}
      />
      <h4>ราคารวม: {totalPriceSummary.toLocaleString()} บาท/ไร่</h4>

      <Modal
        open={isModalVisible}
        onCancel={closeModal}
        onOk={confirmFertilizer}
        okText="ยืนยัน"
        cancelText="ยกเลิก"
        centered
      >
        <h3>เพิ่มปุ๋ยของชาวสวน</h3>
        <AutoComplete
          style={{ width: '100%', marginBottom: '16px' }}
          options={[
            { value: 'ปุ๋ยธาตุอาหารหลัก' },
            { value: 'ปุ๋ยธาตุอาหารรอง' },
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
    </>
  )
}

export default OriginalFarmer
