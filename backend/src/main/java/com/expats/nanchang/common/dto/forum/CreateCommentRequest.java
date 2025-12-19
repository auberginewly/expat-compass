package com.expats.nanchang.common.dto.forum;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * 创建评论请求DTO
 */
public record CreateCommentRequest(
        @NotBlank(message = "评论内容不能为空")
        @Size(max = 2000, message = "评论内容不能超过2000字")
        String content,

        Long parentId  // 父评论ID（可选，用于楼中楼回复）
) {
}

