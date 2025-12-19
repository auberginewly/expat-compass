package com.expats.nanchang.infrastructure.filter;

import com.expats.nanchang.infrastructure.identity.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

/**
 * JWT认证过滤器
 * 从请求头中提取JWT token并设置认证信息
 * 
 * @Order(1) 确保在Security过滤器链中优先执行
 *
 * @author Expat Compass Team
 */
@Component
@Order(1)
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtUtil jwtUtil;

    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        
        // 先清除之前的认证信息
        SecurityContextHolder.clearContext();
        
        String authHeader = request.getHeader("Authorization");
        String requestPath = request.getRequestURI();
        
        // 记录所有请求头（仅用于调试）
        if (logger.isDebugEnabled()) {
            logger.debug("Processing request: {} with Authorization header: {}", requestPath, authHeader != null ? "present" : "missing");
            if (authHeader != null) {
                logger.debug("Authorization header value: {}", authHeader.length() > 20 ? authHeader.substring(0, 20) + "..." : authHeader);
            }
        }
        
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            
            try {
                // 先尝试解析token，如果失败会抛出异常
                Long userId = jwtUtil.getUserIdFromToken(token);
                
                // 验证token是否过期
                if (jwtUtil.isTokenExpired(token)) {
                    logger.warn("JWT token is expired for user: {} on path: {}", userId, requestPath);
                    SecurityContextHolder.clearContext();
                    filterChain.doFilter(request, response);
                    return;
                }
                
                // 创建认证对象 - 确保authenticated为true
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userId.toString(),  // 使用字符串格式的principal
                                null,
                                Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
                        );
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                
                // 设置到SecurityContext
                SecurityContextHolder.getContext().setAuthentication(authentication);
                
                logger.info("JWT authentication successful for user: {} on path: {}", userId, requestPath);
                
                // 验证认证对象是否已设置
                if (logger.isDebugEnabled()) {
                    var context = SecurityContextHolder.getContext();
                    var auth = context.getAuthentication();
                    logger.debug("SecurityContext authentication after setting: authenticated={}, principal={}", 
                        auth != null && auth.isAuthenticated(), 
                        auth != null ? auth.getPrincipal() : "null");
                }
            } catch (Exception e) {
                // Token无效，清除认证信息
                SecurityContextHolder.clearContext();
                logger.error("JWT token validation failed for request {}: {}", requestPath, e.getMessage(), e);
                logger.error("Exception details:", e);
            }
        } else {
            logger.warn("No Authorization header found for request: {}", requestPath);
        }
        
        filterChain.doFilter(request, response);
    }
}

