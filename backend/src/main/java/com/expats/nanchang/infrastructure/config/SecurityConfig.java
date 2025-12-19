package com.expats.nanchang.infrastructure.config;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.expats.nanchang.infrastructure.filter.JwtAuthenticationFilter;

/**
 * Spring Security配置类
 * 配置安全过滤链和密码编码器
 *
 * @author Expat Compass Team
 */
@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/actuator/**", "/api/health", "/api/auth/captcha", "/api/auth/login", "/api/auth/signup").permitAll()
                        .requestMatchers("/api/auth/profile", "/api/auth/change-password", "/api/auth/delete-account").authenticated()  // 更新资料、修改密码、注销账号需要认证
                        .requestMatchers("/api/forum/posts").permitAll()  // 允许浏览帖子列表
                        .requestMatchers("/api/forum/posts/*").permitAll()  // 允许查看帖子详情（数字ID）
                        .requestMatchers("/api/forum/posts/*/comments").permitAll()  // 允许查看评论（GET）
                        .requestMatchers("/api/forum/posts/**").authenticated()  // 创建帖子、评论、删除等需要认证
                        .requestMatchers("/api/upload/**").authenticated()  // 文件上传需要认证
                        .requestMatchers("/api/ai/**").authenticated()  // 只要认证即可，不需要特定角色
                        .anyRequest().permitAll()  // 其他API暂时允许访问
                )
                // 添加JWT认证过滤器 - 必须在UsernamePasswordAuthenticationFilter之前
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                // 移除 httpBasic，使用JWT认证，避免浏览器弹出登录弹窗
                .httpBasic(httpBasic -> httpBasic.disable())
                // 禁用默认的登录页面
                .formLogin(form -> form.disable())
                // 配置异常处理：认证失败时返回401而不是403
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.setContentType("application/json;charset=UTF-8");
                            response.getWriter().write("{\"success\":false,\"message\":\"未授权访问，请先登录\",\"errorCode\":\"UNAUTHORIZED\"}");
                        })
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                            response.setContentType("application/json;charset=UTF-8");
                            response.getWriter().write("{\"success\":false,\"message\":\"无权限访问此功能\",\"errorCode\":\"FORBIDDEN\"}");
                        })
                );
        return http.build();
    }
}

