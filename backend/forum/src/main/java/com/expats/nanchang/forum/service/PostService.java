package com.expats.nanchang.forum.service;

import com.expats.nanchang.forum.domain.Post;
import com.expats.nanchang.forum.repository.PostRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PostService {

    private final PostRepository postRepository;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    @Transactional
    public Post create(String title, String content, Long authorId) {
        var post = new Post(title, content, authorId);
        return postRepository.save(post);
    }

    public List<Post> list() {
        return postRepository.findAll();
    }
}

