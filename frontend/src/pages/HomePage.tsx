import { ArrowRightOutlined } from '@ant-design/icons'
import { Card, Col, Flex, Row, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { NAV_ITEMS } from '@/config/navigation'
import { Link } from 'react-router-dom'
import NewsCarousel from '@/components/NewsCarousel'

const { Title, Paragraph } = Typography

const HomePage = () => {
  const { t } = useTranslation(['home', 'common', 'nav'])

  const quickLinks = [
    { key: 'medical', description: t('home:quickLinks.medical') },
    { key: 'transport', description: t('home:quickLinks.transport') },
    { key: 'payment', description: t('home:quickLinks.payment') },
    { key: 'education', description: t('home:quickLinks.education') },
    { key: 'culture', description: t('home:quickLinks.culture') },
    { key: 'forum', description: t('home:quickLinks.forum') },
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

      <Card
        title={t('home:quickLinks.title')}
        bordered={false}
        className="rounded-2xl bg-white/80 shadow-inner dark:bg-surface-dark/60"
      >
        <Row gutter={[24, 24]}>
          {quickLinks.map((link) => {
            const nav = NAV_ITEMS.find((item) => item.key === link.key)
            return (
              <Col xs={24} md={12} lg={8} key={link.key}>
                <Link to={nav?.path ?? '/'} className="no-underline">
                  <Card
                    hoverable
                    className="h-full rounded-2xl border border-white/40 bg-white/80 px-4 py-5 shadow-sm transition-transform hover:-translate-y-1 dark:border-primary-gradientEnd/30 dark:bg-surface-dark/70"
                  >
                    <Title level={4}>{t(`nav:${link.key}`)}</Title>
                    <Paragraph type="secondary">{link.description}</Paragraph>
                    <ArrowRightOutlined />
                  </Card>
                </Link>
              </Col>
            )
          })}
        </Row>
      </Card>

      <Card
        title={t('home:announcements.title')}
        bordered={false}
        className="rounded-2xl bg-white/80 shadow-sm dark:bg-surface-dark/60"
      >
        <Flex vertical gap={16}>
          {t<string[]>('home:announcements.sample', { returnObjects: true }).map((item) => (
            <div
              key={item}
              className="flex items-start gap-3 rounded-xl border border-primary-gradientEnd/20 bg-white/80 p-4 dark:border-primary-gradientEnd/30 dark:bg-surface-dark/70"
            >
              <div className="mt-1 h-2 w-2 rounded-full bg-primary-gradientEnd" />
              <Paragraph style={{ margin: 0 }}>{item}</Paragraph>
            </div>
          ))}
        </Flex>
      </Card>
    </Flex>
  )
}

export default HomePage

