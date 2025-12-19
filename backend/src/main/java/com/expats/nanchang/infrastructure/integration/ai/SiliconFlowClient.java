package com.expats.nanchang.infrastructure.integration.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 硅基流动AI客户端实现
 * 接入硅基流动（SiliconFlow）的AI对话服务
 * 
 * 查询余额：https://siliconflow.ly-y.cn/
 * API文档：https://api.siliconflow.cn/v1/chat/completions
 *
 * @author Expat Compass Team
 */
@Component
@ConditionalOnProperty(name = "ai.client.type", havingValue = "siliconflow", matchIfMissing = true)
public class SiliconFlowClient implements AiClient {

    private static final Logger logger = LoggerFactory.getLogger(SiliconFlowClient.class);

    private final RestClient restClient;
    private final String model;
    private final ObjectMapper objectMapper;

    public SiliconFlowClient(
            @Value("${ai.siliconflow.api-key:}") String apiKey,
            @Value("${ai.siliconflow.model:deepseek-chat}") String model) {
        this.model = model;
        this.objectMapper = new ObjectMapper();
        
        // 验证API密钥
        if (apiKey == null || apiKey.trim().isEmpty()) {
            throw new IllegalArgumentException("硅基流动API密钥未配置，请在application.yml中设置ai.siliconflow.api-key");
        }
        
        // 配置HTTP客户端超时（60秒）
        ClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        ((SimpleClientHttpRequestFactory) requestFactory).setConnectTimeout((int) Duration.ofSeconds(10).toMillis());
        ((SimpleClientHttpRequestFactory) requestFactory).setReadTimeout((int) Duration.ofSeconds(60).toMillis());
        
        this.restClient = RestClient.builder()
                .baseUrl("https://api.siliconflow.cn/v1")
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .requestFactory(requestFactory)
                .build();
    }

    @Override
    public String chat(String conversationId, String prompt) {
        try {
            // 构建请求体（OpenAI兼容格式）
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", model);
            requestBody.put("messages", List.of(
                    Map.of("role", "user", "content", prompt)
            ));
            requestBody.put("temperature", 0.7);
            requestBody.put("max_tokens", 2000);

            // 调用API
            String responseJson = restClient.post()
                    .uri("/chat/completions")
                    .body(requestBody)
                    .retrieve()
                    .body(String.class);

            // 解析响应
            JsonNode jsonNode = objectMapper.readTree(responseJson);
            JsonNode choices = jsonNode.get("choices");
            if (choices != null && choices.isArray() && choices.size() > 0) {
                JsonNode message = choices.get(0).get("message");
                if (message != null) {
                    JsonNode content = message.get("content");
                    if (content != null) {
                        return content.asText();
                    }
                }
            }

            // 检查是否有错误信息
            JsonNode error = jsonNode.get("error");
            if (error != null) {
                String errorMessage = error.get("message") != null 
                    ? error.get("message").asText() 
                    : "未知错误";
                logger.error("SiliconFlow API错误: " + errorMessage);
                return "抱歉，AI服务调用失败：" + errorMessage;
            }

            // 如果解析失败，返回错误信息
            logger.warn("SiliconFlow API响应格式异常: " + responseJson);
            return "抱歉，AI服务暂时无法响应，请稍后重试。";
        } catch (org.springframework.web.client.HttpClientErrorException e) {
            // HTTP错误（如400, 404等）
            String errorBody = e.getResponseBodyAsString();
            logger.error("SiliconFlow API HTTP错误: " + e.getStatusCode() + " - " + errorBody);
            
            // 尝试解析错误信息
            try {
                JsonNode errorJson = objectMapper.readTree(errorBody);
                JsonNode message = errorJson.get("message");
                if (message != null) {
                    return "抱歉，AI服务调用失败：" + message.asText();
                }
            } catch (Exception parseError) {
                // 解析失败，使用原始错误信息
            }
            
            return "抱歉，AI服务调用失败，请稍后重试。错误信息: " + e.getStatusCode() + " " + e.getMessage();
        } catch (Exception e) {
            // 记录错误日志
            logger.error("SiliconFlow API调用失败: " + e.getMessage(), e);
            return "抱歉，AI服务调用失败，请稍后重试。错误信息：" + e.getMessage();
        }
    }
}

