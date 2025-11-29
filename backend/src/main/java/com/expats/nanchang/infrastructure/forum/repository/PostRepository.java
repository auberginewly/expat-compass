package com.expats.nanchang.infrastructure.forum.repository;

import com.expats.nanchang.core.forum.domain.Post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {
}

