package com.expats.nanchang.controller;

import java.util.List;
import java.util.UUID;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.expats.nanchang.service.AiService;
import com.expats.nanchang.dto.ResponseEnvelope;
import com.expats.nanchang.common.dto.ai.ChatRequest;
import com.expats.nanchang.common.dto.ai.ChatResponse;
import com.expats.nanchang.common.dto.ai.ConversationDto;
import com.expats.nanchang.common.dto.ai.MessageDto;
import com.expats.nanchang.infrastructure.util.TraceIdHolder;
import com.expats.nanchang.domain.Conversation;
import com.expats.nanchang.domain.Message;
import com.expats.nanchang.infrastructure.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;

/**
 * AI对话控制器
 * 提供AI对话相关的API接口
 *
 * @author Expat Compass Team
 */
@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final AiService aiService;
    private final JwtUtil jwtUtil;

    public AiController(AiService aiService, JwtUtil jwtUtil) {
        this.aiService = aiService;
        this.jwtUtil = jwtUtil;
    }

    /**
     * 发送消息并获取AI回复
     *
     * @param request HTTP请求（用于获取JWT token）
     * @param chatRequest 对话请求
     * @return AI回复
     */
    @PostMapping("/chat")
    public ResponseEnvelope<ChatResponse> chat(
            HttpServletRequest request,
            @Valid @RequestBody ChatRequest chatRequest) {
        // 从请求头获取JWT token并解析用户ID
        String token = extractToken(request);
        Long userId = jwtUtil.getUserIdFromToken(token);

        // 解析conversationId（如果提供）
        UUID conversationId = chatRequest.conversationId() != null 
                ? UUID.fromString(chatRequest.conversationId()) 
                : null;

        // 发送消息并获取AI回复
        Message aiMessage = aiService.sendMessage(userId, conversationId, chatRequest.message());

        ChatResponse response = new ChatResponse(
                aiMessage.getConversation().getId(),
                aiMessage.getContent(),
                aiMessage.getCreatedAt()
        );

        return ResponseEnvelope.success(TraceIdHolder.get(), response);
    }

    /**
     * 获取用户的会话列表
     *
     * @param request HTTP请求
     * @return 会话列表
     */
    @GetMapping("/conversations")
    public ResponseEnvelope<List<ConversationDto>> getConversations(HttpServletRequest request) {
        String token = extractToken(request);
        Long userId = jwtUtil.getUserIdFromToken(token);

        List<Conversation> conversations = aiService.getUserConversations(userId);
        List<ConversationDto> conversationDtos = conversations.stream()
                .map(ConversationDto::from)
                .toList();
        return ResponseEnvelope.success(TraceIdHolder.get(), conversationDtos);
    }

    /**
     * 获取会话的消息列表
     *
     * @param request HTTP请求
     * @param conversationId 会话ID
     * @return 消息列表
     */
    @GetMapping("/conversations/{conversationId}/messages")
    public ResponseEnvelope<List<MessageDto>> getMessages(
            HttpServletRequest request,
            @PathVariable UUID conversationId) {
        String token = extractToken(request);
        Long userId = jwtUtil.getUserIdFromToken(token);

        List<Message> messages = aiService.getConversationMessages(userId, conversationId);
        List<MessageDto> messageDtos = messages.stream()
                .map(MessageDto::from)
                .toList();
        return ResponseEnvelope.success(TraceIdHolder.get(), messageDtos);
    }

    /**
     * 从请求头提取JWT token
     */
    private String extractToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        throw new com.expats.nanchang.exception.BusinessException("UNAUTHORIZED", "未授权访问");
    }
}

