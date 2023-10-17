package com.midi.ged.web.rest;

import com.midi.ged.domain.Boite;
import com.midi.ged.repository.BoiteRepository;
import com.midi.ged.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.midi.ged.domain.Boite}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class BoiteResource {

    private final Logger log = LoggerFactory.getLogger(BoiteResource.class);

    private static final String ENTITY_NAME = "boite";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BoiteRepository boiteRepository;

    public BoiteResource(BoiteRepository boiteRepository) {
        this.boiteRepository = boiteRepository;
    }

    /**
     * {@code POST  /boites} : Create a new boite.
     *
     * @param boite the boite to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new boite, or with status {@code 400 (Bad Request)} if the boite has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/boites")
    public ResponseEntity<Boite> createBoite(@Valid @RequestBody Boite boite) throws URISyntaxException {
        log.debug("REST request to save Boite : {}", boite);
        if (boite.getId() != null) {
            throw new BadRequestAlertException("A new boite cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Boite result = boiteRepository.save(boite);
        return ResponseEntity
            .created(new URI("/api/boites/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /boites/:id} : Updates an existing boite.
     *
     * @param id the id of the boite to save.
     * @param boite the boite to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated boite,
     * or with status {@code 400 (Bad Request)} if the boite is not valid,
     * or with status {@code 500 (Internal Server Error)} if the boite couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/boites/{id}")
    public ResponseEntity<Boite> updateBoite(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Boite boite)
        throws URISyntaxException {
        log.debug("REST request to update Boite : {}, {}", id, boite);
        if (boite.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, boite.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!boiteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Boite result = boiteRepository.save(boite);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, boite.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /boites/:id} : Partial updates given fields of an existing boite, field will ignore if it is null
     *
     * @param id the id of the boite to save.
     * @param boite the boite to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated boite,
     * or with status {@code 400 (Bad Request)} if the boite is not valid,
     * or with status {@code 404 (Not Found)} if the boite is not found,
     * or with status {@code 500 (Internal Server Error)} if the boite couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/boites/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Boite> partialUpdateBoite(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Boite boite
    ) throws URISyntaxException {
        log.debug("REST request to partial update Boite partially : {}, {}", id, boite);
        if (boite.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, boite.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!boiteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Boite> result = boiteRepository
            .findById(boite.getId())
            .map(existingBoite -> {
                if (boite.getCode() != null) {
                    existingBoite.setCode(boite.getCode());
                }
                if (boite.getCapacite() != null) {
                    existingBoite.setCapacite(boite.getCapacite());
                }

                return existingBoite;
            })
            .map(boiteRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, boite.getId().toString())
        );
    }

    /**
     * {@code GET  /boites} : get all the boites.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of boites in body.
     */
    @GetMapping("/boites")
    public ResponseEntity<List<Boite>> getAllBoites(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Boites");
        Page<Boite> page = boiteRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /boites/:id} : get the "id" boite.
     *
     * @param id the id of the boite to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the boite, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/boites/{id}")
    public ResponseEntity<Boite> getBoite(@PathVariable Long id) {
        log.debug("REST request to get Boite : {}", id);
        Optional<Boite> boite = boiteRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(boite);
    }

    /**
     * {@code DELETE  /boites/:id} : delete the "id" boite.
     *
     * @param id the id of the boite to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/boites/{id}")
    public ResponseEntity<Void> deleteBoite(@PathVariable Long id) {
        log.debug("REST request to delete Boite : {}", id);
        boiteRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
