import { Card, Typography, Tag } from 'antd'
import { CalendarOutlined, FireOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

const { Title, Paragraph } = Typography

export interface NewsItem {
  id: string
  title: string
  summary?: string
  publishDate: string
  category?: string
  isHot?: boolean
  imageUrl?: string
  link?: string
}

interface NewsSectionProps {
  title?: string
  news: NewsItem[]
  maxItems?: number
  showImage?: boolean
}

/**
 * 最新资讯组件
 * 展示最新资讯列表，支持分类标签和热门标记
 */
const NewsSection = ({ title, news, maxItems = 5, showImage = true }: NewsSectionProps) => {
  const displayNews = news.slice(0, maxItems)

  return (
    <div className="mb-12">
      {title && (
        <div className="mb-6">
          <Title level={3} className="text-xl md:text-2xl font-bold mb-0 gradient-text">
            {title}
          </Title>
        </div>
      )}
      <div className="space-y-4">
        {displayNews.map((item) => {
          // 如果有外部链接，使用 <a> 标签在新标签页打开
          if (item.link && item.link.startsWith('http')) {
            return (
              <a
                key={item.id}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block no-underline group"
              >
                <Card
                  hoverable
                  className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-surface-dark/60 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="flex gap-4">
                    {showImage && item.imageUrl && (
                      <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 mb-2">
                        <Title
                          level={5}
                          className="flex-1 text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-0 group-hover:text-primary-gradientStart transition-colors line-clamp-2"
                        >
                          {item.title}
                        </Title>
                        {item.isHot && (
                          <Tag
                            icon={<FireOutlined />}
                            color="error"
                            className="flex-shrink-0"
                          >
                            热门
                          </Tag>
                        )}
                      </div>
                      {item.summary && (
                        <Paragraph
                          className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2"
                          ellipsis
                        >
                          {item.summary}
                        </Paragraph>
                      )}
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                        <span className="flex items-center gap-1">
                          <CalendarOutlined />
                          {dayjs(item.publishDate).format('YYYY-MM-DD')}
                        </span>
                        {item.category && (
                          <Tag color="blue" className="m-0">
                            {item.category}
                          </Tag>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </a>
            )
          }
          // 如果没有链接或链接无效，使用 div 包装（不可点击）
          return (
            <div key={item.id} className="block group">
              <Card
                className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-surface-dark/60 shadow-sm"
              >
                <div className="flex gap-4">
                  {showImage && item.imageUrl && (
                    <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 mb-2">
                      <Title
                        level={5}
                        className="flex-1 text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-0 line-clamp-2"
                      >
                        {item.title}
                      </Title>
                      {item.isHot && (
                        <Tag
                          icon={<FireOutlined />}
                          color="error"
                          className="flex-shrink-0"
                        >
                          热门
                        </Tag>
                      )}
                    </div>
                    {item.summary && (
                      <Paragraph
                        className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2"
                        ellipsis
                      >
                        {item.summary}
                      </Paragraph>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                      <span className="flex items-center gap-1">
                        <CalendarOutlined />
                        {dayjs(item.publishDate).format('YYYY-MM-DD')}
                      </span>
                      {item.category && (
                        <Tag color="blue" className="m-0">
                          {item.category}
                        </Tag>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default NewsSection

