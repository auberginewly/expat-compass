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

const EducationPage = () => {
  const { t } = useTranslation(['nav', 'common', 'education'])

  // 教育相关快速链接
  const educationLinks: QuickLink[] = [
    {
      title: t('education:quickLinks.links.international.title'),
      description: t('education:quickLinks.links.international.description'),
      url: 'https://www.wes-ncis.org/',
      icon: '🏫',
      category: t('education:quickLinks.links.international.category'),
    },
    {
      title: t('education:quickLinks.links.enrollment.title'),
      description: t('education:quickLinks.links.enrollment.description'),
      url: 'https://jyfw.nceduc.cn/service/index.htm',
      icon: '📚',
      category: t('education:quickLinks.links.enrollment.category'),
    },
    {
      title: t('education:quickLinks.links.bureau.title'),
      description: t('education:quickLinks.links.bureau.description'),
      url: 'https://jyfw.nceduc.cn/service/index.htm',
      icon: '📖',
      category: t('education:quickLinks.links.bureau.category'),
    },
    {
      title: t('education:quickLinks.links.chinese.title'),
      description: t('education:quickLinks.links.chinese.description'),
      url: 'https://www.chinesetest.cn/',
      icon: '📚',
      category: t('education:quickLinks.links.chinese.category'),
    },
    {
      title: t('education:quickLinks.links.moe.title'),
      description: t('education:quickLinks.links.moe.description'),
      url: 'http://www.moe.gov.cn/',
      icon: '📖',
      category: t('education:quickLinks.links.moe.category'),
    },
    {
      title: t('education:quickLinks.links.csc.title'),
      description: t('education:quickLinks.links.csc.description'),
      url: 'https://www.csc.edu.cn/',
      icon: '🌏',
      category: t('education:quickLinks.links.csc.category'),
    },
  ]

  // 最新教育资讯
  const educationNews: NewsItem[] = [
    {
      id: '1',
      title: t('education:news.items.1.title'),
      summary: t('education:news.items.1.summary'),
      publishDate: '2025-01-15',
      category: t('education:news.items.1.category'),
      isHot: true,
      imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400',
      link: 'https://mp.weixin.qq.com/s/lR5n796lnDMIDBimEYiSZQ',
    },
    {
      id: '2',
      title: t('education:news.items.2.title'),
      summary: t('education:news.items.2.summary'),
      publishDate: '2025-01-10',
      category: t('education:news.items.2.category'),
      link: 'https://jyfw.nceduc.cn/service/index.htm',
    },
    {
      id: '3',
      title: t('education:news.items.3.title'),
      summary: t('education:news.items.3.summary'),
      publishDate: '2025-01-08',
      category: t('education:news.items.3.category'),
      link: 'https://baike.baidu.com/item/%E5%8D%97%E6%98%8C%E5%9B%BD%E9%99%85%E5%AD%A6%E6%A0%A1/22442526',
    },
    {
      id: '4',
      title: t('education:news.items.4.title'),
      summary: t('education:news.items.4.summary'),
      publishDate: '2025-01-05',
      category: t('education:news.items.4.category'),
      link: 'https://mp.weixin.qq.com/s/qjMEF67l4kk9YlDLrPxDgQ',
    },
  ]

  // 常见问题
  const faqs: FAQItem[] = [
    {
      question: t('education:faq.items.1.question'),
      answer: t('education:faq.items.1.answer'),
    },
    {
      question: t('education:faq.items.2.question'),
      answer: t('education:faq.items.2.answer'),
    },
    {
      question: t('education:faq.items.3.question'),
      answer: t('education:faq.items.3.answer'),
    },
    {
      question: t('education:faq.items.4.question'),
      answer: t('education:faq.items.4.answer'),
    },
    {
      question: t('education:faq.items.5.question'),
      answer: t('education:faq.items.5.answer'),
    },
    {
      question: t('education:faq.items.6.question'),
      answer: t('education:faq.items.6.answer'),
    },
  ]

  // 教育资源 - 已移除占位内容，仅保留有实际链接的资讯

  return (
    <Flex vertical gap={32}>
      <PageHeader
        title={t('nav:education')}
        subtitle={t('education:page.subtitle')}
        description={t('education:page.description')}
      />

      {/* 快速链接 */}
      <QuickLinks title={t('education:quickLinks.title')} links={educationLinks} columns={3} />

      {/* 最新资讯 */}
      <NewsSection title={t('education:news.title')} news={educationNews} maxItems={4} />

      {/* 常见问题 */}
      <FAQSection title={t('education:faq.title')} faqs={faqs} />
    </Flex>
  )
}

export default EducationPage


