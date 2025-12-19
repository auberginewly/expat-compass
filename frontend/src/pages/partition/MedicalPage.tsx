import { Flex } from 'antd'
import { useTranslation } from 'react-i18next'
import {
  PageHeader,
  QuickLinks,
  NewsSection,
  FAQSection,
  ResourceCards,
  ContactCard,
  type QuickLink,
  type NewsItem,
  type FAQItem,
  type ResourceCard,
  type ContactInfo,
} from '@/components/common'

const MedicalPage = () => {
  const { t } = useTranslation(['nav', 'common', 'medical'])

  // 医疗相关快速链接
  const medicalLinks: QuickLink[] = [
    {
      title: t('medical:quickLinks.links.hospital1.title'),
      description: t('medical:quickLinks.links.hospital1.description'),
      url: 'https://www.cdyfy.com/',
      icon: '🏥',
      category: t('medical:quickLinks.links.hospital1.category'),
    },
    {
      title: t('medical:quickLinks.links.hospital2.title'),
      description: t('medical:quickLinks.links.hospital2.description'),
      url: 'https://www.ncsdyyy.com/',
      icon: '🏥',
      category: t('medical:quickLinks.links.hospital2.category'),
    },
    {
      title: t('medical:quickLinks.links.hospital3.title'),
      description: t('medical:quickLinks.links.hospital3.description'),
      url: 'http://www.jxsrmyy.cn/',
      icon: '🏥',
      category: t('medical:quickLinks.links.hospital3.category'),
    },
    {
      title: t('medical:quickLinks.links.insurance.title'),
      description: t('medical:quickLinks.links.insurance.description'),
      url: 'http://ybj.nc.gov.cn/',
      icon: '💳',
      category: t('medical:quickLinks.links.insurance.category'),
    },
    {
      title: t('medical:quickLinks.links.emergency.title'),
      description: t('medical:quickLinks.links.emergency.description'),
      url: 'tel:120',
      icon: '🚑',
      category: t('medical:quickLinks.links.emergency.category'),
    },
    {
      title: t('medical:quickLinks.links.vaccine.title'),
      description: t('medical:quickLinks.links.vaccine.description'),
      url: 'https://www.jiangxi.gov.cn/',
      icon: '💉',
      category: t('medical:quickLinks.links.vaccine.category'),
    },
  ]

  // 最新医疗资讯
  const medicalNews: NewsItem[] = [
    {
      id: '1',
      title: t('medical:news.items.1.title'),
      summary: t('medical:news.items.1.summary'),
      publishDate: '2024-01-15',
      category: t('medical:news.items.1.category'),
      isHot: true,
      imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400',
    },
    {
      id: '2',
      title: t('medical:news.items.2.title'),
      summary: t('medical:news.items.2.summary'),
      publishDate: '2024-01-10',
      category: t('medical:news.items.2.category'),
    },
    {
      id: '3',
      title: t('medical:news.items.3.title'),
      summary: t('medical:news.items.3.summary'),
      publishDate: '2024-01-05',
      category: t('medical:news.items.3.category'),
    },
  ]

  // 常见问题
  const faqs: FAQItem[] = [
    {
      question: t('medical:faq.items.1.question'),
      answer: t('medical:faq.items.1.answer'),
    },
    {
      question: t('medical:faq.items.2.question'),
      answer: t('medical:faq.items.2.answer'),
    },
    {
      question: t('medical:faq.items.3.question'),
      answer: t('medical:faq.items.3.answer'),
    },
    {
      question: t('medical:faq.items.4.question'),
      answer: t('medical:faq.items.4.answer'),
    },
  ]

  // 医疗资源
  const medicalResources: ResourceCard[] = [
    {
      title: t('medical:resources.items.1.title'),
      description: t('medical:resources.items.1.description'),
      type: 'guide',
      tags: t('medical:resources.items.1.tags', { returnObjects: true }) as string[],
    },
    {
      title: t('medical:resources.items.2.title'),
      description: t('medical:resources.items.2.description'),
      type: 'video',
      tags: t('medical:resources.items.2.tags', { returnObjects: true }) as string[],
    },
    {
      title: t('medical:resources.items.3.title'),
      description: t('medical:resources.items.3.description'),
      type: 'tool',
      tags: t('medical:resources.items.3.tags', { returnObjects: true }) as string[],
    },
    {
      title: t('medical:resources.items.4.title'),
      description: t('medical:resources.items.4.description'),
      type: 'document',
      tags: t('medical:resources.items.4.tags', { returnObjects: true }) as string[],
    },
  ]

  // 联系信息
  const contactInfo: ContactInfo = {
    phone: t('medical:contact.phone'),
    emergency: t('medical:contact.emergency'),
    email: t('medical:contact.email'),
    website: t('medical:contact.website'),
    address: t('medical:contact.address'),
    hours: t('medical:contact.hours'),
  }

  return (
    <Flex vertical gap={32}>
      <PageHeader
        title={t('nav:medical')}
        subtitle={t('medical:page.subtitle')}
        description={t('medical:page.description')}
      />

      {/* 快速链接 */}
      <QuickLinks title={t('medical:quickLinks.title')} links={medicalLinks} columns={3} />

      {/* 最新资讯 */}
      <NewsSection title={t('medical:news.title')} news={medicalNews} maxItems={3} />

      {/* 医疗资源 */}
      <ResourceCards title={t('medical:resources.title')} resources={medicalResources} columns={4} />

      <Flex gap={24} className="flex-col lg:flex-row">
        {/* 常见问题 */}
        <div className="flex-1">
          <FAQSection title={t('medical:faq.title')} faqs={faqs} />
        </div>

        {/* 联系信息 */}
        <div className="w-full lg:w-96">
          <ContactCard title={t('medical:contact.title')} contact={contactInfo} />
        </div>
      </Flex>
    </Flex>
  )
}

export default MedicalPage

