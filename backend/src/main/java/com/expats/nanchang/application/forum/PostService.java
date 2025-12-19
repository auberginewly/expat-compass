package com.expats.nanchang.application.forum;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.expats.nanchang.common.exception.BusinessException;
import com.expats.nanchang.core.forum.domain.Post;
import com.expats.nanchang.core.identity.domain.User;
import com.expats.nanchang.infrastructure.forum.repository.CommentRepository;
import com.expats.nanchang.infrastructure.forum.repository.PostRepository;
import com.expats.nanchang.infrastructure.identity.repository.UserRepository;

/**
 * 论坛帖子服务
 * 负责处理论坛帖子的创建、查询等业务逻辑
 *
 * @author Expat Compass Team
 */
@Service
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;

    public PostService(
            PostRepository postRepository,
            UserRepository userRepository,
            CommentRepository commentRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.commentRepository = commentRepository;
    }

    @Transactional
    public Post create(String title, String content, Long authorId, List<String> tags, List<String> images) {
        User author = userRepository.findById(authorId)
            .orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "用户不存在"));
        var post = new Post(title, content, author);
        post.setTags(tags);
        post.setImages(images);
        return postRepository.save(post);
    }

    @Transactional(readOnly = true)
    public List<Post> list() {
        return postRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    @Transactional(readOnly = true)
    public List<Post> findByAuthorId(Long authorId) {
        User author = userRepository.findById(authorId)
            .orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "用户不存在"));
        return postRepository.findByAuthorOrderByCreatedAtDesc(author);
    }

    @Transactional(readOnly = true)
    public Post findById(Long id) {
        return postRepository.findById(id)
            .orElseThrow(() -> new BusinessException("POST_NOT_FOUND", "帖子不存在"));
    }

    @Transactional
    public void incrementViewCount(Long id) {
        Post post = findById(id);
        post.incrementViewCount();
        postRepository.save(post);
    }

    /**
     * 统计帖子的评论数量
     *
     * @param postId 帖子ID
     * @return 评论数量
     */
    @Transactional(readOnly = true)
    public long countComments(Long postId) {
        Post post = findById(postId);
        return commentRepository.countByPostAndStatus(post, "published");
    }
}

