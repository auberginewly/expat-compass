package com.expats.nanchang.api.controller;

import java.util.List;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.expats.nanchang.application.forum.CommentService;
import com.expats.nanchang.common.dto.ResponseEnvelope;
import com.expats.nanchang.common.dto.forum.CommentDto;
import com.expats.nanchang.common.dto.forum.CreateCommentRequest;
import com.expats.nanchang.common.logging.TraceIdHolder;
import com.expats.nanchang.core.forum.domain.Comment;
import com.expats.nanchang.infrastructure.identity.util.JwtUtil;

/**
 * 评论控制器
 * 提供评论相关的API接口
 *
 * @author Expat Compass Team
 */
@RestController
@RequestMapping("/api/forum/posts/{postId}/comments")
public class CommentController {

    private final CommentService commentService;
    private final JwtUtil jwtUtil;

    public CommentController(CommentService commentService, JwtUtil jwtUtil) {
        this.commentService = commentService;
        this.jwtUtil = jwtUtil;
    }

    /**
     * 获取帖子的所有评论
     *
     * @param postId 帖子ID
     * @return 评论列表
     */
    @GetMapping
    public ResponseEnvelope<List<CommentDto>> getComments(@PathVariable("postId") Long postId) {
        List<CommentDto> comments = commentService.getPostComments(postId);
        return ResponseEnvelope.success(TraceIdHolder.get(), comments);
    }

    /**
     * 创建评论
     *
     * @param postId 帖子ID
     * @param request HTTP请求（用于获取JWT token）
     * @param createRequest 创建评论请求
     * @return 创建的评论
     */
    @PostMapping
    public ResponseEnvelope<CommentDto> createComment(
            @PathVariable("postId") Long postId,
            HttpServletRequest request,
            @Valid @RequestBody CreateCommentRequest createRequest) {
        String token = extractToken(request);
        Long userId = jwtUtil.getUserIdFromToken(token);

        Comment comment = commentService.createComment(
                postId,
                userId,
                createRequest.content(),
                createRequest.parentId()
        );

        // 重新加载评论以确保关联已加载（避免LazyInitializationException）
        Comment reloadedComment = commentService.getCommentById(comment.getId());
        CommentDto commentDto = CommentDto.from(reloadedComment);
        return ResponseEnvelope.success(TraceIdHolder.get(), commentDto);
    }

    /**
     * 删除评论
     *
     * @param postId 帖子ID
     * @param commentId 评论ID
     * @param request HTTP请求
     * @return 成功响应
     */
    @DeleteMapping("/{commentId}")
    public ResponseEnvelope<Void> deleteComment(
            @PathVariable("postId") Long postId,
            @PathVariable("commentId") Long commentId,
            HttpServletRequest request) {
        String token = extractToken(request);
        Long userId = jwtUtil.getUserIdFromToken(token);

        commentService.deleteComment(commentId, userId);
        return ResponseEnvelope.success(TraceIdHolder.get(), null);
    }

    /**
     * 从请求头提取JWT token
     */
    private String extractToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        throw new com.expats.nanchang.common.exception.BusinessException("UNAUTHORIZED", "未授权访问");
    }
}

