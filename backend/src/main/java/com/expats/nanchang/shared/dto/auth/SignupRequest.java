package com.expats.nanchang.shared.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SignupRequest(
        @NotBlank(message = "邮箱不能为空")
        @Email(message = "邮箱格式不正确")
        String email,

        @NotBlank(message = "密码不能为空")
        @Size(min = 8, message = "密码至少需要8位")
        String password,

        @NotBlank(message = "确认密码不能为空")
        String confirmPassword,

        @NotBlank(message = "验证码不能为空")
        String captcha,

        @NotBlank(message = "验证码ID不能为空")
        String captchaId
) {
}

