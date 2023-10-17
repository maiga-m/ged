package com.midi.ged.web.rest;

import com.midi.ged.domain.SousService;
import com.midi.ged.repository.SousServiceRepository;
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
 * REST controller for managing {@link com.midi.ged.domain.SousService}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SousServiceResource {

    private final Logger log = LoggerFactory.getLogger(SousServiceResource.class);

    private static final String ENTITY_NAME = "sousService";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SousServiceRepository sousServiceRepository;

    public SousServiceResource(SousServiceRepository sousServiceRepository) {
        this.sousServiceRepository = sousServiceRepository;
    }

    /**
     * {@code POST  /sous-services} : Create a new sousService.
     *
     * @param sousService the sousService to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new sousService, or with status {@code 400 (Bad Request)} if the sousService has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/sous-services")
    public ResponseEntity<SousService> createSousService(@Valid @RequestBody SousService sousService) throws URISyntaxException {
        log.debug("REST request to save SousService : {}", sousService);
        if (sousService.getId() != null) {
            throw new BadRequestAlertException("A new sousService cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SousService result = sousServiceRepository.save(sousService);
        return ResponseEntity
            .created(new URI("/api/sous-services/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /sous-services/:id} : Updates an existing sousService.
     *
     * @param id the id of the sousService to save.
     * @param sousService the sousService to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated sousService,
     * or with status {@code 400 (Bad Request)} if the sousService is not valid,
     * or with status {@code 500 (Internal Server Error)} if the sousService couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/sous-services/{id}")
    public ResponseEntity<SousService> updateSousService(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody SousService sousService
    ) throws URISyntaxException {
        log.debug("REST request to update SousService : {}, {}", id, sousService);
        if (sousService.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, sousService.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!sousServiceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        SousService result = sousServiceRepository.save(sousService);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, sousService.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /sous-services/:id} : Partial updates given fields of an existing sousService, field will ignore if it is null
     *
     * @param id the id of the sousService to save.
     * @param sousService the sousService to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated sousService,
     * or with status {@code 400 (Bad Request)} if the sousService is not valid,
     * or with status {@code 404 (Not Found)} if the sousService is not found,
     * or with status {@code 500 (Internal Server Error)} if the sousService couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/sous-services/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<SousService> partialUpdateSousService(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody SousService sousService
    ) throws URISyntaxException {
        log.debug("REST request to partial update SousService partially : {}, {}", id, sousService);
        if (sousService.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, sousService.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!sousServiceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<SousService> result = sousServiceRepository
            .findById(sousService.getId())
            .map(existingSousService -> {
                if (sousService.getCode() != null) {
                    existingSousService.setCode(sousService.getCode());
                }
                if (sousService.getNom() != null) {
                    existingSousService.setNom(sousService.getNom());
                }

                return existingSousService;
            })
            .map(sousServiceRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, sousService.getId().toString())
        );
    }

    /**
     * {@code GET  /sous-services} : get all the sousServices.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of sousServices in body.
     */
    @GetMapping("/sous-services")
    public ResponseEntity<List<SousService>> getAllSousServices(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of SousServices");
        Page<SousService> page = sousServiceRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /sous-services/:id} : get the "id" sousService.
     *
     * @param id the id of the sousService to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the sousService, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/sous-services/{id}")
    public ResponseEntity<SousService> getSousService(@PathVariable Long id) {
        log.debug("REST request to get SousService : {}", id);
        Optional<SousService> sousService = sousServiceRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(sousService);
    }

    /**
     * {@code DELETE  /sous-services/:id} : delete the "id" sousService.
     *
     * @param id the id of the sousService to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/sous-services/{id}")
    public ResponseEntity<Void> deleteSousService(@PathVariable Long id) {
        log.debug("REST request to delete SousService : {}", id);
        sousServiceRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
