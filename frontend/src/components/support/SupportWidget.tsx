import { CustomerServiceOutlined, RobotOutlined, SendOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Drawer, Typography, Avatar, Spin } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@/stores/appStore'
import { useAuthStore } from '@/stores/authStore'
import { apiClient } from '@/lib/apiClient'
import toast from 'react-hot-toast'
import dayjs from 'dayjs'

const { Title, Paragraph, Text } = Typography

interface ChatMessage {
  id?: number
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

const SupportWidget = () => {
  const { t } = useTranslation('common')
  const isOpen = useAppStore((state) => state.isSupportOpen)
  const toggleSupport = useAppStore((state) => state.toggleSupport)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [loadingHistory, setLoadingHistory] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  // 滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // 当消息更新时滚动到底部
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 当打开对话框时，如果有conversationId，加载历史消息
  useEffect(() => {
    if (isOpen && isAuthenticated && conversationId) {
      loadHistory()
    } else if (isOpen && isAuthenticated && !conversationId) {
      // 如果没有conversationId，尝试获取最新的会话
      loadLatestConversation()
    }
  }, [isOpen, isAuthenticated, conversationId])

  // 加载最新会话
  const loadLatestConversation = async () => {
    try {
      const response = await apiClient.get<{
        data: Array<{ id: string; title: string; updatedAt: string }>
      }>('/ai/conversations')
      
      if (response.data.data && response.data.data.length > 0) {
        const latestConversation = response.data.data[0]
        setConversationId(latestConversation.id)
        await loadHistory(latestConversation.id)
      }
    } catch (error) {
      // 如果没有会话，忽略错误
      console.debug('No conversations found')
    }
  }

  // 加载历史消息
  const loadHistory = async (convId?: string) => {
    const id = convId || conversationId
    if (!id) return

    setLoadingHistory(true)
    try {
      const response = await apiClient.get<{
        data: Array<{
          id: number
          role: string
          content: string
          createdAt: string
        }>
      }>(`/ai/conversations/${id}/messages`)
      
      if (response.data.data) {
        const historyMessages: ChatMessage[] = response.data.data.map((msg) => ({
          id: msg.id,
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
          timestamp: msg.createdAt,
        }))
        setMessages(historyMessages)
      }
    } catch (error) {
      console.error('Failed to load history:', error)
    } finally {
      setLoadingHistory(false)
    }
  }

  const handleSend = async () => {
    if (!message.trim()) {
      toast.error(t('support.emptyMessage') || '请输入消息')
      return
    }

    if (!isAuthenticated) {
      toast.error(t('support.loginRequired') || '请先登录')
      return
    }

    const userMessage = message.trim()
    const tempUserMessage: ChatMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString(),
    }

    // 立即显示用户消息
    setMessages((prev) => [...prev, tempUserMessage])
    setMessage('')
    setLoading(true)

    try {
      const response = await apiClient.post<{
        traceId: string
        timestamp: string
        success: boolean
        data: {
          conversationId: string
          message: string
          timestamp: string
        }
      }>('/ai/chat', {
        message: userMessage,
        conversationId: conversationId || undefined,
      })

      if (response.data.success && response.data.data) {
        const { conversationId: newConversationId, message: aiMessage, timestamp } = response.data.data

        // 保存conversationId
        if (!conversationId) {
          setConversationId(newConversationId)
        }

        // 添加AI回复
        const aiResponse: ChatMessage = {
          role: 'assistant',
          content: aiMessage,
          timestamp,
        }
        setMessages((prev) => [...prev, aiResponse])
      } else {
        toast.error(t('support.sendFailed') || '发送失败，请稍后重试')
        // 移除用户消息（因为发送失败）
        setMessages((prev) => prev.filter((msg) => msg !== tempUserMessage))
        setMessage(userMessage) // 恢复输入框内容
      }
    } catch (error: any) {
      // 更详细的错误处理
      if (error.response) {
        const status = error.response.status
        const errorData = error.response.data

        if (status === 401) {
          toast.error('请先登录以使用AI客服')
        } else if (status === 403) {
          toast.error('无权限访问此功能')
        } else if (errorData?.message) {
          toast.error(errorData.message)
        } else {
          toast.error(`请求失败 (${status})，请稍后重试`)
        }
      } else if (error.request) {
        toast.error('网络错误，请检查网络连接')
      } else {
        toast.error(error.message || t('support.sendFailed') || '发送失败，请稍后重试')
      }

      // 移除用户消息（因为发送失败）
      setMessages((prev) => prev.filter((msg) => msg !== tempUserMessage))
      setMessage(userMessage) // 恢复输入框内容

      if (import.meta.env.DEV) {
        console.error('AI chat error:', error)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        type="primary"
        shape="circle"
        size="large"
        icon={<CustomerServiceOutlined />}
        className="fixed bottom-6 right-6 shadow-xl z-50"
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
              <RobotOutlined className="mr-1" />
              {t('support.aiSubtitle') || 'AI智能客服'}
            </Paragraph>
          </div>
        }
      >
        <div className="flex flex-col gap-4 h-full" style={{ height: 'calc(100vh - 120px)' }}>
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto px-2"
            style={{ minHeight: 0 }}
          >
            {loadingHistory ? (
              <div className="flex justify-center items-center h-full">
                <Spin size="large" />
              </div>
            ) : (
              <>
                {messages.length === 0 && (
                  <div className="glass-surface p-4 rounded-lg mb-4">
                    <Paragraph className="mb-0">
                      🤖 {t('support.aiDescription') || '我是AI智能客服，可以为您解答关于南昌生活、交通、医疗、教育等方面的问题。'}
                    </Paragraph>
                  </div>
                )}
                <div className="space-y-4 pb-4">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex gap-3 ${
                        msg.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {msg.role === 'assistant' && (
                        <Avatar
                          icon={<RobotOutlined />}
                          className="bg-gradient-to-br from-primary-gradientStart to-primary-gradientEnd flex-shrink-0"
                        />
                      )}
                      <div
                        className={`max-w-[75%] rounded-lg px-4 py-2 ${
                          msg.role === 'user'
                            ? 'bg-primary-gradientStart text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                        }`}
                      >
                        <Paragraph className="mb-1 whitespace-pre-wrap break-words">
                          {msg.content}
                        </Paragraph>
                        <Text
                          type="secondary"
                          className="text-xs opacity-70"
                          style={{ fontSize: '10px' }}
                        >
                          {dayjs(msg.timestamp).format('HH:mm')}
                        </Text>
                      </div>
                      {msg.role === 'user' && (
                        <Avatar
                          icon={<UserOutlined />}
                          className="bg-blue-500 flex-shrink-0"
                        />
                      )}
                    </div>
                  ))}
                  {loading && (
                    <div className="flex gap-3 justify-start">
                      <Avatar
                        icon={<RobotOutlined />}
                        className="bg-gradient-to-br from-primary-gradientStart to-primary-gradientEnd flex-shrink-0"
                      />
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2">
                        <Spin size="small" />
                        <Text type="secondary" className="ml-2 text-xs">
                          AI正在思考...
                        </Text>
                      </div>
                    </div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
          <div className="flex-shrink-0 border-t pt-4">
            <TextArea
              rows={4}
              placeholder={t('support.aiPlaceholder') || '请输入您的问题...'}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onPressEnter={(e) => {
                if (e.shiftKey) return
                e.preventDefault()
                handleSend()
              }}
              disabled={loading || !isAuthenticated}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              block
              className="mt-2"
              onClick={handleSend}
              loading={loading}
              disabled={!isAuthenticated}
            >
              {t('support.aiSubmit') || '发送'}
            </Button>
            {!isAuthenticated && (
              <Paragraph type="secondary" className="text-xs text-center mt-2 mb-0">
                {t('support.loginRequired') || '请先登录以使用AI客服'}
              </Paragraph>
            )}
          </div>
        </div>
      </Drawer>
    </>
  )
}

export default SupportWidget

