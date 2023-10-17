package com.midi.ged.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.midi.ged.IntegrationTest;
import com.midi.ged.domain.Boite;
import com.midi.ged.repository.BoiteRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link BoiteResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class BoiteResourceIT {

    private static final String DEFAULT_CODE = "AAAAAAAAAA";
    private static final String UPDATED_CODE = "BBBBBBBBBB";

    private static final Integer DEFAULT_CAPACITE = 1;
    private static final Integer UPDATED_CAPACITE = 2;

    private static final String ENTITY_API_URL = "/api/boites";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private BoiteRepository boiteRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBoiteMockMvc;

    private Boite boite;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Boite createEntity(EntityManager em) {
        Boite boite = new Boite().code(DEFAULT_CODE).capacite(DEFAULT_CAPACITE);
        return boite;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Boite createUpdatedEntity(EntityManager em) {
        Boite boite = new Boite().code(UPDATED_CODE).capacite(UPDATED_CAPACITE);
        return boite;
    }

    @BeforeEach
    public void initTest() {
        boite = createEntity(em);
    }

    @Test
    @Transactional
    void createBoite() throws Exception {
        int databaseSizeBeforeCreate = boiteRepository.findAll().size();
        // Create the Boite
        restBoiteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(boite)))
            .andExpect(status().isCreated());

        // Validate the Boite in the database
        List<Boite> boiteList = boiteRepository.findAll();
        assertThat(boiteList).hasSize(databaseSizeBeforeCreate + 1);
        Boite testBoite = boiteList.get(boiteList.size() - 1);
        assertThat(testBoite.getCode()).isEqualTo(DEFAULT_CODE);
        assertThat(testBoite.getCapacite()).isEqualTo(DEFAULT_CAPACITE);
    }

    @Test
    @Transactional
    void createBoiteWithExistingId() throws Exception {
        // Create the Boite with an existing ID
        boite.setId(1L);

        int databaseSizeBeforeCreate = boiteRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restBoiteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(boite)))
            .andExpect(status().isBadRequest());

        // Validate the Boite in the database
        List<Boite> boiteList = boiteRepository.findAll();
        assertThat(boiteList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllBoites() throws Exception {
        // Initialize the database
        boiteRepository.saveAndFlush(boite);

        // Get all the boiteList
        restBoiteMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(boite.getId().intValue())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE)))
            .andExpect(jsonPath("$.[*].capacite").value(hasItem(DEFAULT_CAPACITE)));
    }

    @Test
    @Transactional
    void getBoite() throws Exception {
        // Initialize the database
        boiteRepository.saveAndFlush(boite);

        // Get the boite
        restBoiteMockMvc
            .perform(get(ENTITY_API_URL_ID, boite.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(boite.getId().intValue()))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE))
            .andExpect(jsonPath("$.capacite").value(DEFAULT_CAPACITE));
    }

    @Test
    @Transactional
    void getNonExistingBoite() throws Exception {
        // Get the boite
        restBoiteMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingBoite() throws Exception {
        // Initialize the database
        boiteRepository.saveAndFlush(boite);

        int databaseSizeBeforeUpdate = boiteRepository.findAll().size();

        // Update the boite
        Boite updatedBoite = boiteRepository.findById(boite.getId()).get();
        // Disconnect from session so that the updates on updatedBoite are not directly saved in db
        em.detach(updatedBoite);
        updatedBoite.code(UPDATED_CODE).capacite(UPDATED_CAPACITE);

        restBoiteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedBoite.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedBoite))
            )
            .andExpect(status().isOk());

        // Validate the Boite in the database
        List<Boite> boiteList = boiteRepository.findAll();
        assertThat(boiteList).hasSize(databaseSizeBeforeUpdate);
        Boite testBoite = boiteList.get(boiteList.size() - 1);
        assertThat(testBoite.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testBoite.getCapacite()).isEqualTo(UPDATED_CAPACITE);
    }

    @Test
    @Transactional
    void putNonExistingBoite() throws Exception {
        int databaseSizeBeforeUpdate = boiteRepository.findAll().size();
        boite.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBoiteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, boite.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(boite))
            )
            .andExpect(status().isBadRequest());

        // Validate the Boite in the database
        List<Boite> boiteList = boiteRepository.findAll();
        assertThat(boiteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchBoite() throws Exception {
        int databaseSizeBeforeUpdate = boiteRepository.findAll().size();
        boite.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBoiteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(boite))
            )
            .andExpect(status().isBadRequest());

        // Validate the Boite in the database
        List<Boite> boiteList = boiteRepository.findAll();
        assertThat(boiteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamBoite() throws Exception {
        int databaseSizeBeforeUpdate = boiteRepository.findAll().size();
        boite.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBoiteMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(boite)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Boite in the database
        List<Boite> boiteList = boiteRepository.findAll();
        assertThat(boiteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateBoiteWithPatch() throws Exception {
        // Initialize the database
        boiteRepository.saveAndFlush(boite);

        int databaseSizeBeforeUpdate = boiteRepository.findAll().size();

        // Update the boite using partial update
        Boite partialUpdatedBoite = new Boite();
        partialUpdatedBoite.setId(boite.getId());

        partialUpdatedBoite.capacite(UPDATED_CAPACITE);

        restBoiteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBoite.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBoite))
            )
            .andExpect(status().isOk());

        // Validate the Boite in the database
        List<Boite> boiteList = boiteRepository.findAll();
        assertThat(boiteList).hasSize(databaseSizeBeforeUpdate);
        Boite testBoite = boiteList.get(boiteList.size() - 1);
        assertThat(testBoite.getCode()).isEqualTo(DEFAULT_CODE);
        assertThat(testBoite.getCapacite()).isEqualTo(UPDATED_CAPACITE);
    }

    @Test
    @Transactional
    void fullUpdateBoiteWithPatch() throws Exception {
        // Initialize the database
        boiteRepository.saveAndFlush(boite);

        int databaseSizeBeforeUpdate = boiteRepository.findAll().size();

        // Update the boite using partial update
        Boite partialUpdatedBoite = new Boite();
        partialUpdatedBoite.setId(boite.getId());

        partialUpdatedBoite.code(UPDATED_CODE).capacite(UPDATED_CAPACITE);

        restBoiteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBoite.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBoite))
            )
            .andExpect(status().isOk());

        // Validate the Boite in the database
        List<Boite> boiteList = boiteRepository.findAll();
        assertThat(boiteList).hasSize(databaseSizeBeforeUpdate);
        Boite testBoite = boiteList.get(boiteList.size() - 1);
        assertThat(testBoite.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testBoite.getCapacite()).isEqualTo(UPDATED_CAPACITE);
    }

    @Test
    @Transactional
    void patchNonExistingBoite() throws Exception {
        int databaseSizeBeforeUpdate = boiteRepository.findAll().size();
        boite.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBoiteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, boite.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(boite))
            )
            .andExpect(status().isBadRequest());

        // Validate the Boite in the database
        List<Boite> boiteList = boiteRepository.findAll();
        assertThat(boiteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchBoite() throws Exception {
        int databaseSizeBeforeUpdate = boiteRepository.findAll().size();
        boite.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBoiteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(boite))
            )
            .andExpect(status().isBadRequest());

        // Validate the Boite in the database
        List<Boite> boiteList = boiteRepository.findAll();
        assertThat(boiteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamBoite() throws Exception {
        int databaseSizeBeforeUpdate = boiteRepository.findAll().size();
        boite.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBoiteMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(boite)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Boite in the database
        List<Boite> boiteList = boiteRepository.findAll();
        assertThat(boiteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteBoite() throws Exception {
        // Initialize the database
        boiteRepository.saveAndFlush(boite);

        int databaseSizeBeforeDelete = boiteRepository.findAll().size();

        // Delete the boite
        restBoiteMockMvc
            .perform(delete(ENTITY_API_URL_ID, boite.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Boite> boiteList = boiteRepository.findAll();
        assertThat(boiteList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
