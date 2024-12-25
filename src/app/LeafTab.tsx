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
import { DeleteOutlined, RollbackOutlined } from '@ant-design/icons'
import {
  PlantType,
  FertilizerType,
  FertilizerPrices,
  PlantStagesGrouped,
  FertilizerFormula,
  FertilizerImage,
  CanopySize
} from './enums'

const { Option } = Select

interface FertilizerUsage {
  fertilizer: string
  amountPerUse: number
  totalAmountPerArea: number
  totalAmountForTimes: number
  litersRequired: number
  price: number
}

const LeafTab: React.FC = () => {
  const [selectedPlant, setSelectedPlant] = useState<PlantType | null>(null)
  const [selectedStage, setSelectedStage] = useState<string | null>(null)
  const [selectedFormula, setSelectedFormula] =
    useState<FertilizerFormula | null>(null)
  const [area, setArea] = useState<number>(0)
  const [times, setTimes] = useState<number>(0)
  const [selectedCanopySize, setSelectedCanopySize] = useState<number>(
    CanopySize.SMALL
  )
  const [summary, setSummary] = useState<FertilizerUsage[]>([])
  const [removedItems, setRemovedItems] = useState<FertilizerUsage[]>([])
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const [selectedFertilizerImage, setSelectedFertilizerImage] = useState<
    null | string
  >(null)

  const calculateUsage = () => {
    if (selectedPlant && selectedStage && area > 0 && times > 0) {
      const stageData =
        PlantStagesGrouped[selectedPlant]?.leafStages[selectedStage]
      if (stageData && selectedFormula) {
        const result = Object.entries(stageData.fertilizers[0]?.type || {}).map(
          ([fertilizerKey, usage]) => {
            const usageAmount = usage || 0
            const totalAmountPerArea = usageAmount * area * selectedCanopySize
            const totalAmountForTimes = totalAmountPerArea * times
            const litersRequired = Math.ceil(totalAmountForTimes / 1000)
            const pricePerUnit =
              FertilizerPrices[fertilizerKey as FertilizerType] || 0
            const price = litersRequired * pricePerUnit
            return {
              fertilizer: fertilizerKey,
              amountPerUse: usageAmount,
              totalAmountPerArea,
              totalAmountForTimes,
              litersRequired,
              price
            }
          }
        )
        setSummary(result)
      }
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

  const showFertilizerImage = (fertilizer: string) => {
    const imageUrl = FertilizerImage[fertilizer as FertilizerType]
    setSelectedFertilizerImage(imageUrl)
    setIsModalVisible(true)
  }

  const closeModal = () => {
    setIsModalVisible(false)
    setSelectedFertilizerImage(null)
  }

  const columns = [
    {
      title: 'ปุ๋ย',
      dataIndex: 'fertilizer',
      key: 'fertilizer',
      width: 120,
      render: (text: string) => (
        <span
          style={{ color: '#10B981', cursor: 'pointer' }}
          onClick={() => showFertilizerImage(text)}
        >
          {text}
        </span>
      )
    },
    {
      title: 'จำนวนใช้ต่อครั้ง (ซีซี)',
      dataIndex: 'amountPerUse',
      key: 'amountPerUse'
    },
    {
      title: `จำนวนใช้ทั้งหมดต่อ (${area || '0'} ไร่) (ซีซี)`,
      dataIndex: 'totalAmountPerArea',
      key: 'totalAmountPerArea'
    },
    {
      title: `จำนวนใช้ทั้งหมดต่อ (${times || '0'} ครั้ง) (ซีซี)`,
      dataIndex: 'totalAmountForTimes',
      key: 'totalAmountForTimes'
    },
    {
      title: 'จำนวนลิตร',
      dataIndex: 'litersRequired',
      key: 'litersRequired'
    },
    {
      title: 'ราคารวม (บาท)',
      dataIndex: 'price',
      key: 'price'
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

  const totalPrice = summary.reduce((total, item) => total + item.price, 0)

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Select
            placeholder="เลือกชนิดพืช"
            style={{ width: '100%' }}
            value={selectedPlant ?? undefined}
            onChange={(value) => {
              setSelectedPlant(value as PlantType)
              setSelectedStage(null)
              setSelectedFormula(null)
              setSummary([])
              setRemovedItems([])
            }}
          >
            {Object.keys(PlantStagesGrouped).map((plant) => {
              const plantKey = plant as keyof typeof PlantType
              return (
                <Option key={plant} value={plant}>
                  {PlantType[plantKey]}
                </Option>
              )
            })}
          </Select>
        </Col>
        <Col span={12}>
          <Select
            placeholder="เลือกจังหวะพืช"
            style={{ width: '100%' }}
            disabled={!selectedPlant}
            onChange={(value) => {
              setSelectedStage(value as string)
              setSelectedFormula(null)
              setSummary([])
            }}
          >
            {selectedPlant &&
              Object.keys(
                PlantStagesGrouped[selectedPlant]?.leafStages || {}
              ).map((stage) => {
                const stageDescription =
                  PlantStagesGrouped[selectedPlant]?.leafStages[stage]
                    ?.description
                return (
                  <Option key={stage} value={stage}>
                    {stageDescription}
                  </Option>
                )
              })}
          </Select>
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Select
            placeholder="เลือกสูตรปุ๋ย"
            style={{ width: '100%' }}
            disabled={!selectedStage}
            onChange={(value) => setSelectedFormula(value as FertilizerFormula)}
          >
            {selectedPlant &&
              selectedStage &&
              PlantStagesGrouped[selectedPlant]?.leafStages[
                selectedStage
              ]?.fertilizers.map((fertilizer, index) => (
                <Option key={index} value={fertilizer.formula}>
                  {fertilizer.formula}
                </Option>
              ))}
          </Select>
        </Col>
        <Col span={12}>
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
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={12}>
          <InputNumber
            placeholder="จำนวนไร่"
            min={1}
            style={{ width: '100%' }}
            onChange={(value) => setArea(value || 0)}
            addonAfter={'ไร่'}
          />
        </Col>
        <Col span={12}>
          <InputNumber
            placeholder="จำนวนครั้งที่ให้ปุ๋ย"
            min={1}
            style={{ width: '100%' }}
            onChange={(value) => setTimes(value || 0)}
            addonAfter={'ครั้ง'}
          />
        </Col>
      </Row>
      <Button
        type="primary"
        style={{ width: '100%', marginTop: 16 }}
        onClick={calculateUsage}
        disabled={!selectedFormula}
      >
        คำนวน
      </Button>
      <Table
        columns={columns}
        dataSource={summary}
        rowKey={(record) => `${record.fertilizer}-${record.amountPerUse}`}
        pagination={false}
        style={{ marginTop: 16 }}
      />
      {summary.length > 0 && (
        <h4>ราคาทั้งหมด: {totalPrice.toLocaleString()} บาท</h4>
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

      <Modal open={isModalVisible} onCancel={closeModal} footer={null} centered>
        {selectedFertilizerImage && (
          <Image
            src={selectedFertilizerImage}
            alt="Fertilizer Image"
            style={{ width: '100%' }}
            preview={false}
          />
        )}
      </Modal>
    </>
  )
}

export default LeafTab
