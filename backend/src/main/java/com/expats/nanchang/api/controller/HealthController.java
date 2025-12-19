package com.expats.nanchang.api.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.expats.nanchang.common.dto.ResponseEnvelope;
import com.expats.nanchang.common.logging.TraceIdHolder;

/**
 * 健康检查控制器
 * 提供应用健康状态检查接口
 *
 * @author Expat Compass Team
 */
@RestController
@RequestMapping("/api/health")
public class HealthController {

    @GetMapping
    public ResponseEnvelope<String> health() {
        return ResponseEnvelope.success(TraceIdHolder.get(), "ok");
    }
}

