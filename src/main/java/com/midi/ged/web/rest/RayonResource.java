package com.midi.ged.web.rest;

import com.midi.ged.domain.Rayon;
import com.midi.ged.repository.RayonRepository;
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
 * REST controller for managing {@link com.midi.ged.domain.Rayon}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class RayonResource {

    private final Logger log = LoggerFactory.getLogger(RayonResource.class);

    private static final String ENTITY_NAME = "rayon";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final RayonRepository rayonRepository;

    public RayonResource(RayonRepository rayonRepository) {
        this.rayonRepository = rayonRepository;
    }

    /**
     * {@code POST  /rayons} : Create a new rayon.
     *
     * @param rayon the rayon to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new rayon, or with status {@code 400 (Bad Request)} if the rayon has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/rayons")
    public ResponseEntity<Rayon> createRayon(@Valid @RequestBody Rayon rayon) throws URISyntaxException {
        log.debug("REST request to save Rayon : {}", rayon);
        if (rayon.getId() != null) {
            throw new BadRequestAlertException("A new rayon cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Rayon result = rayonRepository.save(rayon);
        return ResponseEntity
            .created(new URI("/api/rayons/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /rayons/:id} : Updates an existing rayon.
     *
     * @param id the id of the rayon to save.
     * @param rayon the rayon to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated rayon,
     * or with status {@code 400 (Bad Request)} if the rayon is not valid,
     * or with status {@code 500 (Internal Server Error)} if the rayon couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/rayons/{id}")
    public ResponseEntity<Rayon> updateRayon(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Rayon rayon)
        throws URISyntaxException {
        log.debug("REST request to update Rayon : {}, {}", id, rayon);
        if (rayon.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, rayon.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!rayonRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Rayon result = rayonRepository.save(rayon);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, rayon.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /rayons/:id} : Partial updates given fields of an existing rayon, field will ignore if it is null
     *
     * @param id the id of the rayon to save.
     * @param rayon the rayon to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated rayon,
     * or with status {@code 400 (Bad Request)} if the rayon is not valid,
     * or with status {@code 404 (Not Found)} if the rayon is not found,
     * or with status {@code 500 (Internal Server Error)} if the rayon couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/rayons/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Rayon> partialUpdateRayon(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Rayon rayon
    ) throws URISyntaxException {
        log.debug("REST request to partial update Rayon partially : {}, {}", id, rayon);
        if (rayon.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, rayon.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!rayonRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Rayon> result = rayonRepository
            .findById(rayon.getId())
            .map(existingRayon -> {
                if (rayon.getCode() != null) {
                    existingRayon.setCode(rayon.getCode());
                }
                if (rayon.getNom() != null) {
                    existingRayon.setNom(rayon.getNom());
                }

                return existingRayon;
            })
            .map(rayonRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, rayon.getId().toString())
        );
    }

    /**
     * {@code GET  /rayons} : get all the rayons.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of rayons in body.
     */
    @GetMapping("/rayons")
    public ResponseEntity<List<Rayon>> getAllRayons(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Rayons");
        Page<Rayon> page = rayonRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /rayons/:id} : get the "id" rayon.
     *
     * @param id the id of the rayon to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the rayon, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/rayons/{id}")
    public ResponseEntity<Rayon> getRayon(@PathVariable Long id) {
        log.debug("REST request to get Rayon : {}", id);
        Optional<Rayon> rayon = rayonRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(rayon);
    }

    /**
     * {@code DELETE  /rayons/:id} : delete the "id" rayon.
     *
     * @param id the id of the rayon to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/rayons/{id}")
    public ResponseEntity<Void> deleteRayon(@PathVariable Long id) {
        log.debug("REST request to delete Rayon : {}", id);
        rayonRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
