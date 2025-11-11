package com.expats.nanchang.content.repository;

import com.expats.nanchang.content.domain.Guide;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GuideRepository extends JpaRepository<Guide, Long> {
}

