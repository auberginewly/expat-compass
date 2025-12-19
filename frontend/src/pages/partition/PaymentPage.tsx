import { Flex } from 'antd'
import { useTranslation } from 'react-i18next'
import {
  PageHeader,
  QuickLinks,
  NewsSection,
  FAQSection,
  ResourceCards,
  type QuickLink,
  type NewsItem,
  type FAQItem,
  type ResourceCard,
} from '@/components/common'

const PaymentPage = () => {
  const { t } = useTranslation(['nav', 'common', 'payment'])

  // 支付相关快速链接
  const paymentLinks: QuickLink[] = [
    {
      title: t('payment:quickLinks.links.alipay.title'),
      description: t('payment:quickLinks.links.alipay.description'),
      url: 'https://www.alipay.com/',
      icon: '💳',
      category: t('payment:quickLinks.links.alipay.category'),
    },
    {
      title: t('payment:quickLinks.links.wechat.title'),
      description: t('payment:quickLinks.links.wechat.description'),
      url: 'https://pay.weixin.qq.com/',
      icon: '💳',
      category: t('payment:quickLinks.links.wechat.category'),
    },
    {
      title: t('payment:quickLinks.links.boc.title'),
      description: t('payment:quickLinks.links.boc.description'),
      url: 'https://www.boc.cn/',
      icon: '🏦',
      category: t('payment:quickLinks.links.boc.category'),
    },
    {
      title: t('payment:quickLinks.links.icbc.title'),
      description: t('payment:quickLinks.links.icbc.description'),
      url: 'https://www.icbc.com.cn/',
      icon: '🏦',
      category: t('payment:quickLinks.links.icbc.category'),
    },
    {
      title: t('payment:quickLinks.links.unionpay.title'),
      description: t('payment:quickLinks.links.unionpay.description'),
      url: 'https://www.unionpay.com/',
      icon: '💳',
      category: t('payment:quickLinks.links.unionpay.category'),
    },
    {
      title: t('payment:quickLinks.links.safe.title'),
      description: t('payment:quickLinks.links.safe.description'),
      url: 'http://www.safe.gov.cn/',
      icon: '🌐',
      category: t('payment:quickLinks.links.safe.category'),
    },
  ]

  // 最新支付资讯
  const paymentNews: NewsItem[] = [
    {
      id: '1',
      title: t('payment:news.items.1.title'),
      summary: t('payment:news.items.1.summary'),
      publishDate: '2024-01-18',
      category: t('payment:news.items.1.category'),
      isHot: true,
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
    },
    {
      id: '2',
      title: t('payment:news.items.2.title'),
      summary: t('payment:news.items.2.summary'),
      publishDate: '2024-01-14',
      category: t('payment:news.items.2.category'),
    },
    {
      id: '3',
      title: t('payment:news.items.3.title'),
      summary: t('payment:news.items.3.summary'),
      publishDate: '2024-01-09',
      category: t('payment:news.items.3.category'),
    },
  ]

  // 常见问题
  const faqs: FAQItem[] = [
    {
      question: t('payment:faq.items.1.question'),
      answer: t('payment:faq.items.1.answer'),
    },
    {
      question: t('payment:faq.items.2.question'),
      answer: t('payment:faq.items.2.answer'),
    },
    {
      question: t('payment:faq.items.3.question'),
      answer: t('payment:faq.items.3.answer'),
    },
    {
      question: t('payment:faq.items.4.question'),
      answer: t('payment:faq.items.4.answer'),
    },
  ]

  // 支付资源
  const paymentResources: ResourceCard[] = [
    {
      title: t('payment:resources.items.1.title'),
      description: t('payment:resources.items.1.description'),
      type: 'guide',
      tags: t('payment:resources.items.1.tags', { returnObjects: true }) as string[],
    },
    {
      title: t('payment:resources.items.2.title'),
      description: t('payment:resources.items.2.description'),
      type: 'video',
      tags: t('payment:resources.items.2.tags', { returnObjects: true }) as string[],
    },
    {
      title: t('payment:resources.items.3.title'),
      description: t('payment:resources.items.3.description'),
      type: 'tool',
      tags: t('payment:resources.items.3.tags', { returnObjects: true }) as string[],
    },
    {
      title: t('payment:resources.items.4.title'),
      description: t('payment:resources.items.4.description'),
      type: 'document',
      tags: t('payment:resources.items.4.tags', { returnObjects: true }) as string[],
    },
  ]

  return (
    <Flex vertical gap={32}>
      <PageHeader
        title={t('nav:payment')}
        subtitle={t('payment:page.subtitle')}
        description={t('payment:page.description')}
      />

      {/* 快速链接 */}
      <QuickLinks title={t('payment:quickLinks.title')} links={paymentLinks} columns={3} />

      {/* 最新资讯 */}
      <NewsSection title={t('payment:news.title')} news={paymentNews} maxItems={3} />

      {/* 支付资源 */}
      <ResourceCards title={t('payment:resources.title')} resources={paymentResources} columns={4} />

      {/* 常见问题 */}
      <FAQSection title={t('payment:faq.title')} faqs={faqs} />
    </Flex>
  )
}

export default PaymentPage
