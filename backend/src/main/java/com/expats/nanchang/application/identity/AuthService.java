package com.expats.nanchang.application.identity;

import java.time.OffsetDateTime;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.expats.nanchang.common.dto.auth.AuthResponse;
import com.expats.nanchang.common.exception.BusinessException;
import com.expats.nanchang.core.identity.domain.RefreshToken;
import com.expats.nanchang.core.identity.domain.User;
import com.expats.nanchang.infrastructure.ai.repository.ConversationRepository;
import com.expats.nanchang.infrastructure.forum.repository.CommentRepository;
import com.expats.nanchang.infrastructure.forum.repository.PostRepository;
import com.expats.nanchang.infrastructure.identity.repository.RefreshTokenRepository;
import com.expats.nanchang.infrastructure.identity.repository.UserRepository;
import com.expats.nanchang.infrastructure.identity.service.CaptchaService;
import com.expats.nanchang.infrastructure.identity.util.JwtUtil;
import com.expats.nanchang.infrastructure.identity.util.PasswordStrengthChecker;

/**
 * 用户认证服务
 * 负责处理用户注册、登录、令牌生成等业务逻辑
 *
 * @author Expat Compass Team
 */
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final CaptchaService captchaService;
    private final JwtUtil jwtUtil;
    private final PasswordStrengthChecker passwordStrengthChecker;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final ConversationRepository conversationRepository;

    public AuthService(
            UserRepository userRepository,
            RefreshTokenRepository refreshTokenRepository,
            PasswordEncoder passwordEncoder,
            CaptchaService captchaService,
            JwtUtil jwtUtil,
            PasswordStrengthChecker passwordStrengthChecker,
            PostRepository postRepository,
            CommentRepository commentRepository,
            ConversationRepository conversationRepository) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.captchaService = captchaService;
        this.jwtUtil = jwtUtil;
        this.passwordStrengthChecker = passwordStrengthChecker;
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
        this.conversationRepository = conversationRepository;
    }

    /**
     * 用户注册
     *
     * @param email 用户邮箱
     * @param rawPassword 原始密码
     * @param confirmPassword 确认密码
     * @param captcha 验证码
     * @param captchaId 验证码ID
     * @return 认证响应，包含访问令牌和用户信息
     * @throws BusinessException 当验证码无效、密码不匹配、邮箱已存在时抛出
     */
    @Transactional
    public AuthResponse register(String email, String rawPassword, String confirmPassword, 
                                 String captcha, String captchaId) {
        // 验证验证码
        if (!captchaService.validateCaptcha(captchaId, captcha)) {
            throw new BusinessException("CAPTCHA_INVALID", "验证码错误或已过期");
        }

        // 验证密码匹配
        if (!rawPassword.equals(confirmPassword)) {
            throw new BusinessException("PASSWORD_MISMATCH", "两次输入的密码不一致");
        }

        // 验证密码强度
        if (!passwordStrengthChecker.isAcceptable(rawPassword)) {
            throw new BusinessException("PASSWORD_WEAK", "密码强度不足，请使用至少8位，包含字母和数字的密码");
        }

        // 检查邮箱是否已注册（应用层检查）
        userRepository.findByEmail(email).ifPresent(user -> {
            throw new BusinessException("EMAIL_DUPLICATE", "邮箱已被注册");
        });

        // 创建用户
        var user = new User(email, passwordEncoder.encode(rawPassword));
        user.setDisplayName(email.split("@")[0]); // 默认显示名为邮箱前缀
        
        try {
            user = userRepository.save(user);
        } catch (DataIntegrityViolationException e) {
            // 数据库层唯一约束检查（防止并发情况下的重复注册）
            if (e.getMessage() != null && 
                (e.getMessage().contains("email") || e.getMessage().contains("unique") || 
                 e.getMessage().contains("duplicate"))) {
                throw new BusinessException("EMAIL_DUPLICATE", "邮箱已被注册");
            }
            throw e;
        }

        // 生成token
        return generateAuthResponse(user);
    }

    /**
     * 用户登录
     *
     * @param email 用户邮箱
     * @param password 用户密码
     * @param captcha 验证码
     * @param captchaId 验证码ID
     * @return 认证响应，包含访问令牌和用户信息
     * @throws BusinessException 当验证码无效、邮箱或密码错误、账户未激活时抛出
     */
    @Transactional
    public AuthResponse login(String email, String password, String captcha, String captchaId) {
        // 验证验证码
        if (!captchaService.validateCaptcha(captchaId, captcha)) {
            throw new BusinessException("CAPTCHA_INVALID", "验证码错误或已过期");
        }

        // 查找用户
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException("LOGIN_FAILED", "邮箱或密码错误"));

        // 验证密码
        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new BusinessException("LOGIN_FAILED", "邮箱或密码错误");
        }

        // 验证用户是否激活
        if (!user.getIsActive()) {
            throw new BusinessException("USER_INACTIVE", "账户已被禁用，请联系管理员");
        }

        // 更新最后登录时间
        user.setLastLoginAt(OffsetDateTime.now());
        userRepository.save(user);

        // 生成token
        return generateAuthResponse(user);
    }

    private AuthResponse generateAuthResponse(User user) {
        String[] roles = {"USER"}; // 默认角色，后续可以从数据库获取
        String accessToken = jwtUtil.generateAccessToken(user.getId(), user.getEmail(), roles);
        String refreshToken = jwtUtil.generateRefreshToken(user.getId());

        // 保存refresh token
        var token = new RefreshToken(user, refreshToken, OffsetDateTime.now().plusDays(7));
        refreshTokenRepository.save(token);

        OffsetDateTime expiresAt = jwtUtil.getExpiresAt(jwtUtil.getAccessTokenValidity());

        return new AuthResponse(
                accessToken,
                refreshToken,
                new AuthResponse.UserInfo(
                        user.getId(),
                        user.getEmail(),
                        user.getDisplayName(),
                        user.getAvatarUrl(),
                        user.getPreferredLanguage()
                ),
                expiresAt
        );
    }

    /**
     * 更新用户资料
     *
     * @param userId 用户ID
     * @param displayName 显示名称（可选）
     * @param avatarUrl 头像URL（可选）
     * @return 更新后的用户信息
     * @throws BusinessException 当用户不存在时抛出
     */
    @Transactional
    public User updateProfile(Long userId, String displayName, String avatarUrl) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "用户不存在"));

        if (displayName != null && !displayName.trim().isEmpty()) {
            user.setDisplayName(displayName.trim());
        }
        if (avatarUrl != null) {
            user.setAvatarUrl(avatarUrl.trim().isEmpty() ? null : avatarUrl.trim());
        }

        user.setUpdatedAt(OffsetDateTime.now());
        return userRepository.save(user);
    }

    /**
     * 修改密码
     *
     * @param userId 用户ID
     * @param oldPassword 原密码
     * @param newPassword 新密码
     * @param confirmPassword 确认密码
     * @throws BusinessException 当用户不存在、原密码错误、新密码强度不足或两次密码不匹配时抛出
     */
    @Transactional
    public void changePassword(Long userId, String oldPassword, String newPassword, String confirmPassword) {
        // 验证两次密码是否一致
        if (!newPassword.equals(confirmPassword)) {
            throw new BusinessException("PASSWORD_MISMATCH", "两次输入的密码不一致");
        }

        // 验证新密码强度
        if (!passwordStrengthChecker.isAcceptable(newPassword)) {
            throw new BusinessException("PASSWORD_WEAK", "密码强度不足，请使用至少8位，包含字母和数字的密码");
        }

        // 查找用户
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "用户不存在"));

        // 验证原密码
        if (!passwordEncoder.matches(oldPassword, user.getPasswordHash())) {
            throw new BusinessException("OLD_PASSWORD_INCORRECT", "原密码错误");
        }

        // 更新密码
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user.setUpdatedAt(OffsetDateTime.now());
        userRepository.save(user);
    }

    /**
     * 删除用户账号及其所有关联数据
     *
     * @param userId 用户ID
     * @param password 用户密码（用于确认）
     * @throws BusinessException 当用户不存在或密码错误时抛出
     */
    @Transactional
    public void deleteAccount(Long userId, String password) {
        // 查找用户
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "用户不存在"));

        // 验证密码
        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new BusinessException("PASSWORD_INCORRECT", "密码错误");
        }

        // 删除用户的所有关联数据（按依赖顺序删除）
        // 1. 删除 refresh tokens
        refreshTokenRepository.deleteByUser(user);
        
        // 2. 删除论坛评论（先删除评论，因为评论可能引用帖子）
        commentRepository.deleteByAuthor(user);
        
        // 3. 删除论坛帖子（帖子删除后，相关的评论、点赞等也会被删除，如果设置了CASCADE）
        postRepository.deleteByAuthor(user);
        
        // 4. 删除AI对话（对话删除后，相关的消息也会被删除，如果设置了CASCADE）
        conversationRepository.deleteByUser(user);
        
        // 5. 最后删除用户
        userRepository.delete(user);
    }
}

