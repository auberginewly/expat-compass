package com.expats.nanchang.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.expats.nanchang.service.CommentService;
import com.expats.nanchang.service.PostService;
import com.expats.nanchang.dto.ResponseEnvelope;
import com.expats.nanchang.common.dto.forum.CreatePostRequest;
import com.expats.nanchang.common.dto.forum.PostDto;
import com.expats.nanchang.infrastructure.util.TraceIdHolder;
import com.expats.nanchang.domain.Post;
import com.expats.nanchang.infrastructure.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;

/**
 * 论坛帖子控制器
 * 提供帖子相关的API接口
 *
 * @author Expat Compass Team
 */
@RestController
@RequestMapping("/api/forum/posts")
public class PostController {

    private final PostService postService;
    private final CommentService commentService;
    private final JwtUtil jwtUtil;

    public PostController(PostService postService, CommentService commentService, JwtUtil jwtUtil) {
        this.postService = postService;
        this.commentService = commentService;
        this.jwtUtil = jwtUtil;
    }

    /**
     * 创建帖子
     */
    @PostMapping
    public ResponseEnvelope<PostDto> createPost(
            HttpServletRequest request,
            @Valid @RequestBody CreatePostRequest createRequest) {
        String token = extractToken(request);
        Long userId = jwtUtil.getUserIdFromToken(token);

        Post post = postService.create(
                createRequest.title(),
                createRequest.content(),
                userId,
                createRequest.tags(),
                createRequest.images()
        );

        PostDto postDto = toDto(post);
        return ResponseEnvelope.success(TraceIdHolder.get(), postDto);
    }

    /**
     * 获取帖子列表
     */
    @GetMapping
    public ResponseEnvelope<List<PostDto>> getPosts() {
        List<Post> posts = postService.list();
        List<PostDto> postDtos = posts.stream()
                .map(this::toDto)
                .toList();
        return ResponseEnvelope.success(TraceIdHolder.get(), postDtos);
    }

    /**
     * 获取我的帖子（必须在/{id}之前，避免路径冲突）
     */
    @GetMapping("/my")
    public ResponseEnvelope<List<PostDto>> getMyPosts(HttpServletRequest request) {
        String token = extractToken(request);
        Long userId = jwtUtil.getUserIdFromToken(token);

        List<Post> posts = postService.findByAuthorId(userId);
        List<PostDto> postDtos = posts.stream()
                .map(this::toDto)
                .toList();
        return ResponseEnvelope.success(TraceIdHolder.get(), postDtos);
    }

    /**
     * 获取帖子详情（必须在/my之后，避免路径冲突）
     */
    @GetMapping("/{id}")
    public ResponseEnvelope<PostDto> getPost(@PathVariable("id") Long id) {
        Post post = postService.findById(id);
        postService.incrementViewCount(id);
        PostDto postDto = toDto(post);
        return ResponseEnvelope.success(TraceIdHolder.get(), postDto);
    }

    /**
     * 转换为DTO
     */
    private PostDto toDto(Post post) {
        // 统计评论数量
        long commentCount = commentService.countCommentsByPost(post.getId());
        
        return new PostDto(
                post.getId(),
                new PostDto.AuthorDto(
                        post.getAuthor().getId(),
                        post.getAuthor().getEmail(),
                        post.getAuthor().getDisplayName(),
                        post.getAuthor().getAvatarUrl()
                ),
                post.getTitle(),
                post.getContent(),
                post.getTags(),
                post.getImages(),
                post.getStatus(),
                post.getViewCount(),
                0, // likeCount - 暂时返回0，后续可以从reactions表统计
                (int) commentCount, // 从数据库统计评论数量
                post.getCreatedAt(),
                post.getUpdatedAt(),
                post.getLastActivityAt()
        );
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

