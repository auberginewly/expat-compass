package com.expats.nanchang.api.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.expats.nanchang.common.dto.ResponseEnvelope;
import com.expats.nanchang.common.logging.TraceIdHolder;

/**
 * 文件上传控制器
 * 处理图片上传功能
 *
 * @author Expat Compass Team
 */
@RestController
@RequestMapping("/api/upload")
public class FileUploadController {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @PostMapping(value = "/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEnvelope<String> uploadImage(@RequestPart("file") MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return ResponseEnvelope.error(TraceIdHolder.get(), "EMPTY_FILE", "文件不能为空");
        }
        try {
            // 验证文件类型
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEnvelope.error(TraceIdHolder.get(), "INVALID_FILE_TYPE", "只能上传图片文件");
            }

            // 生成唯一文件名
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".")
                    ? originalFilename.substring(originalFilename.lastIndexOf("."))
                    : ".jpg";
            String filename = UUID.randomUUID().toString() + extension;

            // 创建上传目录
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // 保存文件
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // 返回文件URL（相对路径，前端需要配置静态资源路径）
            String fileUrl = "/uploads/" + filename;
            return ResponseEnvelope.success(TraceIdHolder.get(), fileUrl);
        } catch (IOException e) {
            return ResponseEnvelope.error(TraceIdHolder.get(), "UPLOAD_FAILED", "文件上传失败: " + e.getMessage());
        }
    }
}

