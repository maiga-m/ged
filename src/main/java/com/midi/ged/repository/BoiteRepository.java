package com.midi.ged.repository;

import com.midi.ged.domain.Boite;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Boite entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BoiteRepository extends JpaRepository<Boite, Long> {}
