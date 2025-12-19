import { Typography } from 'antd'

const { Title, Paragraph } = Typography

interface PageHeaderProps {
  title: string
  subtitle?: string
  description?: string
}

/**
 * 页面头部组件
 * 统一的页面标题、副标题和描述样式
 */
const PageHeader = ({ title, subtitle, description }: PageHeaderProps) => {
  return (
    <div className="text-center mb-12">
      {subtitle && (
        <div className="text-sm md:text-base font-semibold text-primary-gradientStart mb-2 uppercase tracking-wider">
          {subtitle}
        </div>
      )}
      <Title
        level={1}
        className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 gradient-text"
      >
        {title}
      </Title>
      <div className="flex justify-center mb-6">
        <div className="h-1.5 w-24 bg-gradient-to-r from-primary-gradientStart to-primary-gradientEnd rounded-full" />
      </div>
      {description && (
        <Paragraph className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
          {description}
        </Paragraph>
      )}
    </div>
  )
}

export default PageHeader

