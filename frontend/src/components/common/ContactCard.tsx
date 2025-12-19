import { Card, Typography, Space } from 'antd'
import { PhoneOutlined, MailOutlined, GlobalOutlined, ClockCircleOutlined } from '@ant-design/icons'

const { Title, Paragraph } = Typography

export interface ContactInfo {
  phone?: string
  email?: string
  website?: string
  address?: string
  hours?: string
  emergency?: string
}

interface ContactCardProps {
  title?: string
  contact: ContactInfo
}

/**
 * 联系信息卡片组件
 * 展示联系方式、地址、营业时间等信息
 */
const ContactCard = ({ title, contact }: ContactCardProps) => {
  return (
    <Card
      className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-surface-dark/60 shadow-sm"
    >
      {title && (
        <Title level={4} className="text-lg font-bold mb-4 gradient-text">
          {title}
        </Title>
      )}
      <Space direction="vertical" size="middle" className="w-full">
        {contact.phone && (
          <div className="flex items-start gap-3">
            <PhoneOutlined className="text-primary-gradientStart text-lg mt-1" />
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-500 mb-1">电话</div>
              <a
                href={`tel:${contact.phone}`}
                className="text-base font-medium text-gray-900 dark:text-gray-100 hover:text-primary-gradientStart transition-colors"
              >
                {contact.phone}
              </a>
            </div>
          </div>
        )}
        {contact.emergency && (
          <div className="flex items-start gap-3">
            <PhoneOutlined className="text-red-500 text-lg mt-1" />
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-500 mb-1">紧急电话</div>
              <a
                href={`tel:${contact.emergency}`}
                className="text-base font-medium text-red-600 dark:text-red-400 hover:text-red-700 transition-colors"
              >
                {contact.emergency}
              </a>
            </div>
          </div>
        )}
        {contact.email && (
          <div className="flex items-start gap-3">
            <MailOutlined className="text-primary-gradientStart text-lg mt-1" />
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-500 mb-1">邮箱</div>
              <a
                href={`mailto:${contact.email}`}
                className="text-base font-medium text-gray-900 dark:text-gray-100 hover:text-primary-gradientStart transition-colors"
              >
                {contact.email}
              </a>
            </div>
          </div>
        )}
        {contact.website && (
          <div className="flex items-start gap-3">
            <GlobalOutlined className="text-primary-gradientStart text-lg mt-1" />
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-500 mb-1">网站</div>
              <a
                href={contact.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-medium text-gray-900 dark:text-gray-100 hover:text-primary-gradientStart transition-colors"
              >
                {contact.website}
              </a>
            </div>
          </div>
        )}
        {contact.address && (
          <div className="flex items-start gap-3">
            <GlobalOutlined className="text-primary-gradientStart text-lg mt-1" />
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-500 mb-1">地址</div>
              <Paragraph className="text-base text-gray-900 dark:text-gray-100 mb-0">
                {contact.address}
              </Paragraph>
            </div>
          </div>
        )}
        {contact.hours && (
          <div className="flex items-start gap-3">
            <ClockCircleOutlined className="text-primary-gradientStart text-lg mt-1" />
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-500 mb-1">营业时间</div>
              <Paragraph className="text-base text-gray-900 dark:text-gray-100 mb-0">
                {contact.hours}
              </Paragraph>
            </div>
          </div>
        )}
      </Space>
    </Card>
  )
}

export default ContactCard

