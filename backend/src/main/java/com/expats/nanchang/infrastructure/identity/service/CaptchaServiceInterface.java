package com.expats.nanchang.infrastructure.identity.service;

/**
 * 验证码服务接口，支持多种实现方式
 */
public interface CaptchaServiceInterface {

    /**
     * 生成验证码
     * @return 验证码结果（包含验证码ID和图片）
     */
    CaptchaResult generateCaptcha();

    /**
     * 验证验证码
     * @param captchaId 验证码ID
     * @param userInput 用户输入的验证码
     * @return 验证是否通过
     */
    boolean validateCaptcha(String captchaId, String userInput);

    /**
     * 验证码结果
     */
    record CaptchaResult(String captchaId, String imageBase64) {
    }
}

