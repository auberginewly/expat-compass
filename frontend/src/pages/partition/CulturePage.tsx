import { Flex } from 'antd'
import { useTranslation } from 'react-i18next'
import {
  PageHeader,
  QuickLinks,
  NewsSection,
  FAQSection,
  type QuickLink,
  type NewsItem,
  type FAQItem,
} from '@/components/common'

const CulturePage = () => {
  const { t } = useTranslation(['nav', 'common', 'culture'])

  // 文化相关快速链接
  const cultureLinks: QuickLink[] = [
    {
      title: t('culture:quickLinks.links.tengwangge.title'),
      description: t('culture:quickLinks.links.tengwangge.description'),
      url: 'https://www.tengwangge.com/',
      icon: '🏯',
      category: t('culture:quickLinks.links.tengwangge.category'),
    },
    {
      title: t('culture:quickLinks.links.museum81.title'),
      description: t('culture:quickLinks.links.museum81.description'),
      url: 'http://www.81museum.cn/',
      icon: '🏛️',
      category: t('culture:quickLinks.links.museum81.category'),
    },
    {
      title: t('culture:quickLinks.links.culturalCenter.title'),
      description: t('culture:quickLinks.links.culturalCenter.description'),
      url: 'http://www.ncwhg.com/',
      icon: '🎭',
      category: t('culture:quickLinks.links.culturalCenter.category'),
    },
    {
      title: t('culture:quickLinks.links.provincialMuseum.title'),
      description: t('culture:quickLinks.links.provincialMuseum.description'),
      url: 'http://www.jxmuseum.cn/',
      icon: '🏛️',
      category: t('culture:quickLinks.links.provincialMuseum.category'),
    },
    {
      title: t('culture:quickLinks.links.food.title'),
      description: t('culture:quickLinks.links.food.description'),
      url: 'https://www.dianping.com/nanchang',
      icon: '🍜',
      category: t('culture:quickLinks.links.food.category'),
    },
    {
      title: t('culture:quickLinks.links.weekend.title'),
      description: t('culture:quickLinks.links.weekend.description'),
      url: 'https://www.meituan.com/',
      icon: '🎪',
      category: t('culture:quickLinks.links.weekend.category'),
    },
  ]

  // 最新文化资讯
  const cultureNews: NewsItem[] = [
    {
      id: '1',
      title: t('culture:news.items.1.title'),
      summary: t('culture:news.items.1.summary'),
      publishDate: '2024-12-17',
      category: t('culture:news.items.1.category'),
      isHot: true,
      imageUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400',
      link: 'https://new.qq.com/rain/a/20250320A087IT00',
    },
    {
      id: '2',
      title: t('culture:news.items.2.title'),
      summary: t('culture:news.items.2.summary'),
      publishDate: '2025-11-05',
      category: t('culture:news.items.2.category'),
      link: 'http://jx.people.com.cn/n2/2025/1105/c186330-41401779.html',
    },
    {
      id: '3',
      title: t('culture:news.items.3.title'),
      summary: t('culture:news.items.3.summary'),
      publishDate: '2025-03-20',
      category: t('culture:news.items.3.category'),
      link: 'https://metaso.cn/h5-share?cb=https://m.sohu.com/a/862074559_121106994/?pvid=000115_3w_a&sessionId=',
    },
    {
      id: '4',
      title: t('culture:news.items.4.title'),
      summary: t('culture:news.items.4.summary'),
      publishDate: '2025-02-21',
      category: t('culture:news.items.4.category'),
      link: 'https://metaso.cn/h5-share?cb=https://finance.sina.cn/2025-02-21/detail-inemhatv2586294.d.html?from=wap&sessionId=',
    },
    {
      id: '5',
      title: t('culture:news.items.5.title'),
      summary: t('culture:news.items.5.summary'),
      publishDate: '2025-03-20',
      category: t('culture:news.items.5.category'),
      link: 'https://metaso.cn/h5-share?cb=https://m.thepaper.cn/newsDetail_forward_30735994&sessionId=',
    },
  ]

  // 常见问题
  const faqs: FAQItem[] = [
    {
      question: t('culture:faq.items.1.question'),
      answer: t('culture:faq.items.1.answer'),
    },
    {
      question: t('culture:faq.items.2.question'),
      answer: t('culture:faq.items.2.answer'),
    },
    {
      question: t('culture:faq.items.3.question'),
      answer: t('culture:faq.items.3.answer'),
    },
    {
      question: t('culture:faq.items.4.question'),
      answer: t('culture:faq.items.4.answer'),
    },
    {
      question: t('culture:faq.items.5.question'),
      answer: t('culture:faq.items.5.answer'),
    },
    {
      question: t('culture:faq.items.6.question'),
      answer: t('culture:faq.items.6.answer'),
    },
  ]

  // 文化资源 - 已移除占位内容，仅保留有实际链接的资讯

  return (
    <Flex vertical gap={32}>
      <PageHeader
        title={t('nav:culture')}
        subtitle={t('culture:page.subtitle')}
        description={t('culture:page.description')}
      />

      {/* 快速链接 */}
      <QuickLinks title={t('culture:quickLinks.title')} links={cultureLinks} columns={3} />

      {/* 最新资讯 */}
      <NewsSection title={t('culture:news.title')} news={cultureNews} maxItems={5} />

      {/* 常见问题 */}
      <FAQSection title={t('culture:faq.title')} faqs={faqs} />
    </Flex>
  )
}

export default CulturePage


