package com.expats.nanchang.api.controller;

import com.expats.nanchang.application.identity.AuthService;
import com.expats.nanchang.infrastructure.identity.service.CaptchaService;
import com.expats.nanchang.shared.dto.ResponseEnvelope;
import com.expats.nanchang.shared.dto.auth.AuthResponse;
import com.expats.nanchang.shared.dto.auth.CaptchaResponse;
import com.expats.nanchang.shared.dto.auth.LoginRequest;
import com.expats.nanchang.shared.dto.auth.SignupRequest;
import com.expats.nanchang.support.logging.TraceIdHolder;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final CaptchaService captchaService;

    public AuthController(AuthService authService, CaptchaService captchaService) {
        this.authService = authService;
        this.captchaService = captchaService;
    }

    @GetMapping("/captcha")
    public ResponseEnvelope<CaptchaResponse> getCaptcha() {
        var result = captchaService.generateCaptcha();
        return ResponseEnvelope.success(
                TraceIdHolder.get(),
                new CaptchaResponse(result.captchaId(), result.imageBase64())
        );
    }

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
}

