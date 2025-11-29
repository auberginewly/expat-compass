package com.expats.nanchang.shared.dto.auth;

import java.time.OffsetDateTime;

public record AuthResponse(
        String accessToken,
        String refreshToken,
        UserInfo user,
        OffsetDateTime expiresAt
) {
    public record UserInfo(
            Long id,
            String email,
            String displayName,
            String avatarUrl,
            String preferredLanguage
    ) {
    }
}

