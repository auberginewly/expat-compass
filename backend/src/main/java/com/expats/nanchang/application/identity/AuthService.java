package com.expats.nanchang.application.identity;

import com.expats.nanchang.core.identity.domain.RefreshToken;
import com.expats.nanchang.core.identity.domain.User;
import com.expats.nanchang.infrastructure.identity.repository.RefreshTokenRepository;
import com.expats.nanchang.infrastructure.identity.repository.UserRepository;
import com.expats.nanchang.infrastructure.identity.service.CaptchaService;
import com.expats.nanchang.infrastructure.identity.util.JwtUtil;
import com.expats.nanchang.infrastructure.identity.util.PasswordStrengthChecker;
import com.expats.nanchang.shared.dto.auth.AuthResponse;
import com.expats.nanchang.support.exception.BusinessException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final CaptchaService captchaService;
    private final JwtUtil jwtUtil;
    private final PasswordStrengthChecker passwordStrengthChecker;

    public AuthService(
            UserRepository userRepository,
            RefreshTokenRepository refreshTokenRepository,
            PasswordEncoder passwordEncoder,
            CaptchaService captchaService,
            JwtUtil jwtUtil,
            PasswordStrengthChecker passwordStrengthChecker) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.captchaService = captchaService;
        this.jwtUtil = jwtUtil;
        this.passwordStrengthChecker = passwordStrengthChecker;
    }

    @Transactional
    public AuthResponse register(String email, String rawPassword, String confirmPassword, String captcha, String captchaId) {
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

        // 检查邮箱是否已注册
        userRepository.findByEmail(email).ifPresent(user -> {
            throw new BusinessException("EMAIL_DUPLICATE", "邮箱已被注册");
        });

        // 创建用户
        var user = new User(email, passwordEncoder.encode(rawPassword));
        user.setDisplayName(email.split("@")[0]); // 默认显示名为邮箱前缀
        user = userRepository.save(user);

        // 生成token
        return generateAuthResponse(user);
    }

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

        OffsetDateTime expiresAt = jwtUtil.getExpiresAt(900000); // 15分钟

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
}

