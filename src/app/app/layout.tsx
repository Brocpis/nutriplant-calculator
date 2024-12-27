'use client'

import React, { useState, useEffect } from 'react'
import { DesktopOutlined, ContactsOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { ConfigProvider, Layout, Menu } from 'antd'
import Image from 'next/image' // Import Image from next/image

const { Header, Content, Footer, Sider } = Layout

type MenuItem = Required<MenuProps>['items'][number]

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label
  } as MenuItem
}

const items: MenuItem[] = [
  getItem('จัดการปุ๋ย', '1', <DesktopOutlined />),
  getItem('ติดต่อเรา', '2', <ContactsOutlined />)
]

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = useState(false)
  const logoSize = collapsed ? 40 : 120
  const [isClient, setIsClient] = useState(false)

  // Ensure rendering only happens on the client
  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <html lang="en">
      <body>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#00b96b',
              borderRadius: 2
            },
            components: {
              Layout: {
                siderBg: '#ffffff',
                triggerBg: '#ffffff',
                headerBg: '#ffffff',
                triggerColor: 'rgba(0, 0, 0, 0.88)'
              }
            }
          }}
        >
          <Layout style={{ minHeight: '100vh' }}>
            <Sider
              collapsible
              collapsed={collapsed}
              onCollapse={(value) => setCollapsed(value)}
            >
              <div style={{ padding: '16px', textAlign: 'center' }}>
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={logoSize}
                  height={logoSize}
                />
              </div>
              <Menu
                theme="light"
                defaultSelectedKeys={['1']}
                mode="inline"
                items={items}
                style={{ marginTop: 50 }}
              />
            </Sider>
            <Layout>
              <Header
                style={{
                  marginBottom: 15,
                  background: '#ffffff',
                  padding: '0 16px'
                }}
              >
                <h1 style={{ marginLeft: 20, fontSize: '24px', color: '#333' }}>
                  จัดการปุ๋ย
                </h1>
              </Header>
              <Content style={{ margin: '0 16px' }}>
                <div
                  style={{
                    padding: 24,
                    minHeight: 360,
                    background: '#ffffff'
                  }}
                >
                  {children}
                </div>
              </Content>
              <Footer style={{ textAlign: 'center' }}>
                Ant Design ©{new Date().getFullYear()} Created by Ant UED
              </Footer>
            </Layout>
          </Layout>
        </ConfigProvider>
      </body>
    </html>
  )
}
