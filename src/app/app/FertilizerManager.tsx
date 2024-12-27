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
  Descriptions
} from 'antd'
import {
  PlusOutlined,
  DeleteOutlined,
  DownloadOutlined
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

dayjs.extend(isBetween)

const { Content } = Layout

const FertilizerManager: React.FC = () => {
  const [periods, setPeriods] = useState<Period[]>([])
  const [isPeriodModalVisible, setIsPeriodModalVisible] = useState(false)
  const [currentPeriod, setCurrentPeriod] = useState<Period | null>(null)

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
    setPeriods((prev) => [...prev, newPeriod])
    resetPeriodModal()
  }

  const resetPeriodModal = () => {
    setPeriodName('')
    setStartDate('')
    setEndDate('')
    setInterval('')
    setFrequency(1)
    setIsPeriodModalVisible(false)
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
      amountPerUse,
      price: totalPrice,
      pricePerCC,
      pricePerUsePerArea,
      usableArea,
      totalUsage,
      totalCost
    }

    setPeriods((prev) =>
      prev.map((p) =>
        p.id === currentPeriod.id
          ? { ...p, fertilizers: [...p.fertilizers, newFertilizer] }
          : p
      )
    )
    resetFertilizerModal()
  }

  const resetFertilizerModal = () => {
    setSelectedFertilizer(null)
    setAmountPerUse(0)
    setTotalAmount(0)
    setTotalPrice(0)
    setIsFertilizerModalVisible(false)
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
    { title: 'ชื่อปุ๋ย', dataIndex: 'fertilizer', key: 'fertilizer' },
    { title: 'ราคา (บาท)', dataIndex: 'price', key: 'price' },
    { title: 'ปริมาณ (ซีซี)', dataIndex: 'amountPerUse', key: 'amountPerUse' },
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
        <Button
          type="link"
          danger
          icon={<DeleteOutlined />}
          onClick={() => deleteFertilizer(period.id, index)}
        />
      )
    }
  ]
  const disabledDate = (current: Dayjs) => {
    if (!current) return false
    const today = dayjs().startOf('day')
    if (current.isBefore(today)) return true

    return periods.some((period) =>
      current.isBetween(
        dayjs(period.startDate),
        dayjs(period.endDate),
        null,
        '[)'
      )
    )
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
            />
          </Col>
          <Col span={12}>
            <label>วันที่สิ้นสุด:</label>
            <DatePicker
              placeholder="วันที่สิ้นสุด"
              style={{ width: '100%' }}
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
            { value: 'ปุ๋ยทางดินธาตุอาหารหลัก', key: '1' },
            { value: 'ปุ๋ยทางใบธาตุอาหารหลัก', key: '2' },
            { value: 'ปุ๋ยทางดินธาตุอาหารรอง', key: '3' },
            { value: 'ปุ๋ยทางใบธาตุอาหารรอง', key: '4' },
            { value: 'ฮอร์โมน', key: '5' },
            { value: 'ยาฆ่าแมลง', key: '5' }
          ]}
          placeholder="ชื่อปุ๋ย"
          value={selectedFertilizer || ''}
          onChange={(value) => setSelectedFertilizer(value)}
        />
        <label>ปริมาณทั้งหมด (ซีซี):</label>
        <InputNumber
          placeholder="ปริมาณทั้งหมด (ซีซี)"
          style={{ width: '100%', marginBottom: '16px' }}
          value={totalAmount}
          onChange={(value) => {
            if (typeof value === 'number') setTotalAmount(value)
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
          }}
        />
      </Modal>
    </Content>
  )
}

export default FertilizerManager
