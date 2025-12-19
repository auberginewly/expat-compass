package com.expats.nanchang.infrastructure.forum.repository;

import com.expats.nanchang.core.forum.domain.Comment;
import com.expats.nanchang.core.forum.domain.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * 评论Repository
 * 提供评论数据访问接口
 *
 * @author Expat Compass Team
 */
public interface CommentRepository extends JpaRepository<Comment, Long> {
    /**
     * 根据帖子ID查找所有评论，按创建时间升序排列
     */
    List<Comment> findByPostOrderByCreatedAtAsc(Post post);

    /**
     * 根据帖子ID和状态查找评论
     */
    @Query("SELECT c FROM Comment c " +
           "WHERE c.post.id = :postId AND c.status = :status " +
           "ORDER BY c.createdAt ASC")
    List<Comment> findByPostIdAndStatusOrderByCreatedAtAsc(@Param("postId") Long postId, @Param("status") String status);

    /**
     * 根据父评论ID查找所有回复
     */
    List<Comment> findByParentOrderByCreatedAtAsc(Comment parent);

    /**
     * 统计帖子的评论数量
     */
    long countByPost(Post post);

    /**
     * 统计帖子的已发布评论数量
     */
    long countByPostAndStatus(Post post, String status);

    /**
     * 根据作者删除所有评论
     */
    void deleteByAuthor(com.expats.nanchang.core.identity.domain.User author);
}

