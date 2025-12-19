package com.expats.nanchang.api.controller;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.expats.nanchang.application.identity.AuthService;
import com.expats.nanchang.common.dto.ResponseEnvelope;
import com.expats.nanchang.common.dto.auth.AuthResponse;
import com.expats.nanchang.common.dto.auth.CaptchaResponse;
import com.expats.nanchang.common.dto.auth.LoginRequest;
import com.expats.nanchang.common.dto.auth.SignupRequest;
import com.expats.nanchang.common.dto.identity.ChangePasswordRequest;
import com.expats.nanchang.common.dto.identity.DeleteAccountRequest;
import com.expats.nanchang.common.dto.identity.UpdateProfileRequest;
import com.expats.nanchang.common.logging.TraceIdHolder;
import com.expats.nanchang.core.identity.domain.User;
import com.expats.nanchang.infrastructure.identity.service.CaptchaService;
import com.expats.nanchang.infrastructure.identity.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;

/**
 * 认证控制器
 * 提供用户注册、登录、验证码获取等API接口
 *
 * @author Expat Compass Team
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final CaptchaService captchaService;
    private final JwtUtil jwtUtil;

    public AuthController(AuthService authService, CaptchaService captchaService, JwtUtil jwtUtil) {
        this.authService = authService;
        this.captchaService = captchaService;
        this.jwtUtil = jwtUtil;
    }

    /**
     * 获取验证码
     *
     * @return 包含验证码ID和Base64图片的响应
     */
    @GetMapping("/captcha")
    public ResponseEnvelope<CaptchaResponse> getCaptcha() {
        var result = captchaService.generateCaptcha();
        return ResponseEnvelope.success(
                TraceIdHolder.get(),
                new CaptchaResponse(result.captchaId(), result.imageBase64())
        );
    }

    /**
     * 用户注册
     *
     * @param request 注册请求，包含邮箱、密码、验证码等信息
     * @return 包含访问令牌和用户信息的响应
     */
    @PostMapping("/signup")
    public ResponseEnvelope<AuthResponse> signup(@Valid @RequestBody SignupRequest request) {
        var response = authService.register(
                request.email(),
                request.password(),
                request.confirmPassword(),
                request.captcha(),
                request.captchaId()
        );
        return ResponseEnvelope.success(TraceIdHolder.get(), response);
    }

    /**
     * 用户登录
     *
     * @param request 登录请求，包含邮箱、密码、验证码等信息
     * @return 包含访问令牌和用户信息的响应
     */
    @PostMapping("/login")
    public ResponseEnvelope<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        var response = authService.login(
                request.email(),
                request.password(),
                request.captcha(),
                request.captchaId()
        );
        return ResponseEnvelope.success(TraceIdHolder.get(), response);
    }

    /**
     * 更新用户资料
     *
     * @param request HTTP请求（用于获取JWT token）
     * @param updateRequest 更新资料请求
     * @return 更新后的用户信息
     */
    @PostMapping("/profile")
    public ResponseEnvelope<AuthResponse.UserInfo> updateProfile(
            HttpServletRequest request,
            @Valid @RequestBody UpdateProfileRequest updateRequest) {
        String token = extractToken(request);
        Long userId = jwtUtil.getUserIdFromToken(token);

        User updatedUser = authService.updateProfile(
                userId,
                updateRequest.displayName(),
                updateRequest.avatarUrl()
        );

        AuthResponse.UserInfo userInfo = new AuthResponse.UserInfo(
                updatedUser.getId(),
                updatedUser.getEmail(),
                updatedUser.getDisplayName(),
                updatedUser.getAvatarUrl(),
                updatedUser.getPreferredLanguage()
        );

        return ResponseEnvelope.success(TraceIdHolder.get(), userInfo);
    }

    /**
     * 修改密码
     *
     * @param request HTTP请求（用于获取JWT token）
     * @param changePasswordRequest 修改密码请求
     * @return 成功响应
     */
    @PostMapping("/change-password")
    public ResponseEnvelope<Void> changePassword(
            HttpServletRequest request,
            @Valid @RequestBody ChangePasswordRequest changePasswordRequest) {
        String token = extractToken(request);
        Long userId = jwtUtil.getUserIdFromToken(token);

        authService.changePassword(
                userId,
                changePasswordRequest.oldPassword(),
                changePasswordRequest.newPassword(),
                changePasswordRequest.confirmPassword()
        );

        return ResponseEnvelope.success(TraceIdHolder.get(), null);
    }

    /**
     * 删除账号
     *
     * @param request HTTP请求（用于获取JWT token）
     * @param deleteRequest 删除账号请求
     * @return 成功响应
     */
    @PostMapping("/delete-account")
    public ResponseEnvelope<Void> deleteAccount(
            HttpServletRequest request,
            @Valid @RequestBody DeleteAccountRequest deleteRequest) {
        String token = extractToken(request);
        Long userId = jwtUtil.getUserIdFromToken(token);

        authService.deleteAccount(userId, deleteRequest.password());

        return ResponseEnvelope.success(TraceIdHolder.get(), null);
    }

    /**
     * 从请求头提取JWT token
     */
    private String extractToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        throw new com.expats.nanchang.common.exception.BusinessException("UNAUTHORIZED", "未授权访问");
    }
}

