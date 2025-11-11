import {
  CustomerServiceOutlined,
  MessageOutlined,
  RobotOutlined,
  SendOutlined,
} from '@ant-design/icons'
import { Button, Drawer, Form, Input, Tabs, Typography } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@/stores/appStore'

const { Title, Paragraph } = Typography

const SupportWidget = () => {
  const { t } = useTranslation('common')
  const isOpen = useAppStore((state) => state.isSupportOpen)
  const toggleSupport = useAppStore((state) => state.toggleSupport)

  return (
    <>
      <Button
        type="primary"
        shape="circle"
        size="large"
        icon={<CustomerServiceOutlined />}
        className="fixed bottom-6 right-6 shadow-xl"
        onClick={() => toggleSupport(true)}
      />
      <Drawer
        open={isOpen}
        width={420}
        onClose={() => toggleSupport(false)}
        title={
          <div>
            <Title level={4} style={{ marginBottom: 4 }}>
              {t('support.title')}
            </Title>
            <Paragraph type="secondary" style={{ margin: 0 }}>
              {t('support.subtitle')}
            </Paragraph>
          </div>
        }
      >
        <Tabs
          defaultActiveKey="ai"
          items={[
            {
              key: 'ai',
              label: (
                <span>
                  <RobotOutlined className="mr-1" />
                  AI
                </span>
              ),
              children: (
                <div className="flex flex-col gap-4">
                  <div className="glass-surface p-4">
                    <Paragraph>
                      🤖 {t('support.subtitle')}
                    </Paragraph>
                  </div>
                  <TextArea rows={4} placeholder={t('support.aiPlaceholder') ?? ''} />
                  <Button type="primary" icon={<SendOutlined />} block>
                    {t('support.aiSubmit')}
                  </Button>
                </div>
              ),
            },
            {
              key: 'human',
              label: (
                <span>
                  <MessageOutlined className="mr-1" />
                  Human
                </span>
              ),
              children: (
                <Form layout="vertical" className="mt-4" onFinish={() => toggleSupport(false)}>
                  <Form.Item label={t('support.formName')} name="name" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label={t('support.formEmail')}
                    name="email"
                    rules={[{ type: 'email', required: true }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label={t('support.formQuestion')}
                    name="question"
                    rules={[{ required: true, min: 10 }]}
                  >
                    <TextArea rows={4} />
                  </Form.Item>
                  <Button type="primary" htmlType="submit" block icon={<SendOutlined />}>
                    {t('support.formSubmit')}
                  </Button>
                </Form>
              ),
            },
          ]}
        />
      </Drawer>
    </>
  )
}

export default SupportWidget

