package com.expats.nanchang.content.service;

import com.expats.nanchang.content.domain.Guide;
import com.expats.nanchang.content.repository.GuideRepository;
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

