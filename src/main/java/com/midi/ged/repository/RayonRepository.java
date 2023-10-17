package com.midi.ged.repository;

import com.midi.ged.domain.Rayon;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Rayon entity.
 */
@SuppressWarnings("unused")
@Repository
public interface RayonRepository extends JpaRepository<Rayon, Long> {}
