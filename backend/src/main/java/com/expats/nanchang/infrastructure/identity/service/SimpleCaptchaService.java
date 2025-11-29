package com.expats.nanchang.infrastructure.identity.service;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

/**
 * 简单验证码服务（当前实现）
 * 可通过配置 captcha.type=simple 启用
 */
@Service
@ConditionalOnProperty(name = "captcha.type", havingValue = "simple")
public class SimpleCaptchaService implements CaptchaServiceInterface {

    private final ConcurrentHashMap<String, String> captchaStore = new ConcurrentHashMap<>();
    private final Random random = new Random();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    public SimpleCaptchaService() {
        // 每5分钟清理一次过期验证码
        scheduler.scheduleAtFixedRate(this::cleanExpiredCaptchas, 5, 5, TimeUnit.MINUTES);
    }

    @Override
    public CaptchaResult generateCaptcha() {
        String code = generateRandomCode();
        String captchaId = generateCaptchaId();
        
        BufferedImage image = createCaptchaImage(code);
        String imageBase64 = imageToBase64(image);
        
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
        return storedCode.equalsIgnoreCase(userInput);
    }

    private String generateRandomCode() {
        String chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // 排除容易混淆的字符
        StringBuilder code = new StringBuilder();
        for (int i = 0; i < 4; i++) {
            code.append(chars.charAt(random.nextInt(chars.length())));
        }
        return code.toString();
    }

    private String generateCaptchaId() {
        return "captcha_" + System.currentTimeMillis() + "_" + random.nextInt(10000);
    }

    private BufferedImage createCaptchaImage(String code) {
        int width = 120;
        int height = 40;
        BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        Graphics2D g = image.createGraphics();

        // 抗锯齿
        g.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        // 背景
        g.setColor(Color.WHITE);
        g.fillRect(0, 0, width, height);

        // 干扰线
        g.setColor(Color.LIGHT_GRAY);
        for (int i = 0; i < 5; i++) {
            int x1 = random.nextInt(width);
            int y1 = random.nextInt(height);
            int x2 = random.nextInt(width);
            int y2 = random.nextInt(height);
            g.drawLine(x1, y1, x2, y2);
        }

        // 文字
        g.setFont(new Font("Arial", Font.BOLD, 24));
        for (int i = 0; i < code.length(); i++) {
            g.setColor(new Color(random.nextInt(100), random.nextInt(100), random.nextInt(100)));
            int x = 20 + i * 25;
            int y = 28 + random.nextInt(5);
            g.drawString(String.valueOf(code.charAt(i)), x, y);
        }

        g.dispose();
        return image;
    }

    private String imageToBase64(BufferedImage image) {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(image, "png", baos);
            byte[] imageBytes = baos.toByteArray();
            return "data:image/png;base64," + Base64.getEncoder().encodeToString(imageBytes);
        } catch (IOException e) {
            throw new RuntimeException("Failed to convert image to base64", e);
        }
    }

    private void cleanExpiredCaptchas() {
        // 简单清理：如果验证码存储超过1000个，清理一半
        if (captchaStore.size() > 1000) {
            captchaStore.clear();
        }
    }
}

