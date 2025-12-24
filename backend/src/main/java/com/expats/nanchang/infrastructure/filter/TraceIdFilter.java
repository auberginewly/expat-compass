package com.expats.nanchang.infrastructure.filter;

import java.io.IOException;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import com.expats.nanchang.infrastructure.util.TraceIdHolder;

/**
 * 请求追踪ID过滤器
 * 为每个HTTP请求生成唯一的追踪ID，便于日志追踪和问题排查
 *
 * @author Expat Compass Team
 */
@Component
@Order(1)
public class TraceIdFilter extends HttpFilter {

    @Override
    protected void doFilter(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        try {
            String traceId = request.getHeader("X-Trace-Id");
            if (traceId == null || traceId.isEmpty()) {
                traceId = TraceIdHolder.get(); // 自动生成
            } else {
                TraceIdHolder.set(traceId);
            }
            response.setHeader("X-Trace-Id", traceId);
            chain.doFilter(request, response);
        } finally {
            TraceIdHolder.clear();
        }
    }
}

