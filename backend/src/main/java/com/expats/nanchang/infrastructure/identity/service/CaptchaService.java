package com.expats.nanchang.infrastructure.identity.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 验证码服务门面，根据配置自动选择实现
 */
@Service
public class CaptchaService {

    private final CaptchaServiceInterface delegate;

    @Autowired
    public CaptchaService(List<CaptchaServiceInterface> captchaServices) {
        // 自动注入所有实现，选择第一个（根据@ConditionalOnProperty条件）
        this.delegate = captchaServices.stream()
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("No captcha service implementation found"));
    }

    public CaptchaServiceInterface.CaptchaResult generateCaptcha() {
        return delegate.generateCaptcha();
    }

    public boolean validateCaptcha(String captchaId, String userInput) {
        return delegate.validateCaptcha(captchaId, userInput);
    }
}

