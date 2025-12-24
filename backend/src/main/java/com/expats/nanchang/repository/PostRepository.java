package com.expats.nanchang.repository;

import com.expats.nanchang.domain.Post;
import com.expats.nanchang.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByAuthorOrderByCreatedAtDesc(User author);
    
    /**
     * 根据作者删除所有帖子
     */
    void deleteByAuthor(User author);
}

