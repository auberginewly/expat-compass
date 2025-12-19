package com.expats.nanchang.common.dto.identity;

import jakarta.validation.constraints.Size;

/**
 * 更新用户资料请求DTO
 */
public record UpdateProfileRequest(
        @Size(max = 80, message = "昵称不能超过80个字符")
        String displayName,

        @Size(max = 500, message = "头像URL不能超过500个字符")
        String avatarUrl
) {
}

