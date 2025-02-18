import { NextResponse } from 'next/server'
import { MongoClient, ObjectId } from 'mongodb'

const uri = process.env.MONGODB_URI || ''
const client = new MongoClient(uri)

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Missing id parameter' },
        { status: 400 }
      )
    }

    await client.connect()
    const db = client.db('fertilizer')

    const data = await db
      .collection('schedules')
      .findOne({ _id: new ObjectId(id) })

    console.log('Data:', data)

    if (!data) {
      return NextResponse.json({ error: 'Not Found' }, { status: 404 })
    }

    return NextResponse.json({ periods: data.periods }, { status: 200 })
  } catch (error) {
    console.error('Error loading data:', error)
    return NextResponse.json({ error: 'Failed to load' }, { status: 500 })
  } finally {
    await client.close()
  }
}
