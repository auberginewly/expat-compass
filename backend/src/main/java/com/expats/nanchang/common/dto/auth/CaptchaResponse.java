package com.expats.nanchang.common.dto.auth;

public record CaptchaResponse(
        String captchaId,
        String imageBase64
) {
}

