package com.expats.nanchang.application.forum;

import com.expats.nanchang.core.forum.domain.Post;
import com.expats.nanchang.core.identity.domain.User;
import com.expats.nanchang.infrastructure.forum.repository.PostRepository;
import com.expats.nanchang.infrastructure.identity.repository.UserRepository;
import com.expats.nanchang.support.exception.BusinessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public PostService(PostRepository postRepository, UserRepository userRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Post create(String title, String content, Long authorId) {
        User author = userRepository.findById(authorId)
            .orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "用户不存在"));
        var post = new Post(title, content, author);
        return postRepository.save(post);
    }

    public List<Post> list() {
        return postRepository.findAll();
    }
}

