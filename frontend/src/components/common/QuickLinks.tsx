import { Card, Typography } from 'antd'
import { LinkOutlined } from '@ant-design/icons'

const { Title } = Typography

export interface QuickLink {
  title: string
  description?: string
  url: string
  icon?: string
  category?: string
}

interface QuickLinksProps {
  title?: string
  links: QuickLink[]
  columns?: 2 | 3 | 4
}

/**
 * 快速链接组件
 * 展示常用网站导航链接，支持分类和图标
 */
const QuickLinks = ({ title, links, columns = 3 }: QuickLinksProps) => {
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
      <div className={`grid grid-cols-1 ${gridCols[columns]} gap-4`}>
        {links.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group no-underline"
          >
            <Card
              hoverable
              className="h-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-surface-dark/60 shadow-sm hover:shadow-lg transition-all duration-300 group-hover:border-primary-gradientStart"
            >
              <div className="flex items-start gap-4">
                {link.icon && (
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-primary-gradientStart/10 to-primary-gradientEnd/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    {link.icon}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Title
                      level={5}
                      className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-0 group-hover:text-primary-gradientStart transition-colors"
                    >
                      {link.title}
                    </Title>
                    <LinkOutlined className="text-xs text-gray-400 group-hover:text-primary-gradientStart transition-colors" />
                  </div>
                  {link.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {link.description}
                    </p>
                  )}
                  {link.category && (
                    <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-primary-gradientStart/10 text-primary-gradientStart">
                      {link.category}
                    </span>
                  )}
                </div>
              </div>
            </Card>
          </a>
        ))}
      </div>
    </div>
  )
}

export default QuickLinks

