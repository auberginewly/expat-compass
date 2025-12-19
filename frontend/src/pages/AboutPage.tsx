import { ArrowLeftOutlined, TeamOutlined, BulbOutlined, HeartOutlined, GlobalOutlined } from '@ant-design/icons'
import { Card, Typography, Divider, Space, Avatar, Row, Col } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const { Title, Paragraph, Text } = Typography

const AboutPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation(['about', 'common'])

  // 从 location.state 获取来源页面，如果没有则默认返回首页
  const from = (location.state as { from?: string })?.from || '/'

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white via-blue-50/30 to-white dark:from-surface-dark dark:via-blue-900/10 dark:to-surface-dark">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* 返回按钮 */}
        <div className="mb-6">
          <button
            onClick={() => navigate(from)}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-gradientStart transition-colors"
          >
            <ArrowLeftOutlined />
            <span>{t('common:actions.back')}</span>
          </button>
        </div>

        {/* 项目标题 */}
        <div className="text-center mb-12">
          <Title level={1} className="mb-4 gradient-text">
            {t('about:title')}
          </Title>
          <Paragraph className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {t('about:subtitle')}
          </Paragraph>
        </div>

        {/* 项目背景 */}
        <Card className="mb-8 bg-white/80 dark:bg-surface-dark/60 backdrop-blur-md shadow-lg">
          <Title level={2} className="mb-4 flex items-center gap-2">
            <BulbOutlined className="text-primary-gradientStart" />
            {t('about:sections.background.title')}
          </Title>
          <Paragraph className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
            {t('about:sections.background.content')}
          </Paragraph>
        </Card>

        {/* 项目内容 */}
        <Card className="mb-8 bg-white/80 dark:bg-surface-dark/60 backdrop-blur-md shadow-lg">
          <Title level={2} className="mb-4 flex items-center gap-2">
            <GlobalOutlined className="text-primary-gradientStart" />
            {t('about:sections.content.title')}
          </Title>
          <Paragraph className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
            {t('about:sections.content.description')}
          </Paragraph>
          <Divider />
          <Title level={4} className="mb-3">{t('about:sections.content.website.title')}</Title>
          <Paragraph className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {t('about:sections.content.website.description')}
          </Paragraph>
        </Card>

        {/* 社会价值 */}
        <Card className="mb-8 bg-white/80 dark:bg-surface-dark/60 backdrop-blur-md shadow-lg">
          <Title level={2} className="mb-4 flex items-center gap-2">
            <HeartOutlined className="text-primary-gradientStart" />
            {t('about:sections.value.title')}
          </Title>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <div className="p-4 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg">
                <Title level={4} className="mb-2">{t('about:sections.value.items.0.title')}</Title>
                <Paragraph className="text-gray-700 dark:text-gray-300 text-sm">
                  {t('about:sections.value.items.0.content')}
                </Paragraph>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className="p-4 bg-green-50/50 dark:bg-green-900/20 rounded-lg">
                <Title level={4} className="mb-2">{t('about:sections.value.items.1.title')}</Title>
                <Paragraph className="text-gray-700 dark:text-gray-300 text-sm">
                  {t('about:sections.value.items.1.content')}
                </Paragraph>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className="p-4 bg-purple-50/50 dark:bg-purple-900/20 rounded-lg">
                <Title level={4} className="mb-2">{t('about:sections.value.items.2.title')}</Title>
                <Paragraph className="text-gray-700 dark:text-gray-300 text-sm">
                  {t('about:sections.value.items.2.content')}
                </Paragraph>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className="p-4 bg-orange-50/50 dark:bg-orange-900/20 rounded-lg">
                <Title level={4} className="mb-2">{t('about:sections.value.items.3.title')}</Title>
                <Paragraph className="text-gray-700 dark:text-gray-300 text-sm">
                  {t('about:sections.value.items.3.content')}
                </Paragraph>
              </div>
            </Col>
          </Row>
        </Card>

        {/* 创新意义 */}
        <Card className="mb-8 bg-white/80 dark:bg-surface-dark/60 backdrop-blur-md shadow-lg">
          <Title level={2} className="mb-4 flex items-center gap-2">
            <BulbOutlined className="text-primary-gradientStart" />
            {t('about:sections.innovation.title')}
          </Title>
          <Space direction="vertical" size="large" className="w-full">
            <div>
              <Title level={4} className="mb-2">{t('about:sections.innovation.items.0.title')}</Title>
              <Paragraph className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {t('about:sections.innovation.items.0.content')}
              </Paragraph>
            </div>
            <Divider />
            <div>
              <Title level={4} className="mb-2">{t('about:sections.innovation.items.1.title')}</Title>
              <Paragraph className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {t('about:sections.innovation.items.1.content')}
              </Paragraph>
            </div>
          </Space>
        </Card>

        {/* 团队成员 */}
        <Card className="mb-8 bg-white/80 dark:bg-surface-dark/60 backdrop-blur-md shadow-lg">
          <Title level={2} className="mb-6 flex items-center gap-2">
            <TeamOutlined className="text-primary-gradientStart" />
            {t('about:sections.team.title')}
          </Title>
          <Row gutter={[16, 16]}>
            {(t('about:sections.team.members', { returnObjects: true }) as Array<{ name: string; role: string; college: string }>).map((member, index) => (
              <Col xs={24} sm={12} md={8} lg={6} key={index}>
                <div className="text-center p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-lg">
                  <Avatar size={64} className="mb-3 bg-primary-gradientStart">
                    {member.name.charAt(0)}
                  </Avatar>
                  <div>
                    <Text strong className="block mb-1">{member.name}</Text>
                    <Text type="secondary" className="text-xs block mb-1">{member.role}</Text>
                    <Text type="secondary" className="text-xs">{member.college}</Text>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Card>

        {/* 指导教师 */}
        <Card className="bg-white/80 dark:bg-surface-dark/60 backdrop-blur-md shadow-lg">
          <Title level={2} className="mb-6">{t('about:sections.advisors.title')}</Title>
          <Row gutter={[16, 16]}>
            {(t('about:sections.advisors.list', { returnObjects: true }) as Array<{ name: string; title: string; college: string }>).map((advisor, index) => (
              <Col xs={24} sm={12} key={index}>
                <div className="p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-lg">
                  <Text strong className="text-lg block mb-2">{advisor.name}</Text>
                  <Text type="secondary" className="block mb-1">{advisor.title}</Text>
                  <Text type="secondary" className="text-sm">{advisor.college}</Text>
                </div>
              </Col>
            ))}
          </Row>
        </Card>
      </div>
    </div>
  )
}

export default AboutPage

