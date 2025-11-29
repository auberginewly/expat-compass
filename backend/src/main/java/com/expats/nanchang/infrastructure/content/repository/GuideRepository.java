package com.expats.nanchang.infrastructure.content.repository;

import com.expats.nanchang.core.content.domain.Guide;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GuideRepository extends JpaRepository<Guide, Long> {
}

