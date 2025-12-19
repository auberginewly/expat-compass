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

const TransportPage = () => {
  const { t } = useTranslation(['nav', 'common', 'transport'])

  // 交通相关快速链接
  const transportLinks: QuickLink[] = [
    {
      title: t('transport:quickLinks.links.metro.title'),
      description: t('transport:quickLinks.links.metro.description'),
      url: 'https://www.ncmtr.com/',
      icon: '🚇',
      category: t('transport:quickLinks.links.metro.category'),
    },
    {
      title: t('transport:quickLinks.links.bus.title'),
      description: t('transport:quickLinks.links.bus.description'),
      url: 'http://www.nc-bus.com/',
      icon: '🚌',
      category: t('transport:quickLinks.links.bus.category'),
    },
    {
      title: t('transport:quickLinks.links.didi.title'),
      description: t('transport:quickLinks.links.didi.description'),
      url: 'https://www.didiglobal.com/',
      icon: '🚗',
      category: t('transport:quickLinks.links.didi.category'),
    },
    {
      title: t('transport:quickLinks.links.amap.title'),
      description: t('transport:quickLinks.links.amap.description'),
      url: 'https://www.amap.com/',
      icon: '🗺️',
      category: t('transport:quickLinks.links.amap.category'),
    },
    {
      title: t('transport:quickLinks.links.railway.title'),
      description: t('transport:quickLinks.links.railway.description'),
      url: 'https://www.12306.cn/',
      icon: '🚄',
      category: t('transport:quickLinks.links.railway.category'),
    },
    {
      title: t('transport:quickLinks.links.airport.title'),
      description: t('transport:quickLinks.links.airport.description'),
      url: 'http://www.jxairport.com/',
      icon: '✈️',
      category: t('transport:quickLinks.links.airport.category'),
    },
  ]

  // 最新交通资讯
  const transportNews: NewsItem[] = [
    {
      id: '1',
      title: t('transport:news.items.1.title'),
      summary: t('transport:news.items.1.summary'),
      publishDate: '2025-06-28',
      category: t('transport:news.items.1.category'),
      isHot: true,
      imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400',
      link: 'https://www.thepaper.cn/newsDetail_forward_31039683',
    },
    {
      id: '2',
      title: t('transport:news.items.2.title'),
      summary: t('transport:news.items.2.summary'),
      publishDate: '2025-01-15',
      category: t('transport:news.items.2.category'),
      link: 'https://www.ncmtr.com/topic_detail_4/1513.html',
    },
    {
      id: '3',
      title: t('transport:news.items.3.title'),
      summary: t('transport:news.items.3.summary'),
      publishDate: '2025-11-27',
      category: t('transport:news.items.3.category'),
      link: 'https://nc.jxnews.com.cn/system/2025/11/27/021038944.shtml',
    },
    {
      id: '4',
      title: t('transport:news.items.4.title'),
      summary: t('transport:news.items.4.summary'),
      publishDate: '2025-01-10',
      category: t('transport:news.items.4.category'),
      link: 'https://wanderchina.guide/zh/article/high-speed-rail-ticket-buying-guide',
    },
    {
      id: '5',
      title: t('transport:news.items.5.title'),
      summary: t('transport:news.items.5.summary'),
      publishDate: '2025-06-30',
      category: t('transport:news.items.5.category'),
      link: 'https://www.dahepiao.com/lvyounews1/20250630518678.html',
    },
  ]

  // 常见问题
  const faqs: FAQItem[] = [
    {
      question: t('transport:faq.items.1.question'),
      answer: t('transport:faq.items.1.answer'),
    },
    {
      question: t('transport:faq.items.2.question'),
      answer: t('transport:faq.items.2.answer'),
    },
    {
      question: t('transport:faq.items.3.question'),
      answer: t('transport:faq.items.3.answer'),
    },
    {
      question: t('transport:faq.items.4.question'),
      answer: t('transport:faq.items.4.answer'),
    },
    {
      question: t('transport:faq.items.5.question'),
      answer: t('transport:faq.items.5.answer'),
    },
    {
      question: t('transport:faq.items.6.question'),
      answer: t('transport:faq.items.6.answer'),
    },
  ]

  // 交通资源 - 已移除占位内容，仅保留有实际链接的资讯

  return (
    <Flex vertical gap={32}>
      <PageHeader
        title={t('nav:transport')}
        subtitle={t('transport:page.subtitle')}
        description={t('transport:page.description')}
      />

      {/* 快速链接 */}
      <QuickLinks title={t('transport:quickLinks.title')} links={transportLinks} columns={3} />

      {/* 最新资讯 */}
      <NewsSection title={t('transport:news.title')} news={transportNews} maxItems={5} />

      {/* 常见问题 */}
      <FAQSection title={t('transport:faq.title')} faqs={faqs} />
    </Flex>
  )
}

export default TransportPage
