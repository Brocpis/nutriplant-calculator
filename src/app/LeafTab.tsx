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
  FertilizerFormula,
  FertilizerImage,
  CanopySize
} from './enums'

const { Option } = Select

// Enum for canopy size multipliers

interface FertilizerUsage {
  fertilizer: string // ใช้ string เพื่อแสดงชื่อภาษาไทย
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
            const usageAmount = usage || 0 // จำนวนใช้ต่อครั้ง (ซีซี)
            const totalAmountPerArea = usageAmount * area * selectedCanopySize // ใช้ทั้งหมดตามจำนวนไร่และทรงพุ่ม
            const totalAmountForTimes = totalAmountPerArea * times // ใช้ทั้งหมดตามจำนวนครั้ง
            const litersRequired = Math.ceil(totalAmountForTimes / 1000) // แปลงเป็นลิตร (ปัดขึ้น)
            const pricePerUnit =
              FertilizerPrices[fertilizerKey as FertilizerType] || 0
            const price = litersRequired * pricePerUnit // ราคา = จำนวนลิตร * ราคาต่อลิตร
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
      title: `จำนวนใช้ทั้งหมด (${area || 'XX'} ไร่) (ซีซี)`,
      dataIndex: 'totalAmountPerArea',
      key: 'totalAmountPerArea'
    },
    {
      title: `จำนวนใช้ทั้งหมด (${times || 'XX'} ครั้ง) (ซีซี)`,
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
          <InputNumber
            placeholder="จำนวนไร่"
            min={1}
            style={{ width: '100%' }}
            onChange={(value) => setArea(value || 0)}
          />
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={12}>
          <InputNumber
            placeholder="จำนวนครั้งที่ให้ปุ๋ย"
            min={1}
            style={{ width: '100%' }}
            onChange={(value) => setTimes(value || 0)}
          />
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

export default LeafTab
