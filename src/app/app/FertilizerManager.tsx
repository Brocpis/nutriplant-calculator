'use client'
import React, { useState } from 'react'
import {
  Button,
  Table,
  Modal,
  Row,
  Col,
  InputNumber,
  AutoComplete,
  DatePicker,
  Input,
  Divider,
  Card,
  Layout,
  Space,
  Descriptions,
  Image
} from 'antd'
import {
  PlusOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  CloseOutlined
} from '@ant-design/icons'
import * as XLSX from 'xlsx'
import dayjs, { Dayjs } from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import {
  calculateFrequency,
  totalCostPerPeriod,
  Period,
  FertilizerUsage
} from './fertilizerUtils'
import {
  FertilizerDescribe,
  FertilizerImage,
  FertilizerPrices,
  FertilizerType,
  FertilizerVolume
} from '../enums'

dayjs.extend(isBetween)

const { Content } = Layout

const FertilizerManager: React.FC = () => {
  const [periods, setPeriods] = useState<Period[]>([])
  const [isPeriodModalVisible, setIsPeriodModalVisible] = useState(false)
  const [currentPeriod, setCurrentPeriod] = useState<Period | null>(null)
  const [isEditingPeriod, setIsEditingPeriod] = useState(false)

  const [periodName, setPeriodName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [interval, setInterval] = useState('')
  const [frequency, setFrequency] = useState<number>(1)

  const [selectedFertilizer, setSelectedFertilizer] = useState<string | null>(
    null
  )
  const [amountPerUse, setAmountPerUse] = useState<number>(0)
  const [totalAmount, setTotalAmount] = useState<number>(0)
  const [totalPrice, setTotalPrice] = useState<number>(0)
  const [isFertilizerModalVisible, setIsFertilizerModalVisible] =
    useState(false)
  const [isEditingFertilizer, setIsEditingFertilizer] = useState(false)
  const [editingFertilizerIndex, setEditingFertilizerIndex] = useState<
    number | null
  >(null)

  const [isPopupVisible, setIsPopupVisible] = useState(false)
  const [popupContent, setPopupContent] = useState<string | null>(null)

  const handlePopup = (fertilizer: string) => {
    setPopupContent(fertilizer) // อัปเดตเนื้อหาของปุ๋ย
    setIsPopupVisible(true) // แสดง popup
  }

  const closePopup = () => {
    setIsPopupVisible(false) // ซ่อน popup
  }

  const isPeriodFormValid = () => {
    return periodName && startDate && endDate && interval
  }

  const isFertilizerFormValid = () => {
    return (
      selectedFertilizer &&
      amountPerUse > 0 &&
      totalAmount > 0 &&
      totalPrice > 0
    )
  }

  const addNewPeriod = () => {
    if (!isPeriodFormValid()) return

    const calculatedFrequency = calculateFrequency(interval, startDate, endDate)
    const newPeriod: Period = {
      id: Date.now(),
      name: periodName,
      startDate,
      endDate,
      interval,
      frequency: calculatedFrequency,
      fertilizers: []
    }

    if (isEditingPeriod && currentPeriod) {
      setPeriods((prev) =>
        prev.map((p) =>
          p.id === currentPeriod.id ? { ...newPeriod, id: p.id } : p
        )
      )
    } else {
      setPeriods((prev) => [...prev, newPeriod])
    }
    resetPeriodModal()
  }

  const resetPeriodModal = () => {
    setPeriodName('')
    setStartDate('')
    setEndDate('')
    setInterval('')
    setFrequency(1)
    setIsPeriodModalVisible(false)
    setIsEditingPeriod(false)
    setCurrentPeriod(null)
  }

  const deletePeriod = (periodId: number) => {
    setPeriods((prev) => prev.filter((p) => p.id !== periodId))
  }

  const editPeriod = (period: Period) => {
    setIsEditingPeriod(true)
    setCurrentPeriod(period)
    setPeriodName(period.name)
    setStartDate(period.startDate)
    setEndDate(period.endDate)
    setInterval(period.interval)
    setFrequency(period.frequency)
    setIsPeriodModalVisible(true)
  }

  const addFertilizerToPeriod = () => {
    if (!isFertilizerFormValid() || !currentPeriod) return

    const pricePerCC = totalPrice / totalAmount || 0
    const pricePerUsePerArea = pricePerCC * amountPerUse
    const usableArea = totalAmount / amountPerUse
    const totalUsage = amountPerUse * currentPeriod.frequency
    const totalCost = pricePerUsePerArea * currentPeriod.frequency

    const newFertilizer: FertilizerUsage = {
      fertilizer: selectedFertilizer ?? '',
      totalAmount,
      amountPerUse,
      price: totalPrice,
      pricePerCC,
      pricePerUsePerArea,
      usableArea,
      totalUsage,
      totalCost
    }

    setPeriods((prev) =>
      prev.map((p) => {
        if (p.id === currentPeriod.id) {
          const fertilizers =
            isEditingFertilizer && editingFertilizerIndex !== null
              ? p.fertilizers.map((f, idx) =>
                  idx === editingFertilizerIndex ? newFertilizer : f
                )
              : [...p.fertilizers, newFertilizer]

          return { ...p, fertilizers }
        }
        return p
      })
    )
    resetFertilizerModal()
  }

  const resetFertilizerModal = () => {
    setSelectedFertilizer(null)
    setAmountPerUse(0)
    setTotalAmount(0)
    setTotalPrice(0)
    setIsFertilizerModalVisible(false)
    setIsEditingFertilizer(false)
    setEditingFertilizerIndex(null)
  }

  const [marketFertilizers, setMarketFertilizers] = useState<
    { name: string; price: number; volume: number }[]
  >([])

  const editFertilizer = (period: Period, index: number) => {
    const fertilizer = period.fertilizers[index]
    setIsEditingFertilizer(true)
    setEditingFertilizerIndex(index)
    setSelectedFertilizer(fertilizer.fertilizer)
    setAmountPerUse(fertilizer.amountPerUse)
    setTotalAmount(fertilizer.usableArea * fertilizer.amountPerUse)
    setTotalPrice(fertilizer.price)
    setCurrentPeriod(period)
    setIsFertilizerModalVisible(true)
  }

  const deleteFertilizer = (periodId: number, fertilizerIndex: number) => {
    setPeriods((prev) =>
      prev.map((p) =>
        p.id === periodId
          ? {
              ...p,
              fertilizers: p.fertilizers.filter(
                (_, index) => index !== fertilizerIndex
              )
            }
          : p
      )
    )
  }

  const periodColumns = (period: Period) => [
    {
      title: 'ชื่อปุ๋ย',
      dataIndex: 'fertilizer',
      key: 'fertilizer',
      render: (text: string) => {
        const isNutriplant = Object.values(FertilizerType).includes(
          text as FertilizerType
        )
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {isNutriplant && (
              <img
                src={FertilizerImage[text as FertilizerType]}
                alt={text}
                style={{
                  width: 40,
                  height: 40,
                  marginRight: 8,
                  cursor: 'pointer',
                  borderRadius: '4px'
                }}
                onClick={() => handlePopup(text)}
              />
            )}
            <span>{text}</span>
          </div>
        )
      }
    },
    { title: 'ราคา (บาท)', dataIndex: 'price', key: 'price' },
    { title: 'ปริมาณ (ซีซี)', dataIndex: 'totalAmount', key: 'totalAmount' },
    {
      title: 'จำนวนครั้ง',
      key: 'frequency',
      render: () => period.frequency
    },
    {
      title: 'ราคา/ปริมาณ (บาท/ซีซี)',
      dataIndex: 'pricePerCC',
      key: 'pricePerCC',
      render: (value: number) => value.toFixed(2)
    },
    {
      title: 'ปริมาณการใช้ (ซีซี/ไร่)',
      dataIndex: 'amountPerUse',
      key: 'amountPerUsePerArea'
    },
    {
      title: 'ราคา/ไร่',
      dataIndex: 'pricePerUsePerArea',
      key: 'pricePerUsePerArea',
      render: (value: number) => value.toFixed(2)
    },
    { title: 'ปริมาณการใช้รวม', dataIndex: 'totalUsage', key: 'totalUsage' },
    {
      title: 'ราคารวม (บาท)',
      dataIndex: 'totalCost',
      key: 'totalCost',
      render: (value: number) => value.toFixed(2)
    },
    {
      title: (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setCurrentPeriod(period)
              setIsFertilizerModalVisible(true)
            }}
          >
            เพิ่มปุ๋ย
          </Button>
        </div>
      ),
      key: 'action',
      render: (_: any, record: FertilizerUsage, index: number) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => editFertilizer(period, index)}
          />
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => deleteFertilizer(period.id, index)}
          />
        </Space>
      )
    }
  ]

  const disabledDate = (current: Dayjs) => {
    const today = dayjs().startOf('day')
    return current && current.isBefore(today) // Disable dates before today
  }

  const renderDateCell = (current: string | number | Dayjs) => {
    if (!dayjs.isDayjs(current)) return current // Return unmodified if not Dayjs

    const isMarked = periods.some((period) =>
      current.isBetween(
        dayjs(period.startDate),
        dayjs(period.endDate),
        null,
        '[]'
      )
    )

    return (
      <div
        style={{
          backgroundColor: isMarked ? '#f5f5f5' : undefined,
          border: isMarked ? '1px solid #00b96b' : undefined,
          borderRadius: '4px',
          padding: '4px',
          textAlign: 'center'
        }}
      >
        {current.date()}
      </div>
    )
  }

  const handleDeleteTemplate = (index: number) => {
    setFertilizerTemplates((prev) => prev.filter((_, i) => i !== index))
  }

  const exportToExcel = () => {
    const combinedData = periods.flatMap((period) =>
      period.fertilizers.map((fertilizer) => ({
        ชื่อช่วง: period.name,
        วันที่เริ่มต้น: dayjs(period.startDate).format('DD/MM/YYYY'),
        วันที่สิ้นสุด: dayjs(period.endDate).format('DD/MM/YYYY'),
        ความถี่ในการใช้: period.interval,
        จำนวนครั้ง: period.frequency,
        ชื่อปุ๋ย: fertilizer.fertilizer,
        'ปริมาณต่อครั้ง (ซีซี)': fertilizer.amountPerUse,
        'ราคา (บาททั้งหมด)': fertilizer.price,
        'ราคา/ปริมาณ (บาท/ซีซี)': fertilizer.pricePerCC.toFixed(2),
        'ราคา/ไร่ (บาท)': fertilizer.pricePerUsePerArea.toFixed(2),
        'ปริมาณการใช้รวม (ซีซี)': fertilizer.totalUsage,
        'ราคารวม (บาท)': fertilizer.totalCost.toFixed(2)
      }))
    )

    const summaryData = Object.entries(
      periods.reduce((summary, period) => {
        period.fertilizers.forEach((fertilizer) => {
          summary[fertilizer.fertilizer] =
            (summary[fertilizer.fertilizer] || 0) + fertilizer.totalUsage
        })
        return summary
      }, {} as Record<string, number>)
    ).map(([fertilizer, total]) => ({
      ชื่อปุ๋ย: fertilizer,
      'ปริมาณการใช้รวม (ซีซี)': total.toLocaleString()
    }))

    const workbook = XLSX.utils.book_new()

    const worksheet = XLSX.utils.json_to_sheet(combinedData)
    XLSX.utils.book_append_sheet(workbook, worksheet, 'ข้อมูลปุ๋ยทุกช่วง')
    const summaryWorksheet = XLSX.utils.json_to_sheet(summaryData)
    XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'สรุปปุ๋ย')

    XLSX.writeFile(workbook, 'สรุปข้อมูลปุ๋ย.xlsx')
  }

  const [fertilizerTemplates, setFertilizerTemplates] = useState<
    { name: string; volume: number; usagePerArea: number; price: number }[]
  >([])

  const saveFertilizerTemplate = () => {
    if (
      !selectedFertilizer ||
      totalAmount <= 0 ||
      amountPerUse <= 0 ||
      totalPrice <= 0
    )
      return

    const exists = fertilizerTemplates.find(
      (template) => template.name === selectedFertilizer
    )

    if (!exists) {
      const newTemplate = {
        name: selectedFertilizer,
        volume: totalAmount,
        usagePerArea: amountPerUse,
        price: totalPrice
      }
      setFertilizerTemplates((prev) => [...prev, newTemplate])
    }

    resetFertilizerModal()
  }

  return (
    <Content style={{ padding: '24px 50px' }}>
      <Card>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 16
          }}
        >
          <h2>การใช้ปุ๋ยตามช่วง</h2>
          <div>
            <Space>
              <Button
                type="default"
                icon={<DownloadOutlined />}
                onClick={exportToExcel}
              >
                Export to Excel
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsPeriodModalVisible(true)}
              >
                เพิ่มช่วง
              </Button>
            </Space>
          </div>
        </div>
        {periods.map((period) => (
          <div key={period.id} style={{ marginBottom: '16px' }}>
            <h3>
              {period.name} ({dayjs(period.startDate).format('DD/MM/YYYY')} -{' '}
              {dayjs(period.endDate).format('DD/MM/YYYY')}) [{period.interval}]
            </h3>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginBottom: '8px'
              }}
            >
              <Space>
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => editPeriod(period)}
                >
                  แก้ไขช่วง
                </Button>
                <Button
                  type="link"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => deletePeriod(period.id)}
                >
                  ลบช่วง
                </Button>
              </Space>
            </div>
            <Table
              columns={periodColumns(period)}
              dataSource={period.fertilizers}
              rowKey={(record) => `${record.fertilizer}-${record.price}`}
              pagination={false}
            />
            <div style={{ marginTop: '8px', fontWeight: 'bold' }}>
              ราคารวมช่วงนี้:{' '}
              {totalCostPerPeriod(period.fertilizers).toLocaleString()} บาท
            </div>
          </div>
        ))}
      </Card>
      <Divider />
      <Card
        title="สรุปข้อมูลการใช้ปุ๋ย"
        bordered={false}
        style={{ marginTop: 24 }}
      >
        <Descriptions bordered column={1}>
          <Descriptions.Item label="ราคารวมทั้งหมด">
            {periods
              .reduce(
                (total, period) =>
                  total + totalCostPerPeriod(period.fertilizers),
                0
              )
              .toLocaleString()}{' '}
            บาท
          </Descriptions.Item>
          <Descriptions.Item label="จำนวนครั้งในการฉีดทั้งหมด">
            {periods.reduce((total, period) => total + period.frequency, 0)}{' '}
            ครั้ง
          </Descriptions.Item>
          <Descriptions.Item label="จำนวนปุ๋ยที่ใช้แต่ละตัว">
            <Table
              dataSource={Object.entries(
                periods.reduce((summary, period) => {
                  period.fertilizers.forEach((fertilizer) => {
                    summary[fertilizer.fertilizer] =
                      (summary[fertilizer.fertilizer] || 0) +
                      fertilizer.totalUsage
                  })
                  return summary
                }, {} as Record<string, number>)
              ).map(([fertilizer, total]) => ({
                key: fertilizer,
                fertilizer,
                total
              }))}
              columns={[
                {
                  title: 'ชื่อปุ๋ย',
                  dataIndex: 'fertilizer',
                  key: 'fertilizer'
                },
                {
                  title: 'ปริมาณรวม (ซีซี)',
                  dataIndex: 'total',
                  key: 'total',
                  render: (value) => value.toLocaleString()
                }
              ]}
              pagination={false}
              size="small"
            />
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Period Modal */}
      <Modal
        open={isPeriodModalVisible}
        onCancel={resetPeriodModal}
        onOk={addNewPeriod}
        okText="ยืนยัน"
        cancelText="ยกเลิก"
        centered
        okButtonProps={{ disabled: !isPeriodFormValid() }}
      >
        <h3>เพิ่มช่วงการใช้ปุ๋ย</h3>
        <label>ชื่อช่วง:</label>
        <Input
          placeholder="ชื่อช่วง"
          value={periodName}
          onChange={(e) => setPeriodName(e.target.value)}
          style={{ marginBottom: '16px' }}
        />
        <Row gutter={16} style={{ marginBottom: '16px' }}>
          <Col span={12}>
            <label>วันที่เริ่มต้น:</label>
            <DatePicker
              placeholder="วันที่เริ่มต้น"
              style={{ width: '100%' }}
              format={'DD-MM-YYYY'}
              defaultPickerValue={startDate ? dayjs(startDate) : undefined}
              onChange={(date) => {
                const newStartDate = date ? date.format('YYYY-MM-DD') : ''
                setStartDate(newStartDate)
                const updatedFrequency = calculateFrequency(
                  interval,
                  newStartDate,
                  endDate
                )
                setFrequency(updatedFrequency)
              }}
              disabledDate={disabledDate}
              cellRender={renderDateCell}
            />
          </Col>
          <Col span={12}>
            <label>วันที่สิ้นสุด:</label>
            <DatePicker
              placeholder="วันที่สิ้นสุด"
              style={{ width: '100%' }}
              defaultPickerValue={endDate ? dayjs(endDate) : undefined}
              format={'DD-MM-YYYY'}
              onChange={(date) => {
                const newEndDate = date ? date.format('YYYY-MM-DD') : ''
                setEndDate(newEndDate)
                const updatedFrequency = calculateFrequency(
                  interval,
                  startDate,
                  newEndDate
                )
                setFrequency(updatedFrequency)
              }}
              disabledDate={disabledDate}
              cellRender={renderDateCell}
            />
          </Col>
        </Row>
        <label>ความถี่ในการให้:</label>
        <AutoComplete
          style={{ width: '100%', marginBottom: '16px' }}
          options={[
            { value: '1 สัปดาห์' },
            { value: '2 สัปดาห์' },
            { value: '1 เดือน' }
          ]}
          placeholder="ความถี่ในการให้"
          value={interval}
          onChange={(value) => {
            setInterval(value)
            const calculatedFrequency = calculateFrequency(
              value,
              startDate,
              endDate
            )
            setFrequency(calculatedFrequency)
          }}
        />
        <label>จำนวนครั้งของการใช้ปุ๋ย:</label>
        <InputNumber
          placeholder="จำนวนครั้งของการใช้ปุ๋ย"
          value={frequency}
          disabled
          style={{ width: '100%' }}
        />
      </Modal>

      {/* Fertilizer Modal */}

      <Modal
        open={isFertilizerModalVisible}
        onCancel={resetFertilizerModal}
        onOk={addFertilizerToPeriod}
        okText="ยืนยัน"
        cancelText="ยกเลิก"
        centered
        okButtonProps={{ disabled: !isFertilizerFormValid() }}
      >
        <h3>เพิ่มปุ๋ย</h3>
        <label>ชื่อปุ๋ย:</label>

        <AutoComplete
          style={{ width: '100%', marginBottom: '16px' }}
          options={[
            {
              label: 'Nutriplant Fertilizers',
              options: Object.values(FertilizerType).map((key) => ({
                value: `nutriplant:${key}`,
                label: (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img
                      src={FertilizerImage[key]}
                      alt={key}
                      style={{ width: 40, height: 40, marginRight: 10 }}
                    />
                    <span>{key}</span>
                  </div>
                )
              }))
            },
            {
              label: 'Templates',
              options: fertilizerTemplates.map((template, index) => ({
                value: `template:${template.name}_${index}`,
                label: (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span>{template.name}</span>
                    <span style={{ marginLeft: 16 }}>
                      {`ราคา: ${template.price} / ปริมาณ: ${template.volume} / ต่อไร่: ${template.usagePerArea}`}
                    </span>
                    <CloseOutlined
                      style={{
                        color: 'red',
                        marginLeft: 8,
                        cursor: 'pointer'
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteTemplate(index)
                      }}
                    />
                  </div>
                )
              }))
            }
          ]}
          placeholder="เลือกปุ๋ยหรือเพิ่มปุ๋ยใหม่"
          value={selectedFertilizer || ''}
          onChange={(value) => {
            setSelectedFertilizer(value) // อนุญาตให้พิมพ์ได้
          }}
          onSelect={(value) => {
            const [type, detail] = value.split(':') // แยกประเภทและรายละเอียด
            if (type === 'nutriplant') {
              if (
                Object.values(FertilizerType).includes(detail as FertilizerType)
              ) {
                const selectedNutriplant = detail as FertilizerType
                setSelectedFertilizer(selectedNutriplant)
                setTotalPrice(FertilizerPrices[selectedNutriplant])
                setTotalAmount(FertilizerVolume[selectedNutriplant])
                setAmountPerUse(0)
              }
            } else if (type === 'template') {
              // หากเป็น Template
              const [, indexStr] = detail.split('_')
              const index = parseInt(indexStr, 10)
              const template = fertilizerTemplates[index]
              if (template) {
                setSelectedFertilizer(template.name)
                setTotalAmount(template.volume)
                setAmountPerUse(template.usagePerArea)
                setTotalPrice(template.price)
              }
            }
          }}
        />
        <label>ปริมาณทั้งหมด (ซีซี):</label>
        <InputNumber
          placeholder="ปริมาณทั้งหมด (ซีซี)"
          style={{ width: '100%', marginBottom: '16px' }}
          value={totalAmount}
          onChange={(value) => {
            if (typeof value === 'number') setTotalAmount(value)
            if (marketFertilizers.find((f) => f.name === selectedFertilizer)) {
              setMarketFertilizers((prev) =>
                prev.map((f) =>
                  f.name === selectedFertilizer
                    ? { ...f, volume: value || 0 }
                    : f
                )
              )
            }
          }}
        />
        <label>ปริมาณการใช้ต่อไร่ (ซีซี):</label>
        <InputNumber
          placeholder="ปริมาณการใช้ต่อไร่ (ซีซี)"
          style={{ width: '100%', marginBottom: '16px' }}
          value={amountPerUse}
          onChange={(value) => {
            if (typeof value === 'number') setAmountPerUse(value)
          }}
        />
        <label>ราคา (บาททั้งหมด):</label>
        <InputNumber
          placeholder="ราคา (บาททั้งหมด)"
          style={{ width: '100%', marginBottom: '16px' }}
          value={totalPrice}
          onChange={(value) => {
            if (typeof value === 'number') setTotalPrice(value)
            if (marketFertilizers.find((f) => f.name === selectedFertilizer)) {
              setMarketFertilizers((prev) =>
                prev.map((f) =>
                  f.name === selectedFertilizer
                    ? { ...f, price: value || 0 }
                    : f
                )
              )
            }
          }}
        />
        <Button
          type="primary"
          onClick={saveFertilizerTemplate}
          disabled={!isFertilizerFormValid()}
          style={{ marginTop: '16px' }}
        >
          Save Template
        </Button>
      </Modal>

      <Modal
        title="ข้อมูลปุ๋ย"
        open={isPopupVisible}
        onCancel={closePopup}
        footer={null}
      >
        {popupContent && (
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '16px'
              }}
            >
              <Image
                src={FertilizerImage[popupContent as FertilizerType]}
                alt={popupContent}
                width={250}
                preview={false}
              />
            </div>
            <p>
              <strong>ชื่อปุ๋ย:</strong> {popupContent}
            </p>
            {FertilizerDescribe[popupContent as FertilizerType] && (
              <p>
                <strong>คำอธิบาย:</strong>{' '}
                {FertilizerDescribe[popupContent as FertilizerType]}
              </p>
            )}
          </div>
        )}
      </Modal>
    </Content>
  )
}

export default FertilizerManager
