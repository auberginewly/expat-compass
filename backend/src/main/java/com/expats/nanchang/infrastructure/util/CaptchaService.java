package com.expats.nanchang.infrastructure.util;

import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import org.springframework.stereotype.Service;

import com.wf.captcha.SpecCaptcha;
import com.wf.captcha.base.Captcha;

/**
 * 验证码服务
 * 使用 EasyCaptcha 库生成图形验证码，支持多种验证码类型
 * 验证码存储在内存中，支持自动过期清理
 *
 * @author Expat Compass Team
 */
@Service
public class CaptchaService {

    /**
     * 验证码结果
     */
    public record CaptchaResult(String captchaId, String imageBase64) {
    }

    private final ConcurrentHashMap<String, String> captchaStore = new ConcurrentHashMap<>();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    public CaptchaService() {
        // 每5分钟清理一次过期验证码
        scheduler.scheduleAtFixedRate(this::cleanExpiredCaptchas, 5, 5, TimeUnit.MINUTES);
    }

    /**
     * 生成验证码
     *
     * @return 验证码结果，包含验证码ID和Base64编码的图片
     */
    public CaptchaResult generateCaptcha() {
        // 创建验证码对象，宽130，高48，5位字符
        SpecCaptcha specCaptcha = new SpecCaptcha(130, 48, 5);
        
        // 设置字符类型：数字+字母
        specCaptcha.setCharType(Captcha.TYPE_DEFAULT);
        
        // 设置内置字体（可选）
        // specCaptcha.setFont(Captcha.FONT_1);
        
        // 生成验证码文本（转小写）
        String code = specCaptcha.text().toLowerCase();
        
        // 生成验证码ID
        String captchaId = generateCaptchaId();
        
        // 转换为Base64（EasyCaptcha的toBase64()已经包含data:image/png;base64,前缀）
        String imageBase64 = specCaptcha.toBase64();
        
        // 如果返回的Base64不包含前缀，则添加（兼容处理）
        if (!imageBase64.startsWith("data:image")) {
            imageBase64 = "data:image/png;base64," + imageBase64;
        }
        
        // 存储验证码，5分钟过期
        captchaStore.put(captchaId, code);
        
        return new CaptchaResult(captchaId, imageBase64);
    }

    /**
     * 验证验证码
     *
     * @param captchaId 验证码ID
     * @param userInput 用户输入的验证码
     * @return 验证是否通过
     */
    public boolean validateCaptcha(String captchaId, String userInput) {
        if (captchaId == null || userInput == null) {
            return false;
        }
        
        String storedCode = captchaStore.remove(captchaId);
        if (storedCode == null) {
            return false;
        }
        
        // 不区分大小写
        return storedCode.equalsIgnoreCase(userInput.trim());
    }

    private String generateCaptchaId() {
        return "captcha_" + System.currentTimeMillis() + "_" + new Random().nextInt(10000);
    }

    private void cleanExpiredCaptchas() {
        // 简单清理：如果验证码存储超过1000个，清理一半
        if (captchaStore.size() > 1000) {
            captchaStore.clear();
        }
    }
}

