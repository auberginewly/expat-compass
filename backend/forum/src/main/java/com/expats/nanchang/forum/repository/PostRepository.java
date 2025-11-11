package com.expats.nanchang.forum.repository;

import com.expats.nanchang.forum.domain.Post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {
}

