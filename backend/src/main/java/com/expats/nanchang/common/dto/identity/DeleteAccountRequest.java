package com.expats.nanchang.common.dto.identity;

import jakarta.validation.constraints.NotBlank;

/**
 * 删除账号请求DTO
 */
public record DeleteAccountRequest(
        @NotBlank(message = "密码不能为空")
        String password
) {
}

