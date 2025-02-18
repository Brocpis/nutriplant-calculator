import { NextResponse } from 'next/server'
import { MongoClient, ObjectId } from 'mongodb'

export const dynamic = 'force-dynamic' // Prevents caching

const uri = process.env.MONGODB_URI || ''
const client = new MongoClient(uri)

export async function GET() {
  try {
    console.log('uri:', uri)
    await client.connect()
    const db = client.db('fertilizer')
    console.log('die1')
    const data = await db
      .collection('schedules')
      .find({}, { projection: { _id: 1, name: 1 } }) // Include `_id` for delete
      .toArray()
    console.log('die2', data)
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Error fetching data:', error)
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    await client.connect()
    const db = client.db('fertilizer')

    const result = await db
      .collection('schedules')
      .deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'No record found' }, { status: 404 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Error deleting data:', error)
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
