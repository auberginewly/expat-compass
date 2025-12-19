package com.expats.nanchang.infrastructure.forum.repository;

import com.expats.nanchang.core.forum.domain.Post;
import com.expats.nanchang.core.identity.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByAuthorOrderByCreatedAtDesc(User author);
    
    /**
     * 根据作者删除所有帖子
     */
    void deleteByAuthor(User author);
}

