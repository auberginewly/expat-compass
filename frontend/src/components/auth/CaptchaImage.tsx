import { Spin } from 'antd'
import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/apiClient'

interface CaptchaImageProps {
  onCaptchaLoad: (captchaId: string) => void
  onError?: (error: Error) => void
}

export const CaptchaImage = ({ onCaptchaLoad, onError }: CaptchaImageProps) => {
  const [loading, setLoading] = useState(false)
  const [imageSrc, setImageSrc] = useState<string | null>(null)

  const loadCaptcha = async () => {
    setLoading(true)
    try {
      const response = await apiClient.get<{ 
        traceId: string
        timestamp: string
        data: { 
          captchaId: string
          imageBase64: string 
        } 
      }>('/auth/captcha')
      
      // axios 的响应结构是 response.data 包含实际数据
      const responseData = response.data
      if (!responseData || !responseData.data) {
        console.error('验证码响应数据格式错误:', responseData)
        throw new Error('验证码响应数据格式错误')
      }
      
      const { captchaId: newId, imageBase64 } = responseData.data
      
      // 确保 imageBase64 包含 data URI 前缀
      const imageSrcWithPrefix = imageBase64.startsWith('data:image')
        ? imageBase64
        : `data:image/png;base64,${imageBase64}`
      
      setImageSrc(imageSrcWithPrefix)
      onCaptchaLoad(newId)
    } catch (error) {
      console.error('加载验证码失败:', error) // 调试用
      onError?.(error as Error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadCaptcha()
  }, [])

  return (
    <div className="flex items-center gap-2 w-[130px] h-12 shrink-0">
      {loading ? (
        <div className="w-full h-full flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-600">
          <Spin size="small" />
        </div>
      ) : (
        <>
          {imageSrc ? (
            <img
              src={imageSrc}
              alt="验证码"
              className="w-full h-full cursor-pointer rounded-lg border border-gray-200 object-contain hover:border-blue-500 dark:border-gray-600"
              onClick={loadCaptcha}
              onError={(e) => {
                console.error('图片加载失败:', e)
                onError?.(new Error('验证码图片加载失败'))
              }}
              title="点击刷新验证码"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-600 text-xs text-gray-400">
              加载中...
            </div>
          )}
        </>
      )}
    </div>
  )
}

