package com.expats.nanchang.application.content;

import com.expats.nanchang.core.content.domain.Guide;
import com.expats.nanchang.infrastructure.content.repository.GuideRepository;
import org.springframework.stereotype.Service;

import java.util.List;

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

