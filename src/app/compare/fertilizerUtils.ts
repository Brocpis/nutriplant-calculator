// utils/fertilizerUtils.ts
import dayjs from 'dayjs'

export interface FertilizerUsage {
  fertilizer: string
  totalAmount: number
  amountPerUse: number
  price: number
  pricePerCC: number
  pricePerUsePerArea: number
  usableArea: number
  totalUsage: number
  totalCost: number
}

export interface Period {
  id: number
  name: string
  startDate: string
  endDate: string
  interval: string
  frequency: number
  fertilizers: FertilizerUsage[]
}

export const calculateFrequency = (
  interval: string,
  startDate: string,
  endDate: string
): number => {
  const start = dayjs(startDate)
  const end = dayjs(endDate)
  const diffInDays = end.diff(start, 'day') + 1

  switch (interval) {
    case '1 สัปดาห์':
      return Math.floor(diffInDays / 7)
    case '2 สัปดาห์':
      return Math.floor(diffInDays / 14)
    case '1 เดือน':
      return Math.floor(diffInDays / 30)
    default:
      return 1
  }
}

export const totalCostPerPeriod = (fertilizers: FertilizerUsage[]): number =>
  fertilizers.reduce((sum, f) => sum + f.totalCost, 0)
