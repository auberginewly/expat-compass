package com.expats.nanchang.api.controller;

import com.expats.nanchang.shared.dto.ResponseEnvelope;
import com.expats.nanchang.support.logging.TraceIdHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @GetMapping
    public ResponseEnvelope<String> health() {
        return ResponseEnvelope.success(TraceIdHolder.get(), "ok");
    }
}

