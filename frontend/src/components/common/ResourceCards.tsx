import { Card, Typography, Tag } from 'antd'
import { FileTextOutlined, VideoCameraOutlined, BookOutlined, ToolOutlined } from '@ant-design/icons'

const { Title } = Typography

export interface ResourceCard {
  title: string
  description: string
  type: 'guide' | 'video' | 'tool' | 'document'
  tags?: string[]
  link?: string
  icon?: React.ReactNode
}

interface ResourceCardsProps {
  title?: string
  resources: ResourceCard[]
  columns?: 2 | 3 | 4
}

/**
 * 资源卡片组件
 * 展示各种类型的资源（指南、视频、工具、文档等）
 */
const ResourceCards = ({ title, resources, columns = 3 }: ResourceCardsProps) => {
  const getIcon = (type: ResourceCard['type']) => {
    switch (type) {
      case 'guide':
        return <BookOutlined />
      case 'video':
        return <VideoCameraOutlined />
      case 'tool':
        return <ToolOutlined />
      case 'document':
        return <FileTextOutlined />
      default:
        return <FileTextOutlined />
    }
  }

  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <div className="mb-12">
      {title && (
        <Title level={3} className="text-xl md:text-2xl font-bold mb-6 gradient-text">
          {title}
        </Title>
      )}
      <div className={`grid grid-cols-1 ${gridCols[columns]} gap-6`}>
        {resources.map((resource, index) => (
          <Card
            key={index}
            hoverable
            className="h-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-surface-dark/60 shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-primary-gradientStart/20 to-primary-gradientEnd/20 flex items-center justify-center text-xl text-primary-gradientStart">
                  {resource.icon || getIcon(resource.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <Title
                    level={5}
                    className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1 line-clamp-2"
                  >
                    {resource.title}
                  </Title>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                    {resource.description}
                  </p>
                </div>
              </div>
              {resource.tags && resource.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-auto pt-3">
                  {resource.tags.map((tag, tagIndex) => (
                    <Tag key={tagIndex} color="blue" className="m-0">
                      {tag}
                    </Tag>
                  ))}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default ResourceCards

