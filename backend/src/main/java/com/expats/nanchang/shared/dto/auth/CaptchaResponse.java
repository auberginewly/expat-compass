package com.expats.nanchang.shared.dto.auth;

public record CaptchaResponse(
        String captchaId,
        String imageBase64
) {
}

