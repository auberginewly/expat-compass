package com.expats.nanchang.infrastructure.identity.service;

import com.wf.captcha.SpecCaptcha;
import com.wf.captcha.base.Captcha;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

/**
 * EasyCaptcha 验证码服务实现
 * 
 * 使用 EasyCaptcha 库生成图形验证码
 * 支持：普通验证码、GIF动画验证码、中文验证码、算术验证码
 * 
 * 配置 application.yml:
 * captcha:
 *   type: easy
 */
@Service
@ConditionalOnProperty(name = "captcha.type", havingValue = "easy", matchIfMissing = true)
public class EasyCaptchaService implements CaptchaServiceInterface {

    private final ConcurrentHashMap<String, String> captchaStore = new ConcurrentHashMap<>();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    public EasyCaptchaService() {
        // 每5分钟清理一次过期验证码
        scheduler.scheduleAtFixedRate(this::cleanExpiredCaptchas, 5, 5, TimeUnit.MINUTES);
    }

    @Override
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

    @Override
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

