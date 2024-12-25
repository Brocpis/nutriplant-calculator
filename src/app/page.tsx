'use client'
import React from 'react'
import { Tabs, ConfigProvider, Image } from 'antd'
import LeafTab from './LeafTab'
import SoilTab from './SoilTab'

const { TabPane } = Tabs

const customTheme = {
  token: {
    colorPrimary: '#10B981' // Emerald สีเขียว
  }
}

const App: React.FC = () => {
  return (
    <ConfigProvider theme={customTheme}>
      <div
        style={{
          padding: 24,
          maxWidth: 800,
          margin: '0 auto',
          backgroundColor: 'white',
          textAlign: 'center'
        }}
      >
        <Image
          src="/logo.jpg"
          alt="Logo"
          width={150}
          preview={false}
          style={{ marginBottom: 16 }}
        />
        <h3>คำนวนปริมาณปุ๋ยที่ต้องใช้</h3>
        <Tabs defaultActiveKey="ทางใบ">
          <TabPane tab="ทางใบ" key="ทางใบ">
            <LeafTab />
          </TabPane>
          <TabPane tab="ทางดิน" key="ทางดิน">
            <SoilTab />
          </TabPane>
        </Tabs>
      </div>
    </ConfigProvider>
  )
}

export default App
