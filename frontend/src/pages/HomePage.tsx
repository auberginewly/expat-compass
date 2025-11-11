import { ArrowRightOutlined } from '@ant-design/icons'
import { Button, Card, Col, Flex, Row, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { NAV_ITEMS } from '@/config/navigation'
import { Link } from 'react-router-dom'

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
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary-gradientStart/90 via-primary-gradientEnd/80 to-sky-500/70 p-10 text-white shadow-lg">
        <Title level={2} style={{ color: 'white', marginBottom: 16 }}>
          {t('home:hero.title')}
        </Title>
        <Paragraph style={{ fontSize: 16, maxWidth: 520, color: 'rgba(255,255,255,0.85)' }}>
          {t('home:hero.subtitle')}
        </Paragraph>
        <Flex gap={16} wrap>
          <Button type="primary" size="large" shape="round" ghost>
            {t('home:hero.ctaPrimary')}
          </Button>
          <Button size="large" shape="round" type="default">
            {t('home:hero.ctaSecondary')}
          </Button>
        </Flex>
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

