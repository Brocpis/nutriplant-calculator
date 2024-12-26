'use client'
import React from 'react'
import { Layout, Row, Col, ConfigProvider, Image } from 'antd'
import OriginalFarmer from './OriginalFarmer'
import NutriplantFarmer from './NutriplantFarmer'
import '../globals.css'

const { Footer, Content } = Layout

const FertilizerComparison: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#10B981', // Emerald สีเขียว
          borderRadius: 8,
          fontFamily: 'Kanit, sans-serif'
        }
      }}
    >
      <Layout style={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
        <Content style={{ padding: '20px', backgroundColor: '#FFFFFF' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <Image
              src="/logo.png"
              alt="Logo"
              preview={false}
              style={{
                width: '150px',
                height: '150px',
                marginBottom: '10px'
              }}
            />
            <h1 style={{ color: '#000000', fontSize: '24px' }}>
              ระบบปรับปรุงสูตร
            </h1>
          </div>
          <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
            <Col span={12}>
              <OriginalFarmer />
            </Col>
            <Col span={12}>
              <NutriplantFarmer />
            </Col>
          </Row>
        </Content>
        <Footer
          style={{
            textAlign: 'center',
            color: '#000000',
            backgroundColor: '#FFFFFF',
            padding: '10px'
          }}
        >
          © 2024 Grow up your crops
        </Footer>
      </Layout>
    </ConfigProvider>
  )
}

export default FertilizerComparison
