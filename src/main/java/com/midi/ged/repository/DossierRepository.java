package com.midi.ged.repository;

import com.midi.ged.domain.Dossier;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Dossier entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DossierRepository extends JpaRepository<Dossier, Long> {}
