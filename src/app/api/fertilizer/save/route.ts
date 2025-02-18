import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI || ''
const client = new MongoClient(uri)

export async function POST(req: Request) {
  try {
    await client.connect()
    const db = client.db('fertilizer')
    const { name, data } = await req.json()

    await db.collection('schedules').insertOne({ name, periods: data })
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  } finally {
    await client.close()
  }
}
