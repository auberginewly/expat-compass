package com.expats.nanchang.service;

import com.expats.nanchang.exception.BusinessException;
import com.expats.nanchang.domain.Conversation;
import com.expats.nanchang.domain.Message;
import com.expats.nanchang.domain.User;
import com.expats.nanchang.repository.ConversationRepository;
import com.expats.nanchang.repository.MessageRepository;
import com.expats.nanchang.repository.UserRepository;
import com.expats.nanchang.infrastructure.integration.ai.AiClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * AI对话服务
 * 负责处理AI对话的创建、消息发送和响应
 *
 * @author Expat Compass Team
 */
@Service
public class AiService {

    private final AiClient aiClient;
    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public AiService(
            AiClient aiClient,
            ConversationRepository conversationRepository,
            MessageRepository messageRepository,
            UserRepository userRepository) {
        this.aiClient = aiClient;
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }

    /**
     * 发送消息并获取AI回复
     *
     * @param userId 用户ID
     * @param conversationId 会话ID（可选，如果为空则创建新会话）
     * @param userMessage 用户消息
     * @return AI回复消息
     */
    @Transactional
    public Message sendMessage(Long userId, UUID conversationId, String userMessage) {
        // 验证用户
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "用户不存在"));

        // 获取或创建会话
        Conversation conversation;
        if (conversationId != null) {
            conversation = conversationRepository.findById(conversationId)
                    .orElseThrow(() -> new BusinessException("CONVERSATION_NOT_FOUND", "会话不存在"));
            // 验证会话属于当前用户
            if (!conversation.getUser().getId().equals(userId)) {
                throw new BusinessException("UNAUTHORIZED", "无权访问此会话");
            }
        } else {
            // 创建新会话
            conversation = new Conversation(UUID.randomUUID(), user);
            conversation.setTitle(userMessage.length() > 50 
                    ? userMessage.substring(0, 50) + "..." 
                    : userMessage);
            conversation = conversationRepository.save(conversation);
        }

        // 保存用户消息
        Message userMsg = new Message(conversation, "user", userMessage);
        userMsg = messageRepository.save(userMsg);

        // 调用AI客户端获取回复
        String aiResponse = aiClient.chat(conversation.getId().toString(), userMessage);

        // 保存AI回复
        Message aiMsg = new Message(conversation, "assistant", aiResponse);
        aiMsg = messageRepository.save(aiMsg);

        // 更新会话时间
        conversation.setUpdatedAt(java.time.OffsetDateTime.now());
        conversationRepository.save(conversation);

        return aiMsg;
    }

    /**
     * 获取用户的会话列表
     *
     * @param userId 用户ID
     * @return 会话列表
     */
    @Transactional(readOnly = true)
    public List<Conversation> getUserConversations(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "用户不存在"));
        return conversationRepository.findByUserOrderByUpdatedAtDesc(user);
    }

    /**
     * 获取会话的消息列表
     *
     * @param userId 用户ID
     * @param conversationId 会话ID
     * @return 消息列表
     */
    @Transactional(readOnly = true)
    public List<Message> getConversationMessages(Long userId, UUID conversationId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new BusinessException("CONVERSATION_NOT_FOUND", "会话不存在"));
        
        // 验证会话属于当前用户（需要访问懒加载的user关系，所以需要@Transactional）
        if (!conversation.getUser().getId().equals(userId)) {
            throw new BusinessException("UNAUTHORIZED", "无权访问此会话");
        }

        return messageRepository.findByConversationOrderByCreatedAtAsc(conversation);
    }
}

