package com.expats.nanchang.identity.service;

import com.expats.nanchang.identity.domain.User;
import com.expats.nanchang.identity.repository.UserRepository;
import com.expats.nanchang.support.exception.BusinessException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public User register(String email, String rawPassword) {
        userRepository.findByEmail(email).ifPresent(user -> {
            throw new BusinessException("IDENTITY_EMAIL_DUPLICATE", "邮箱已被注册");
        });
        var user = new User(email, passwordEncoder.encode(rawPassword));
        return userRepository.save(user);
    }
}

