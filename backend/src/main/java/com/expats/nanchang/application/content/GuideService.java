package com.expats.nanchang.application.content;

import java.util.List;

import org.springframework.stereotype.Service;

import com.expats.nanchang.core.content.domain.Guide;
import com.expats.nanchang.infrastructure.content.repository.GuideRepository;

/**
 * 指南服务
 * 负责处理生活指南的查询等业务逻辑
 *
 * @author Expat Compass Team
 */
@Service
public class GuideService {

    private final GuideRepository guideRepository;

    public GuideService(GuideRepository guideRepository) {
        this.guideRepository = guideRepository;
    }

    public List<Guide> listAll() {
        return guideRepository.findAll();
    }
}

