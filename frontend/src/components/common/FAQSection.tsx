import { Collapse, Typography } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'

const { Title, Paragraph } = Typography
const { Panel } = Collapse

export interface FAQItem {
  question: string
  answer: string
}

interface FAQSectionProps {
  title?: string
  faqs: FAQItem[]
}

/**
 * 常见问题组件
 * 使用折叠面板展示常见问题
 */
const FAQSection = ({ title, faqs }: FAQSectionProps) => {
  return (
    <div className="mb-12">
      {title && (
        <Title level={3} className="text-xl md:text-2xl font-bold mb-6 gradient-text">
          {title}
        </Title>
      )}
      <Collapse
        ghost
        expandIcon={({ isActive }) => (
          <QuestionCircleOutlined
            className={`text-primary-gradientStart transition-transform ${
              isActive ? 'rotate-180' : ''
            }`}
          />
        )}
        className="bg-transparent"
      >
        {faqs.map((faq, index) => (
          <Panel
            key={index}
            header={
              <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
                {faq.question}
              </span>
            }
            className="mb-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-surface-dark/60"
          >
            <Paragraph className="text-gray-600 dark:text-gray-400 leading-relaxed mb-0">
              {faq.answer}
            </Paragraph>
          </Panel>
        ))}
      </Collapse>
    </div>
  )
}

export default FAQSection

