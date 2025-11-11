package com.expats.nanchang.support.logging;

import java.util.UUID;

/**
 * 简易 TraceId 工具，后续可替换为 MDC/SLF4J。
 */
public final class TraceIdHolder {

    private static final ThreadLocal<String> TRACE_ID = new ThreadLocal<>();

    private TraceIdHolder() {
    }

    public static void init() {
        TRACE_ID.set(UUID.randomUUID().toString());
    }

    public static String get() {
        return TRACE_ID.get();
    }

    public static void clear() {
        TRACE_ID.remove();
    }
}

