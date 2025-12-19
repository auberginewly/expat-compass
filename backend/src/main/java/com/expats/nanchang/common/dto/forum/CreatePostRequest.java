package com.expats.nanchang.common.dto.forum;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

/**
 * 创建帖子请求DTO
 */
public record CreatePostRequest(
        @NotBlank(message = "标题不能为空")
        @Size(max = 100, message = "标题不能超过100字")
        String title,

        @NotBlank(message = "内容不能为空")
        @Size(max = 5000, message = "内容不能超过5000字")
        String content,

        List<String> tags,

        List<String> images
) {
}

