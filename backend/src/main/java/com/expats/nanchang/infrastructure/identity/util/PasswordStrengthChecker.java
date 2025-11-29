package com.expats.nanchang.infrastructure.identity.util;

import org.springframework.stereotype.Component;

@Component
public class PasswordStrengthChecker {

    public enum Strength {
        WEAK,    // 弱密码（不允许）
        MEDIUM,  // 中等密码（允许）
        STRONG   // 强密码（推荐）
    }

    public Strength checkStrength(String password) {
        if (password == null || password.length() < 8) {
            return Strength.WEAK;
        }

        boolean hasLower = false;
        boolean hasUpper = false;
        boolean hasDigit = false;
        boolean hasSpecial = false;

        for (char c : password.toCharArray()) {
            if (Character.isLowerCase(c)) hasLower = true;
            else if (Character.isUpperCase(c)) hasUpper = true;
            else if (Character.isDigit(c)) hasDigit = true;
            else if (!Character.isLetterOrDigit(c)) hasSpecial = true;
        }

        int typeCount = 0;
        if (hasLower) typeCount++;
        if (hasUpper) typeCount++;
        if (hasDigit) typeCount++;
        if (hasSpecial) typeCount++;

        // 弱密码：少于8位，或只有一种字符类型
        if (password.length() < 8 || typeCount < 2) {
            return Strength.WEAK;
        }

        // 强密码：12位以上且包含所有类型，或8-11位且包含大小写+数字+特殊字符
        if (password.length() >= 12 && typeCount == 4) {
            return Strength.STRONG;
        }
        if (password.length() >= 8 && password.length() <= 11 && hasUpper && hasLower && hasDigit && hasSpecial) {
            return Strength.STRONG;
        }

        // 中等密码：其他情况
        return Strength.MEDIUM;
    }

    public boolean isAcceptable(String password) {
        return checkStrength(password) != Strength.WEAK;
    }
}

