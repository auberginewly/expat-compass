package com.expats.nanchang.service;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.expats.nanchang.common.dto.forum.CommentDto;
import com.expats.nanchang.exception.BusinessException;
import com.expats.nanchang.domain.Comment;
import com.expats.nanchang.domain.Post;
import com.expats.nanchang.domain.User;
import com.expats.nanchang.repository.CommentRepository;
import com.expats.nanchang.repository.PostRepository;
import com.expats.nanchang.repository.UserRepository;

/**
 * 评论服务
 * 负责处理评论的创建、查询、删除等业务逻辑
 *
 * @author Expat Compass Team
 */
@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public CommentService(
            CommentRepository commentRepository,
            PostRepository postRepository,
            UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    /**
     * 创建评论
     *
     * @param postId 帖子ID
     * @param authorId 作者ID
     * @param content 评论内容
     * @param parentId 父评论ID（可选，用于楼中楼回复）
     * @return 创建的评论
     */
    @Transactional
    public Comment createComment(Long postId, Long authorId, String content, Long parentId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new BusinessException("POST_NOT_FOUND", "帖子不存在"));

        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "用户不存在"));

        Comment parent = null;
        if (parentId != null) {
            parent = commentRepository.findById(parentId)
                    .orElseThrow(() -> new BusinessException("PARENT_COMMENT_NOT_FOUND", "父评论不存在"));
            // 验证父评论属于同一帖子
            if (!parent.getPost().getId().equals(postId)) {
                throw new BusinessException("INVALID_PARENT_COMMENT", "父评论不属于该帖子");
            }
        }

        Comment comment = new Comment(post, author, content, parent);
        comment = commentRepository.save(comment);

        // 更新帖子的最后活动时间
        post.setLastActivityAt(OffsetDateTime.now());
        postRepository.save(post);

        // 重新加载评论以获取完整的关联数据（避免序列化问题）
        return commentRepository.findById(comment.getId())
                .orElseThrow(() -> new BusinessException("COMMENT_SAVE_FAILED", "评论保存失败"));
    }

    /**
     * 获取帖子的所有评论（包括回复）
     *
     * @param postId 帖子ID
     * @return 评论列表（树形结构）
     */
    @Transactional(readOnly = true)
    public List<CommentDto> getPostComments(Long postId) {
        // 验证帖子存在
        if (!postRepository.existsById(postId)) {
            throw new BusinessException("POST_NOT_FOUND", "帖子不存在");
        }

        // 获取所有已发布的评论
        List<Comment> comments = commentRepository.findByPostIdAndStatusOrderByCreatedAtAsc(postId, "published");

        // 在事务内预先加载所有关联，避免LazyInitializationException
        comments.forEach(comment -> {
            // 触发author的懒加载
            if (comment.getAuthor() != null) {
                comment.getAuthor().getId();
                comment.getAuthor().getEmail();
                comment.getAuthor().getDisplayName();
            }
            // 触发parent的懒加载
            if (comment.getParent() != null) {
                comment.getParent().getId();
            }
        });

        // 分离顶级评论和回复
        List<Comment> topLevelComments = comments.stream()
                .filter(c -> c.getParent() == null)
                .collect(Collectors.toList());

        // 构建评论树
        return topLevelComments.stream()
                .map(comment -> buildCommentTree(comment, comments))
                .collect(Collectors.toList());
    }

    /**
     * 构建评论树（递归）
     */
    private CommentDto buildCommentTree(Comment comment, List<Comment> allComments) {
        // 查找回复
        List<CommentDto> replies = allComments.stream()
                .filter(c -> {
                    Comment parent = c.getParent();
                    return parent != null && parent.getId().equals(comment.getId());
                })
                .map(c -> buildCommentTree(c, allComments))
                .collect(Collectors.toList());

        CommentDto dto = CommentDto.from(comment);
        return new CommentDto(
                dto.id(),
                dto.author(),
                dto.content(),
                dto.createdAt(),
                dto.updatedAt(),
                dto.parentId(),
                replies.isEmpty() ? null : replies
        );
    }

    /**
     * 删除评论（仅作者可删除）
     *
     * @param commentId 评论ID
     * @param userId 用户ID
     */
    @Transactional
    public void deleteComment(Long commentId, Long userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new BusinessException("COMMENT_NOT_FOUND", "评论不存在"));

        // 验证是否为评论作者
        if (!comment.getAuthor().getId().equals(userId)) {
            throw new BusinessException("UNAUTHORIZED", "无权删除此评论");
        }

        // 软删除：将状态改为removed
        comment.setStatus("removed");
        comment.setUpdatedAt(OffsetDateTime.now());
        commentRepository.save(comment);
    }

    /**
     * 根据ID获取评论（用于重新加载）
     *
     * @param commentId 评论ID
     * @return 评论
     */
    @Transactional(readOnly = true)
    public Comment getCommentById(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new BusinessException("COMMENT_NOT_FOUND", "评论不存在"));
        // 触发关联加载
        if (comment.getAuthor() != null) {
            comment.getAuthor().getId();
            comment.getAuthor().getEmail();
        }
        if (comment.getParent() != null) {
            comment.getParent().getId();
        }
        return comment;
    }

    /**
     * 统计帖子的评论数量
     *
     * @param postId 帖子ID
     * @return 评论数量
     */
    @Transactional(readOnly = true)
    public long countCommentsByPost(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new BusinessException("POST_NOT_FOUND", "帖子不存在"));
        return commentRepository.countByPostAndStatus(post, "published");
    }
}

