import React, { useState, useEffect, useRef } from 'react'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'

export interface NewsItem {
  id: number
  url: string
  title: string
}

interface NewsCarouselProps {
  items?: NewsItem[]
}

const NewsCarousel: React.FC<NewsCarouselProps> = ({ items = [] }) => {
  // 默认示例数据
  const defaultItems: NewsItem[] = [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000&auto=format&fit=crop',
      title: '新闻标题一',
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=1000&auto=format&fit=crop',
      title: '新闻标题二',
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=1000&auto=format&fit=crop',
      title: '新闻标题三',
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1000&auto=format&fit=crop',
      title: '新闻标题四',
    },
    {
      id: 5,
      url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1000&auto=format&fit=crop',
      title: '新闻标题五',
    },
  ]

  const images = items.length > 0 ? items : defaultItems
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // 自动播放间隔 (毫秒)
  const AUTOPLAY_INTERVAL = 3000

  // 下一张
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  // 上一张
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  // 点击圆点切换
  const handleDotClick = (index: number) => {
    setCurrentIndex(index)
  }

  // 自动播放逻辑
  useEffect(() => {
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        handleNext()
      }, AUTOPLAY_INTERVAL)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isPaused, currentIndex, images.length])

  // 计算每个图片的位置样式
  const getSlideStyles = (index: number) => {
    const total = images.length

    // 计算相对距离
    let diff = (index - currentIndex + total) % total
    // 将 diff 转换为 -total/2 到 total/2 之间，以判断是左边还是右边
    if (diff > total / 2) diff -= total

    // 基础样式
    const baseStyle =
      'absolute top-0 w-[60%] h-full transition-all duration-500 ease-in-out rounded-xl shadow-2xl overflow-hidden cursor-pointer'

    // 激活状态 (中间)
    if (diff === 0) {
      return {
        className: `${baseStyle} left-1/2 -translate-x-1/2 z-30 opacity-100 scale-100 shadow-[0_20px_50px_rgba(0,0,0,0.5)]`,
        contentOpacity: 1,
      }
    }

    // 前一张 (左边)
    if (diff === -1) {
      return {
        className: `${baseStyle} left-[20%] -translate-x-1/2 z-10 opacity-60 scale-75 hover:opacity-80`,
        contentOpacity: 0,
      }
    }

    // 后一张 (右边)
    if (diff === 1) {
      return {
        className: `${baseStyle} left-[80%] -translate-x-1/2 z-10 opacity-60 scale-75 hover:opacity-80`,
        contentOpacity: 0,
      }
    }

    // 其他隐藏的图片 (堆叠在中间后面，避免动画闪烁)
    return {
      className: `${baseStyle} left-1/2 -translate-x-1/2 z-0 opacity-0 scale-50 pointer-events-none`,
      contentOpacity: 0,
    }
  }

  return (
    <div className="relative w-full h-[50vh] flex items-center justify-center">
      {/* 轮播主容器 */}
      <div
        className="relative w-full max-w-7xl h-full flex items-center justify-center"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* 左箭头 */}
        <button
          onClick={handlePrev}
          className="absolute left-2 md:left-4 z-40 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-110 backdrop-blur-sm border border-white/10 group"
          aria-label="Previous Slide"
          type="button"
        >
          <LeftOutlined className="text-xl group-hover:-translate-x-1 transition-transform" />
        </button>

        {/* 图片展示区域 */}
        <div className="relative w-full h-full max-w-6xl mx-auto">
          {images.map((img, index) => {
            const styles = getSlideStyles(index)

            // 计算是否是 Active，用于决定点击行为
            const isActive = index === currentIndex
            // 计算是否是 Prev 或 Next，用于点击快速切换
            const isPrev = index === (currentIndex - 1 + images.length) % images.length
            const isNext = index === (currentIndex + 1) % images.length

            return (
              <div
                key={img.id}
                className={styles.className}
                onClick={() => {
                  if (isPrev) handlePrev()
                  if (isNext) handleNext()
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    if (isPrev) handlePrev()
                    if (isNext) handleNext()
                  }
                }}
              >
                {/* 图片 */}
                <img src={img.url} alt={img.title} className="w-full h-full object-cover" />

                {/* 遮罩层 (让非激活图片稍微变暗，增加立体感) */}
                {!isActive && <div className="absolute inset-0 bg-black/30 transition-colors" />}

                {/* 文字内容 (只在当前图片显示) */}
                <div
                  className={`absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent transition-opacity duration-300 ${
                    isActive ? 'opacity-100 delay-200' : 'opacity-0'
                  }`}
                >
                  <h3 className="text-2xl font-bold text-white">{img.title}</h3>
                </div>
              </div>
            )
          })}
        </div>

        {/* 右箭头 */}
        <button
          onClick={handleNext}
          className="absolute right-2 md:right-4 z-40 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-110 backdrop-blur-sm border border-white/10 group"
          aria-label="Next Slide"
          type="button"
        >
          <RightOutlined className="text-xl group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* 底部指示点 */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-50">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`
              h-3 transition-all duration-300 rounded-full
              ${
                currentIndex === index
                  ? 'w-8 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                  : 'w-3 bg-gray-600 hover:bg-gray-500'
              }
            `}
            aria-label={`Go to slide ${index + 1}`}
            type="button"
          />
        ))}
      </div>
    </div>
  )
}

export default NewsCarousel

