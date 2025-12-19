import React, { useState, useEffect, useMemo } from 'react'
import {
  SearchOutlined,
  EditOutlined,
  HeartOutlined,
  HeartFilled,
  MessageOutlined,
  MoreOutlined,
  ArrowLeftOutlined,
  ClockCircleOutlined,
  FireOutlined,
  SendOutlined,
  UserOutlined,
  TagOutlined,
  PlusOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import {
  Button,
  Card,
  Input,
  Typography,
  Modal,
  Form,
  Space,
  Avatar,
  Tag,
  Empty,
  Pagination,
  Upload,
  Select,
  Image,
} from 'antd'
import type { UploadFile, UploadProps } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/stores/authStore'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { apiClient } from '@/lib/apiClient'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

const { Title, Paragraph, Text } = Typography
const { TextArea } = Input
const { Option } = Select

interface Author {
  name: string
  avatar: string
  badge: string
  userId?: number
}

interface Comment {
  id: number
  author: {
    id: number
    displayName: string
    avatarUrl?: string
  }
  content: string
  createdAt: string
  parentId?: number | null
  replies?: Comment[]
}

interface Post {
  id: number
  author: Author
  time: string
  timestamp: number
  title: string
  content: string
  tags: string[]
  stats: { likes: number; comments: number; views: number }
  commentsList: Comment[]
  isHot: boolean
  liked: boolean
  images?: string[]
}

interface PostDto {
  id: number
  author: {
    id: number
    email: string
    displayName: string | null
    avatarUrl: string | null
  }
  title: string
  content: string
  tags: string[] | null
  images: string[] | null
  status: string
  viewCount: number
  likeCount: number
  commentCount: number
  createdAt: string
  updatedAt: string
  lastActivityAt: string
}

const ForumPage = () => {
  const { t } = useTranslation(['forum', 'common'])
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const user = useAuthStore((state) => state.user)

  const [view, setView] = useState<'list' | 'detail' | 'myPosts'>('list')
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [activeTag, setActiveTag] = useState(() => t('forum:tags.all'))
  const [sortBy, setSortBy] = useState<'newest' | 'hottest'>('newest')
  const [searchQuery, setSearchQuery] = useState('')
  const [commentText, setCommentText] = useState('')
  const [replyToCommentId, setReplyToCommentId] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // 可用标签列表
  const availableTags = [
    '医疗',
    '交通',
    '支付',
    '教育',
    '文化',
    '求助',
    '摄影',
    '聚会',
    '周末',
    '二手',
    '美食',
    '推荐',
    '签证',
    '租房',
    '指南',
  ]

  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)

  // 从API加载帖子列表
  const loadPosts = async () => {
    setLoading(true)
    try {
      const response = await apiClient.get<{ success: boolean; data: PostDto[] }>('/forum/posts')
      if (response.data.success && response.data.data) {
        const convertedPosts = response.data.data.map(convertDtoToPost)
        setPosts(convertedPosts)
      }
    } catch (error) {
      console.error('加载帖子失败:', error)
      // 不显示错误提示，允许未登录用户浏览
    } finally {
      setLoading(false)
    }
  }

  // 加载我的帖子
  const loadMyPosts = async () => {
    if (!isAuthenticated) return
    setLoading(true)
    try {
      const response = await apiClient.get<{ success: boolean; data: PostDto[] }>('/forum/posts/my')
      if (response.data.success && response.data.data) {
        const convertedPosts = response.data.data.map(convertDtoToPost)
        setPosts(convertedPosts)
      }
    } catch (error) {
      console.error('加载我的帖子失败:', error)
      toast.error(t('forum:myPosts.loadFailed'))
    } finally {
      setLoading(false)
    }
  }

  // 转换DTO到Post
  const convertDtoToPost = (dto: PostDto): Post => {
    const createdAt = dayjs(dto.createdAt)
    const now = dayjs()
    const diffMinutes = now.diff(createdAt, 'minute')
    let timeStr = '刚刚'
    if (diffMinutes < 1) {
      timeStr = '刚刚'
    } else if (diffMinutes < 60) {
      timeStr = `${diffMinutes}分钟前`
    } else if (diffMinutes < 1440) {
      timeStr = `${Math.floor(diffMinutes / 60)}小时前`
    } else {
      timeStr = `${Math.floor(diffMinutes / 1440)}天前`
    }

    return {
      id: dto.id,
      author: {
        name: dto.author.displayName || dto.author.email.split('@')[0],
        avatar: dto.author.avatarUrl || '', // 使用实际头像URL
        badge: '用户',
        userId: dto.author.id,
      },
      time: timeStr,
      timestamp: dayjs(dto.createdAt).valueOf(),
      title: dto.title,
      content: dto.content,
      tags: dto.tags || [],
      stats: {
        likes: dto.likeCount,
        comments: dto.commentCount,
        views: dto.viewCount,
      },
      commentsList: [],
      isHot: dto.likeCount > 20 || dto.viewCount > 500,
      liked: false,
      images: dto.images && dto.images.length > 0 ? dto.images : undefined,
    }
  }

  // 初始加载
  useEffect(() => {
    if (view === 'myPosts') {
      loadMyPosts()
    } else {
      loadPosts()
    }
  }, [view, isAuthenticated])

  // 当选中帖子时，加载评论
  useEffect(() => {
    if (selectedPost && view === 'detail') {
      loadPostComments(selectedPost.id)
    }
  }, [selectedPost?.id, view])

  // 获取当前用户信息
  const currentUser: Author | null = useMemo(() => {
    if (!isAuthenticated || !user) return null
    return {
      name: user.displayName || user.email.split('@')[0],
      avatar: user.avatarUrl || '', // 使用实际头像URL
      badge: '用户',
      userId: user.id,
    }
  }, [isAuthenticated, user])

  // 动态提取热门标签（从实际帖子中）
  const tags = useMemo(() => {
    // 收集所有帖子中的标签
    const tagCounts: { [key: string]: number } = {}
    posts.forEach((post) => {
      if (post.tags && post.tags.length > 0) {
        post.tags.forEach((tag) => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1
        })
      }
    })

    // 按使用次数排序，取前10个
    const sortedTags = Object.keys(tagCounts)
      .sort((a, b) => tagCounts[b] - tagCounts[a])
      .slice(0, 10)

    // 返回"全部" + 实际存在的标签
    return [t('forum:tags.all'), ...sortedTags]
  }, [posts, t])

  // 计算每个标签的帖子数量
  const getTagCount = (tag: string) => {
    if (tag === t('forum:tags.all')) {
      return posts.length
    }
    return posts.filter((p) => p.tags && p.tags.includes(tag)).length
  }

  // 筛选与排序逻辑
  const getFilteredPosts = () => {
    let result = posts

    // 如果是"我的帖子"视图，只显示当前用户的帖子
    if (view === 'myPosts' && currentUser) {
      result = result.filter((p) => p.author.userId === currentUser.userId)
    }

    // 搜索过滤
    if (searchQuery) {
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // 标签过滤
    if (activeTag !== t('forum:tags.all')) {
      result = result.filter((p) => p.tags.includes(activeTag))
    }

    // 排序
    return result.sort((a, b) => {
      if (sortBy === 'newest') return b.timestamp - a.timestamp
      if (sortBy === 'hottest') return b.stats.likes - a.stats.likes
      return 0
    })
  }

  // 获取当前页的帖子
  const getPaginatedPosts = () => {
    const filtered = getFilteredPosts()
    const start = (currentPage - 1) * pageSize
    const end = start + pageSize
    return filtered.slice(start, end)
  }

  // 当语言切换时，如果当前activeTag是"全部"标签，更新为当前语言的翻译
  useEffect(() => {
    const currentAllTag = t('forum:tags.all')
    // 如果当前activeTag是旧语言的"全部"或"All"，或者是当前语言的"全部"标签，更新它
    if (activeTag === '全部' || activeTag === 'All') {
      setActiveTag(currentAllTag)
    } else if (activeTag === currentAllTag) {
      // 如果已经是当前语言的"全部"标签，保持不变（避免不必要的更新）
      // 但需要确保它是最新的翻译值
      setActiveTag(currentAllTag)
    }
  }, [t])

  // 当筛选条件改变时，重置到第一页
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, activeTag, sortBy, view])

  // 点赞逻辑
  const handleLike = (e: React.MouseEvent, postId: number) => {
    e.stopPropagation()
    if (!isAuthenticated) {
      toast.error('请先登录')
      navigate('/login', { state: { from: '/forum' } })
      return
    }
    setPosts(
      posts.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            stats: { ...p.stats, likes: p.liked ? p.stats.likes - 1 : p.stats.likes + 1 },
            liked: !p.liked,
          }
        }
        return p
      })
    )
    // 如果在详情页点赞，同步更新 selectedPost
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost({
        ...selectedPost,
        stats: {
          ...selectedPost.stats,
          likes: selectedPost.liked ? selectedPost.stats.likes - 1 : selectedPost.stats.likes + 1,
        },
        liked: !selectedPost.liked,
      })
    }
  }

  // 图片上传处理
  const handleImageUpload: UploadProps['customRequest'] = async (options) => {
    const { file, onSuccess, onError } = options
    try {
      const formData = new FormData()
      formData.append('file', file as File)

      // 注意：使用FormData时，不要手动设置Content-Type，让浏览器自动设置（包含boundary）
      const response = await apiClient.post<{ success: boolean; data: string; message?: string; errorCode?: string }>('/upload/image', formData)

      if (response.data.success && response.data.data) {
        const fileUrl = response.data.data
        // 如果是相对路径，转换为完整URL
        const fullUrl = fileUrl.startsWith('http') 
          ? fileUrl 
          : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}${fileUrl}`
        const fileObj = file as File & { uid?: string }
        const newFile: UploadFile = {
          uid: fileObj.uid || Date.now().toString(),
          name: fileObj.name || 'image',
          status: 'done',
          url: fullUrl,
        }
        setFileList((prev) => [...prev, newFile])
        onSuccess?.(fullUrl)
        toast.success(t('forum:upload.success'))
      } else {
        const errorMsg = response.data.message || t('forum:upload.failed')
        onError?.(new Error(errorMsg))
        toast.error(errorMsg)
      }
    } catch (error: any) {
      console.error('图片上传失败:', error)
      const errorMsg = error.response?.data?.message || error.message || '图片上传失败'
      onError?.(new Error(errorMsg))
      if (error.response?.status === 401) {
        toast.error(t('forum:common.loginRequired'))
        navigate('/login', { state: { from: '/forum' } })
      } else if (error.response?.status === 404) {
        toast.error(t('forum:upload.apiNotFound'))
      } else {
        toast.error(errorMsg)
      }
    }
  }

  // 删除图片
  const handleRemoveImage = (file: UploadFile) => {
    setFileList((prev) => prev.filter((f) => f.uid !== file.uid))
  }

  // 发帖逻辑
  const handleCreatePost = async (values: { title: string; content: string }) => {
    if (!isAuthenticated || !currentUser) {
      toast.error('请先登录')
      navigate('/login', { state: { from: '/forum' } })
      return
    }

    try {
      const imageUrls = fileList.map((f) => {
        const url = f.url || ''
        // 如果是完整URL，提取相对路径；否则直接使用
        if (url.startsWith('http')) {
          const match = url.match(/\/uploads\/[^/]+$/)
          return match ? match[0] : url
        }
        return url
      }).filter(Boolean) as string[]

      const response = await apiClient.post<{ success: boolean; data: PostDto; message?: string }>('/forum/posts', {
        title: values.title,
        content: values.content,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
        images: imageUrls.length > 0 ? imageUrls : undefined,
      })

      if (response.data.success && response.data.data) {
        const newPost = convertDtoToPost(response.data.data)
        setPosts([newPost, ...posts])
        setShowCreateModal(false)
        form.resetFields()
        setFileList([])
        setSelectedTags([])
        setView('list')
        setSortBy('newest')
        setActiveTag(t('forum:tags.all'))
        toast.success('发布成功！')
      } else {
        toast.error('发布失败')
      }
    } catch (error: any) {
      console.error('发布帖子失败:', error)
      if (error.response?.status === 401) {
        toast.error(t('forum:common.loginRequired'))
        navigate('/login', { state: { from: '/forum' } })
      } else {
        toast.error(error.response?.data?.message || '发布失败')
      }
    }
  }

  // 打开发帖模态框
  const handleOpenCreateModal = () => {
    if (!isAuthenticated) {
      toast.error('请先登录')
      navigate('/login', { state: { from: '/forum' } })
      return
    }
    setShowCreateModal(true)
  }

  // 加载帖子的评论
  const loadPostComments = async (postId: number) => {
    try {
      const response = await apiClient.get<{ success: boolean; data: Comment[] }>(`/forum/posts/${postId}/comments`)
      if (response.data.success && response.data.data) {
        // 更新选中帖子的评论列表
        if (selectedPost && selectedPost.id === postId) {
          setSelectedPost({
            ...selectedPost,
            commentsList: response.data.data,
            stats: { ...selectedPost.stats, comments: response.data.data.length },
          })
        }
        // 更新大列表中的帖子
        setPosts(
          posts.map((p) => {
            if (p.id === postId) {
              return {
                ...p,
                commentsList: response.data.data,
                stats: { ...p.stats, comments: response.data.data.length },
              }
            }
            return p
          })
        )
      }
    } catch (error) {
      console.error('加载评论失败:', error)
    }
  }

  // 发送评论逻辑
  const handleSendComment = async (parentId?: number | null) => {
    if (!isAuthenticated) {
      toast.error('请先登录')
      navigate('/login', { state: { from: '/forum' } })
      return
    }
    if (!commentText.trim() || !selectedPost) return

    try {
      const response = await apiClient.post<{ success: boolean; data: Comment; message?: string }>(
        `/forum/posts/${selectedPost.id}/comments`,
        {
          content: commentText.trim(),
          parentId: parentId || null,
        }
      )

      if (response.data.success && response.data.data) {
        // 重新加载评论列表
        await loadPostComments(selectedPost.id)
        setCommentText('')
        setReplyToCommentId(null) // 清除回复状态
        toast.success(t('forum:comment.sendSuccess'))
      } else {
        toast.error(response.data.message || t('forum:comment.sendFailed'))
      }
    } catch (error: any) {
      console.error('评论失败:', error)
      if (error.response?.status === 401) {
        toast.error(t('forum:common.loginRequired'))
        navigate('/login', { state: { from: '/forum' } })
      } else {
        toast.error(error.response?.data?.message || '评论失败')
      }
    }
  }

  // 删除评论
  const handleDeleteComment = async (commentId: number) => {
    if (!isAuthenticated || !selectedPost) return

    try {
      const response = await apiClient.delete<{ success: boolean; message?: string }>(
        `/forum/posts/${selectedPost.id}/comments/${commentId}`
      )

      if (response.data.success) {
        // 重新加载评论列表
        await loadPostComments(selectedPost.id)
        toast.success(t('forum:comment.deleteSuccess'))
      } else {
        toast.error(response.data.message || '删除失败')
      }
    } catch (error: any) {
      console.error('删除评论失败:', error)
      if (error.response?.status === 401) {
        toast.error(t('forum:common.loginRequired'))
        navigate('/login', { state: { from: '/forum' } })
      } else {
        toast.error(error.response?.data?.message || t('forum:comment.deleteFailed'))
      }
    }
  }

  // 评论项组件（支持回复和删除）
  const CommentItem = ({
    comment,
    currentUserId,
    onReply,
    onDelete,
    level = 0,
  }: {
    comment: Comment
    currentUserId?: number
    onReply?: (parentId: number) => void
    onDelete?: (commentId: number) => void
    level?: number
  }) => {
    const isAuthor = comment.author.id === currentUserId
    const timeStr = dayjs(comment.createdAt).fromNow()

    return (
      <div className={level > 0 ? 'ml-8 mt-2' : ''}>
        <div className="flex gap-3">
          <Avatar
            size="small"
            src={comment.author.avatarUrl}
            className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 flex-shrink-0"
          >
            {!comment.author.avatarUrl && comment.author.displayName.charAt(0)}
          </Avatar>
          <div className="flex-1 bg-white/80 dark:bg-surface-dark/60 p-3 rounded-lg rounded-tl-none text-sm min-w-0">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <Text strong className="text-sm">
                  {comment.author.displayName}
                </Text>
                {comment.parentId && (
                  <Text type="secondary" className="text-xs">
                    {t('forum:comment.reply')}
                  </Text>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Text type="secondary" className="text-xs">
                  {timeStr}
                </Text>
                {isAuthor && onDelete && (
                  <Button
                    type="text"
                    size="small"
                    icon={<DeleteOutlined />}
                    danger
                    onClick={() => onDelete(comment.id)}
                    className="text-xs"
                  >
                    {t('forum:comment.delete')}
                  </Button>
                )}
                {isAuthenticated && onReply && level < 2 && (
                  <Button
                    type="text"
                    size="small"
                    icon={<MessageOutlined />}
                    onClick={() => onReply(comment.id)}
                    className="text-xs"
                  >
                    {t('forum:comment.reply')}
                  </Button>
                )}
              </div>
            </div>
            <Paragraph className="text-gray-600 dark:text-gray-300 mb-0 whitespace-pre-wrap">
              {comment.content}
            </Paragraph>
          </div>
        </div>
        {/* 显示回复 */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2 space-y-2">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                currentUserId={currentUserId}
                onReply={onReply}
                onDelete={onDelete}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  // 帖子卡片组件 - 使用 React.memo 防止不必要的重新渲染
  const PostCard = React.memo(({ post, isDetail = false }: { post: Post; isDetail?: boolean }) => (
    <div
      onClick={() => !isDetail && (setSelectedPost(post), setView('detail'))}
      className={`bg-white/80 dark:bg-surface-dark/60 rounded-2xl border border-white/40 dark:border-primary-gradientEnd/30 overflow-hidden ${
        !isDetail ? 'hover:shadow-lg cursor-pointer transition-all mb-4' : ''
      }`}
    >
      <div className="p-6">
        {/* Author Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <Avatar
              src={post.author.avatar || undefined}
              style={{
                backgroundColor: !post.author.avatar
                  ? (post.author.userId !== undefined && post.author.userId % 3 === 0
                      ? '#ffb3d9'
                      : post.author.userId !== undefined && post.author.userId % 3 === 1
                        ? '#91caff'
                        : '#95de64')
                  : undefined,
              }}
              className="flex items-center justify-center"
            >
              {!post.author.avatar && post.author.name.charAt(0)}
            </Avatar>
            <div className="ml-3">
              <div className="flex items-center">
                <Text strong className="text-sm">
                  {post.author.name}
                </Text>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{post.time}</div>
            </div>
          </div>
          {!isDetail && (
            <Button type="text" icon={<MoreOutlined />} className="text-gray-300 hover:text-gray-600" />
          )}
        </div>

        {/* Content */}
        <div className={!isDetail ? 'pl-13' : ''}>
          <Title
            level={4}
            className={`mb-2 ${isDetail ? 'text-xl' : 'text-lg hover:text-blue-600 transition-colors'}`}
          >
            {post.isHot && (
              <Tag color="red" className="mr-2">
                {t('forum:post.hot')}
              </Tag>
            )}
            {post.title}
          </Title>
          <Paragraph
            className={`text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 whitespace-pre-wrap ${
              !isDetail && 'line-clamp-3'
            }`}
          >
            {post.content}
          </Paragraph>

          {/* Images */}
          {post.images && post.images.length > 0 && (
            <div className={`mb-4 grid gap-2 ${post.images.length === 1 ? 'grid-cols-1' : post.images.length === 2 ? 'grid-cols-2' : 'grid-cols-2'}`}>
              <Image.PreviewGroup>
                {post.images.map((img, idx) => {
                  // 处理图片URL：如果是相对路径，转换为完整URL
                  const imageUrl = img.startsWith('http') 
                    ? img 
                    : img.startsWith('/')
                      ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}${img}`
                      : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/uploads/${img}`
                  return (
                    <div key={idx} className="rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800" style={{ aspectRatio: '16/9' }}>
                      <Image
                        src={imageUrl}
                        alt={`图片${idx + 1}`}
                        className="w-full h-full object-cover cursor-pointer"
                        preview={{
                          mask: '预览',
                        }}
                        fallback="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23ddd' width='400' height='300'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='18' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3E图片加载失败%3C/text%3E%3C/svg%3E"
                      />
                    </div>
                  )
                })}
              </Image.PreviewGroup>
            </div>
          )}

          {/* Tags */}
          <Space size={[8, 8]} wrap className="mb-4">
            {post.tags.map((tag, i) => (
              <Tag key={i} color="blue">
                #{tag}
              </Tag>
            ))}
          </Space>
        </div>

        {/* Actions */}
        <div className={`flex items-center justify-between border-t border-gray-50 dark:border-gray-700 pt-4 mt-2 ${!isDetail && 'pl-13'}`}>
          <Space size="large" className="text-gray-400">
            <Button
              type="text"
              icon={post.liked ? <HeartFilled className="text-pink-500" /> : <HeartOutlined />}
              onClick={(e) => handleLike(e, post.id)}
              className={post.liked ? 'text-pink-500' : 'hover:text-pink-500'}
            >
              {post.stats.likes}
            </Button>
            <Button type="text" icon={<MessageOutlined />} className="hover:text-blue-600">
              {post.stats.comments}
            </Button>
          </Space>
        </div>
      </div>

      {/* Detail View Comments Section */}
      {isDetail && (
        <div className="bg-white/60 dark:bg-surface-dark/40 p-6 border-t border-white/40 dark:border-primary-gradientEnd/20">
          <Title level={5} className="mb-4">
            {t('forum:post.comments')} ({post.stats.comments})
          </Title>

          {/* Comment List */}
          <div className="space-y-4 mb-6">
            {post.commentsList && post.commentsList.length > 0 ? (
              post.commentsList.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  currentUserId={currentUser?.userId}
                  onReply={(parentId: number) => {
                    // 设置回复状态，可以在输入框显示"回复 @用户名"
                    setReplyToCommentId(parentId)
                    const parentComment = post.commentsList?.find((c) => c.id === parentId)
                    if (parentComment) {
                      setCommentText(`@${parentComment.author.displayName} `)
                    }
                    // 滚动到评论输入框并聚焦
                    setTimeout(() => {
                      const input = document.getElementById('comment-input')
                      input?.focus()
                      input?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                    }, 100)
                  }}
                  onDelete={handleDeleteComment}
                />
              ))
            ) : (
              <Empty description={t('forum:post.noComments')} image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </div>
        </div>
      )}
    </div>
  ), (prevProps, nextProps) => {
    // 自定义比较函数：只有当 post 的 id、commentsList 或 isDetail 改变时才重新渲染
    // 这样可以避免因为其他状态更新（如 commentText）导致的重新渲染
    return (
      prevProps.post.id === nextProps.post.id &&
      prevProps.post.commentsList?.length === nextProps.post.commentsList?.length &&
      prevProps.isDetail === nextProps.isDetail &&
      prevProps.post.stats.comments === nextProps.post.stats.comments
    )
  })

  return (
    <div className="min-h-screen font-sans w-full">
      <div className="flex gap-8 items-start w-full">
        {/* 左侧主要内容区 (帖子流) */}
        <div className="flex-1 min-w-0">
          {view === 'list' || view === 'myPosts' ? (
            <>
              {/* 视图标题 */}
              {view === 'myPosts' && (
                <div className="mb-4 flex items-center justify-between">
                  <Title level={3} className="mb-0">
                    {t('forum:myPosts.title')}
                  </Title>
                  <Button icon={<ArrowLeftOutlined />} onClick={() => setView('list')}>
                    {t('forum:myPosts.backToList')}
                  </Button>
                </div>
              )}

              {/* 列表渲染 */}
              <div className="space-y-4 pb-4">
                {loading ? (
                  <div className="text-center py-20">
                    <Empty description={t('forum:common.loading')} image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  </div>
                ) : getPaginatedPosts().length > 0 ? (
                  getPaginatedPosts().map((post) => <PostCard key={post.id} post={post} />)
                ) : (
                  <div className="text-center py-20 bg-white/80 dark:bg-surface-dark/60 rounded-2xl border border-white/40 dark:border-primary-gradientEnd/30">
                    <Empty
                      description={view === 'myPosts' ? t('forum:myPosts.empty') : t('forum:noResults')}
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    >
                      {view === 'myPosts' ? (
                        <Button type="primary" icon={<EditOutlined />} onClick={handleOpenCreateModal}>
                          {t('forum:myPosts.createFirst')}
                        </Button>
                      ) : (
                        <Button type="link" onClick={() => setActiveTag(t('forum:tags.all'))}>
                          {t('forum:viewAll')}
                        </Button>
                      )}
                    </Empty>
                  </div>
                )}
              </div>

              {/* 分页器 */}
              {getFilteredPosts().length > 0 && (
                <div className="mt-6 flex justify-center">
                  <Pagination
                    current={currentPage}
                    total={getFilteredPosts().length}
                    pageSize={pageSize}
                    onChange={(page) => setCurrentPage(page)}
                    showSizeChanger={false}
                    showQuickJumper
                    showTotal={(total) => t('forum:pagination.total', { total })}
                  />
                </div>
              )}
            </>
          ) : (
            // 详情页视图
            <div>
              <Button icon={<ArrowLeftOutlined />} onClick={() => setView('list')} className="mb-4">
                {t('forum:backToList')}
              </Button>
              {selectedPost && <PostCard post={selectedPost} isDetail={true} />}
              {/* 评论输入框 - 从 PostCard 中分离出来，避免重新渲染 */}
              {selectedPost && view === 'detail' && (
                <div className="mt-4 bg-white/60 dark:bg-surface-dark/40 p-6 rounded-2xl border border-white/40 dark:border-primary-gradientEnd/20">
                  <div className="flex gap-2 items-center">
                    <Input
                      id="comment-input"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder={
                        isAuthenticated
                          ? replyToCommentId
                            ? t('forum:comment.replyTo', {
                                name: selectedPost.commentsList?.find((c) => c.id === replyToCommentId)?.author.displayName || t('forum:comment.unknownComment')
                              })
                            : t('forum:post.commentPlaceholder')
                          : t('forum:common.loginRequired')
                      }
                      className="flex-1"
                      onPressEnter={(e) => {
                        e.preventDefault()
                        if (commentText.trim() && isAuthenticated) {
                          handleSendComment(replyToCommentId)
                        }
                      }}
                      disabled={!isAuthenticated}
                      allowClear
                    />
                    <Button
                      type="primary"
                      icon={<SendOutlined />}
                      onClick={() => handleSendComment(replyToCommentId)}
                      disabled={!commentText.trim() || !isAuthenticated}
                      className="flex-shrink-0"
                    >
                      {t('forum:post.send')}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 右侧边栏 (辅助信息) - 固定定位 */}
        <aside
          className="hidden lg:block w-80 flex-shrink-0"
          style={{
            position: 'sticky',
            top: '10rem',
            alignSelf: 'flex-start',
            height: 'fit-content',
            maxHeight: 'calc(100vh - 4rem)',
            overflowY: 'auto',
            willChange: 'transform',
          }}
        >
          <div className="space-y-4">
            {/* 搜索框 */}
            <Card
              className="bg-white/80 dark:bg-surface-dark/60 border-white/40 dark:border-primary-gradientEnd/30"
              bordered={false}
            >
              <Input
                prefix={<SearchOutlined className="text-gray-400" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('forum:searchPlaceholder')}
                className="rounded-full"
              />
            </Card>

            {/* 排序和发帖 */}
            <Card
              className="bg-white/80 dark:bg-surface-dark/60 border-white/40 dark:border-primary-gradientEnd/30"
              bordered={false}
            >
              <Space direction="vertical" className="w-full" size={8}>
                <Button.Group className="w-full">
                  <Button
                    type={sortBy === 'newest' ? 'primary' : 'default'}
                    icon={<ClockCircleOutlined />}
                    onClick={() => setSortBy('newest')}
                    className="flex-1"
                  >
                    {t('forum:sort.newest')}
                  </Button>
                  <Button
                    type={sortBy === 'hottest' ? 'primary' : 'default'}
                    icon={<FireOutlined />}
                    onClick={() => setSortBy('hottest')}
                    className="flex-1"
                  >
                    {t('forum:sort.hottest')}
                  </Button>
                </Button.Group>
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={handleOpenCreateModal}
                  block
                  disabled={!isAuthenticated}
                >
                  {t('forum:createPost')}
                </Button>
                <Button
                  icon={<UserOutlined />}
                  block
                  onClick={() => {
                    if (!isAuthenticated) {
                      toast.error(t('forum:common.loginRequired'))
                      navigate('/login', { state: { from: '/forum' } })
                      return
                    }
                    setView('myPosts')
                    setActiveTag(t('forum:tags.all'))
                    loadMyPosts()
                  }}
                  disabled={!isAuthenticated}
                >
                  {t('forum:myPosts.title')}
                </Button>
              </Space>
            </Card>

            {/* 热门标签 */}
            <Card
              title={
                <span>
                  <TagOutlined className="mr-2 text-blue-600" />
                  {t('forum:sidebar.hotTags')}
                </span>
              }
              className="bg-white/80 dark:bg-surface-dark/60 border-white/40 dark:border-primary-gradientEnd/30"
              bordered
            >
              <Space direction="vertical" className="w-full" size={8}>
                {tags.map((tag) => (
                  <div
                    key={tag}
                    onClick={() => setActiveTag(tag)}
                    className={`flex items-center justify-between w-full p-2 rounded-lg cursor-pointer transition-colors ${
                      activeTag === tag
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                        : 'hover:bg-gray-50 dark:hover:bg-surface-dark/40'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <TagOutlined className="text-gray-400" />
                      <span className="text-sm">{tag}</span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{getTagCount(tag)}</span>
                  </div>
                ))}
              </Space>
            </Card>
          </div>
        </aside>
      </div>

      {/* 发帖模态框 */}
      <Modal
        title={t('forum:post.create')}
        open={showCreateModal}
        onCancel={() => {
          setShowCreateModal(false)
          form.resetFields()
          setFileList([])
          setSelectedTags([])
        }}
        footer={null}
        width={700}
        className="dark:bg-surface-dark"
      >
        <Form form={form} onFinish={handleCreatePost} layout="vertical">
          <Form.Item
            name="title"
            rules={[{ required: true, message: t('forum:post.titleRequired') }, { max: 100, message: t('forum:post.titleMaxLength') }]}
          >
            <Input
              placeholder={t('forum:post.titlePlaceholder')}
              className="text-lg font-bold"
              size="large"
              maxLength={100}
              showCount
            />
          </Form.Item>
          <Form.Item
            name="content"
            rules={[{ required: true, message: t('forum:post.contentRequired') }, { max: 5000, message: t('forum:post.contentMaxLength') }]}
          >
            <TextArea
              rows={8}
              placeholder={t('forum:post.contentPlaceholder')}
              className="resize-none"
              maxLength={5000}
              showCount
            />
          </Form.Item>

          {/* 图片上传 */}
          <Form.Item label={t('forum:upload.imageLabel')}>
            <Upload
              customRequest={handleImageUpload}
              listType="picture-card"
              fileList={fileList}
              onRemove={handleRemoveImage}
              accept="image/*"
              maxCount={9}
            >
              {fileList.length < 9 && (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>{t('forum:upload.uploadText')}</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          {/* 标签选择 */}
          <Form.Item label={t('forum:tags.selectLabel')}>
            <Select
              mode="tags"
              placeholder={t('forum:tags.placeholder')}
              value={selectedTags}
              onChange={setSelectedTags}
              style={{ width: '100%' }}
              maxTagCount={5}
              tokenSeparators={[',']}
            >
              {availableTags.map((tag) => (
                <Option key={tag} value={tag}>
                  {tag}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item className="mb-0">
            <div className="flex justify-end">
              <Space>
                <Button onClick={() => setShowCreateModal(false)}>{t('forum:common.cancel')}</Button>
                <Button type="primary" htmlType="submit">
                  {t('forum:post.publish')}
                </Button>
              </Space>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ForumPage
