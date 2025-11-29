import { ArrowRightOutlined } from '@ant-design/icons'
import { Card, Flex, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { NAV_ITEMS } from '@/config/navigation'
import { Link } from 'react-router-dom'
import NewsCarousel from '@/components/NewsCarousel'

const { Title, Paragraph } = Typography

const HomePage = () => {
  const { t } = useTranslation(['home', 'common', 'nav'])

  const services = [
    {
      key: 'medical',
      title: t('home:quickLinks.medical'),
      description: t('home:quickLinks.medicalDesc'),
      imageUrl: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?q=80&w=800&auto=format&fit=crop',
    },
    {
      key: 'transport',
      title: t('home:quickLinks.transport'),
      description: t('home:quickLinks.transportDesc'),
      imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800&auto=format&fit=crop',
    },
    {
      key: 'payment',
      title: t('home:quickLinks.payment'),
      description: t('home:quickLinks.paymentDesc'),
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
    },
    {
      key: 'education',
      title: t('home:quickLinks.education'),
      description: t('home:quickLinks.educationDesc'),
      imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop',
    },
    {
      key: 'culture',
      title: t('home:quickLinks.culture'),
      description: t('home:quickLinks.cultureDesc'),
      imageUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=800&auto=format&fit=crop',
    },
    {
      key: 'forum',
      title: t('home:quickLinks.forum'),
      description: t('home:quickLinks.forumDesc'),
      imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=800&auto=format&fit=crop',
    },
  ]

  return (
    <Flex vertical gap={32}>
      {/* 新闻轮播 */}
      <NewsCarousel />

      {/* 网站介绍 */}
      <div className="text-center">
        <Title level={1} className="mb-4 gradient-text">
          {t('home:intro.title')}
        </Title>
        <Paragraph className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
          {t('home:intro.description')}
        </Paragraph>
      </div>

      {/* 高频服务 */}
      <div className="w-full">
        {/* 标题区域 */}
        <div className="text-center mb-12">
          <Title level={2} className="mb-4 gradient-text">
            {t('home:quickLinks.title')}
          </Title>
          <div className="flex justify-center mb-4">
            <div className="h-1.5 w-24 bg-gradient-to-r from-primary-gradientStart to-primary-gradientEnd rounded-full" />
          </div>
          <Paragraph className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('home:quickLinks.subtitle')}
          </Paragraph>
        </div>

        {/* 服务卡片列表 */}
        <div className="flex flex-col gap-6">
          {services.map((service, index) => {
            const isEven = index % 2 !== 0
            const nav = NAV_ITEMS.find((item) => item.key === service.key)

            return (
              <Link
                key={service.key}
                to={nav?.path ?? '/'}
                className="no-underline group"
              >
                <div
                  className={`
                    flex flex-col md:flex-row items-center
                    bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl
                    transition-all duration-500 border border-gray-100 dark:border-primary-gradientEnd/20
                    dark:bg-surface-dark/60
                    ${isEven ? 'md:flex-row-reverse' : ''}
                  `}
                >
                  {/* 文字内容区域 */}
                  <div className="flex-1 p-6 md:p-8 lg:p-10 w-full">
                    <Title
                      level={3}
                      className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-primary-gradientStart transition-colors mb-4"
                    >
                      {service.title}
                    </Title>
                    {/* 装饰短横线 */}
                    <div className="h-1 w-12 bg-gray-200 dark:bg-gray-700 group-hover:bg-gradient-to-r group-hover:from-primary-gradientStart group-hover:to-primary-gradientEnd group-hover:w-20 transition-all duration-300 mb-4 rounded-full" />
                    <Paragraph className="text-gray-600 dark:text-gray-400 text-sm md:text-base leading-relaxed mb-6">
                      {service.description}
                    </Paragraph>
                    <div className="flex items-center text-primary-gradientStart font-semibold text-base group-hover:text-primary-gradientEnd transition-colors">
                      立即查看
                      <ArrowRightOutlined className="ml-2 transform group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>

                  {/* 图片区域 */}
                  <div className="flex-1 w-full h-48 md:h-64 md:w-full md:min-h-[280px] relative overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <img
                      src={service.imageUrl}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = `https://via.placeholder.com/800x600/4C6CF7/ffffff?text=${encodeURIComponent(service.title)}`
                      }}
                    />
                    {/* 悬停时的遮罩效果 */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* <Card
        title={t('home:announcements.title')}
        bordered={false}
        className="rounded-2xl bg-white/80 shadow-sm dark:bg-surface-dark/60"
      >
        <Flex vertical gap={16}>
          {(t('home:announcements.sample', { returnObjects: true }) as string[]).map((item) => (
            <div
              key={item}
              className="flex items-start gap-3 rounded-xl border border-primary-gradientEnd/20 bg-white/80 p-4 dark:border-primary-gradientEnd/30 dark:bg-surface-dark/70"
            >
              <div className="mt-1 h-2 w-2 rounded-full bg-primary-gradientEnd" />
              <Paragraph style={{ margin: 0 }}>{item}</Paragraph>
            </div>
          ))}
        </Flex>
      </Card> */}
    </Flex>
  )
}

export default HomePage

