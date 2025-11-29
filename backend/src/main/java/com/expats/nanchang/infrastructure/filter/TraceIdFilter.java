package com.expats.nanchang.infrastructure.filter;

import com.expats.nanchang.support.logging.TraceIdHolder;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@Order(1)
public class TraceIdFilter extends HttpFilter {

    @Override
    protected void doFilter(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        try {
            TraceIdHolder.init();
            response.setHeader("X-Trace-Id", TraceIdHolder.get());
            chain.doFilter(request, response);
        } finally {
            TraceIdHolder.clear();
        }
    }
}

