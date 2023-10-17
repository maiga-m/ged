package com.midi.ged.repository;

import com.midi.ged.domain.TypeDocument;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the TypeDocument entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TypeDocumentRepository extends JpaRepository<TypeDocument, Long> {}
