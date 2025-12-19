package com.expats.nanchang.common.dto.identity;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * 修改密码请求DTO
 */
public record ChangePasswordRequest(
        @NotBlank(message = "原密码不能为空")
        String oldPassword,

        @NotBlank(message = "新密码不能为空")
        @Size(min = 8, message = "密码长度至少为8位")
        String newPassword,

        @NotBlank(message = "确认密码不能为空")
        String confirmPassword
) {
}

