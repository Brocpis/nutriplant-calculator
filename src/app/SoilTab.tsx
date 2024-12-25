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
  PlantType,
  FertilizerType,
  FertilizerPrices,
  PlantStagesGrouped,
  FertilizerImage
} from './enums'

const { Option } = Select

interface FertilizerUsage {
  fertilizer: string // ใช้ string เพื่อแสดงชื่อภาษาไทย
  amountPerUse: number
  totalAmountPerArea: number
  litersRequired: number
  price: number
}

const SoilTab: React.FC = () => {
  const [selectedPlant, setSelectedPlant] = useState<PlantType | null>(null)
  const [selectedStage, setSelectedStage] = useState<string | null>(null)
  const [area, setArea] = useState<number>(0)
  const [summary, setSummary] = useState<FertilizerUsage[]>([])
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const [selectedFertilizerImage, setSelectedFertilizerImage] = useState<
    string | null
  >(null)

  const calculateUsage = () => {
    if (selectedPlant && selectedStage && area > 0) {
      const stageData =
        PlantStagesGrouped[selectedPlant]?.soilStages[selectedStage]
      if (stageData) {
        const result = stageData.fertilizers
          .map(({ type }) =>
            Object.entries(type || {}).map(([fertilizerKey, usage]) => {
              const usageAmount = usage || 0 // จำนวนใช้ต่อไร่
              const totalAmountPerArea = usageAmount * area // ใช้ทั้งหมดตามจำนวนไร่
              const litersRequired = Math.ceil(totalAmountPerArea / 1000) // แปลงเป็นลิตร (ปัดขึ้น)
              const pricePerUnit =
                FertilizerPrices[fertilizerKey as FertilizerType] || 0
              const price = litersRequired * pricePerUnit // ราคา = จำนวนลิตร * ราคาต่อลิตร
              return {
                fertilizer: fertilizerKey,
                amountPerUse: usageAmount,
                totalAmountPerArea,
                litersRequired,
                price
              }
            })
          )
          .flat()
        setSummary(result)
      }
    }
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
      title: 'จำนวนใช้ต่อไร่ (ซีซี)',
      dataIndex: 'amountPerUse',
      key: 'amountPerUse'
    },
    {
      title: `จำนวนใช้ทั้งหมด (${area || 'XX'} ไร่) (ซีซี)`,
      dataIndex: 'totalAmountPerArea',
      key: 'totalAmountPerArea'
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
              setSummary([])
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
              setSummary([])
            }}
          >
            {selectedPlant &&
              Object.keys(
                PlantStagesGrouped[selectedPlant]?.soilStages || {}
              ).map((stage) => {
                const stageDescription =
                  PlantStagesGrouped[selectedPlant]?.soilStages[stage]
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
        <Col span={24}>
          <InputNumber
            placeholder="จำนวนไร่"
            min={1}
            style={{ width: '100%' }}
            onChange={(value) => setArea(value || 0)}
          />
        </Col>
      </Row>
      <Button
        type="primary"
        style={{ width: '100%', marginTop: 16 }}
        onClick={calculateUsage}
        disabled={!selectedStage || area <= 0}
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

      {/* Modal for displaying fertilizer image */}
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

export default SoilTab
