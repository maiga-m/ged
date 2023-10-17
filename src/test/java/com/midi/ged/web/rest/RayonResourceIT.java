package com.midi.ged.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.midi.ged.IntegrationTest;
import com.midi.ged.domain.Rayon;
import com.midi.ged.repository.RayonRepository;
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
 * Integration tests for the {@link RayonResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class RayonResourceIT {

    private static final String DEFAULT_CODE = "AAAAAAAAAA";
    private static final String UPDATED_CODE = "BBBBBBBBBB";

    private static final String DEFAULT_NOM = "AAAAAAAAAA";
    private static final String UPDATED_NOM = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/rayons";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private RayonRepository rayonRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restRayonMockMvc;

    private Rayon rayon;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Rayon createEntity(EntityManager em) {
        Rayon rayon = new Rayon().code(DEFAULT_CODE).nom(DEFAULT_NOM);
        return rayon;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Rayon createUpdatedEntity(EntityManager em) {
        Rayon rayon = new Rayon().code(UPDATED_CODE).nom(UPDATED_NOM);
        return rayon;
    }

    @BeforeEach
    public void initTest() {
        rayon = createEntity(em);
    }

    @Test
    @Transactional
    void createRayon() throws Exception {
        int databaseSizeBeforeCreate = rayonRepository.findAll().size();
        // Create the Rayon
        restRayonMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(rayon)))
            .andExpect(status().isCreated());

        // Validate the Rayon in the database
        List<Rayon> rayonList = rayonRepository.findAll();
        assertThat(rayonList).hasSize(databaseSizeBeforeCreate + 1);
        Rayon testRayon = rayonList.get(rayonList.size() - 1);
        assertThat(testRayon.getCode()).isEqualTo(DEFAULT_CODE);
        assertThat(testRayon.getNom()).isEqualTo(DEFAULT_NOM);
    }

    @Test
    @Transactional
    void createRayonWithExistingId() throws Exception {
        // Create the Rayon with an existing ID
        rayon.setId(1L);

        int databaseSizeBeforeCreate = rayonRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restRayonMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(rayon)))
            .andExpect(status().isBadRequest());

        // Validate the Rayon in the database
        List<Rayon> rayonList = rayonRepository.findAll();
        assertThat(rayonList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllRayons() throws Exception {
        // Initialize the database
        rayonRepository.saveAndFlush(rayon);

        // Get all the rayonList
        restRayonMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(rayon.getId().intValue())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE)))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM)));
    }

    @Test
    @Transactional
    void getRayon() throws Exception {
        // Initialize the database
        rayonRepository.saveAndFlush(rayon);

        // Get the rayon
        restRayonMockMvc
            .perform(get(ENTITY_API_URL_ID, rayon.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(rayon.getId().intValue()))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE))
            .andExpect(jsonPath("$.nom").value(DEFAULT_NOM));
    }

    @Test
    @Transactional
    void getNonExistingRayon() throws Exception {
        // Get the rayon
        restRayonMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingRayon() throws Exception {
        // Initialize the database
        rayonRepository.saveAndFlush(rayon);

        int databaseSizeBeforeUpdate = rayonRepository.findAll().size();

        // Update the rayon
        Rayon updatedRayon = rayonRepository.findById(rayon.getId()).get();
        // Disconnect from session so that the updates on updatedRayon are not directly saved in db
        em.detach(updatedRayon);
        updatedRayon.code(UPDATED_CODE).nom(UPDATED_NOM);

        restRayonMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedRayon.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedRayon))
            )
            .andExpect(status().isOk());

        // Validate the Rayon in the database
        List<Rayon> rayonList = rayonRepository.findAll();
        assertThat(rayonList).hasSize(databaseSizeBeforeUpdate);
        Rayon testRayon = rayonList.get(rayonList.size() - 1);
        assertThat(testRayon.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testRayon.getNom()).isEqualTo(UPDATED_NOM);
    }

    @Test
    @Transactional
    void putNonExistingRayon() throws Exception {
        int databaseSizeBeforeUpdate = rayonRepository.findAll().size();
        rayon.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRayonMockMvc
            .perform(
                put(ENTITY_API_URL_ID, rayon.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(rayon))
            )
            .andExpect(status().isBadRequest());

        // Validate the Rayon in the database
        List<Rayon> rayonList = rayonRepository.findAll();
        assertThat(rayonList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchRayon() throws Exception {
        int databaseSizeBeforeUpdate = rayonRepository.findAll().size();
        rayon.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRayonMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(rayon))
            )
            .andExpect(status().isBadRequest());

        // Validate the Rayon in the database
        List<Rayon> rayonList = rayonRepository.findAll();
        assertThat(rayonList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamRayon() throws Exception {
        int databaseSizeBeforeUpdate = rayonRepository.findAll().size();
        rayon.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRayonMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(rayon)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Rayon in the database
        List<Rayon> rayonList = rayonRepository.findAll();
        assertThat(rayonList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateRayonWithPatch() throws Exception {
        // Initialize the database
        rayonRepository.saveAndFlush(rayon);

        int databaseSizeBeforeUpdate = rayonRepository.findAll().size();

        // Update the rayon using partial update
        Rayon partialUpdatedRayon = new Rayon();
        partialUpdatedRayon.setId(rayon.getId());

        partialUpdatedRayon.code(UPDATED_CODE);

        restRayonMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRayon.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRayon))
            )
            .andExpect(status().isOk());

        // Validate the Rayon in the database
        List<Rayon> rayonList = rayonRepository.findAll();
        assertThat(rayonList).hasSize(databaseSizeBeforeUpdate);
        Rayon testRayon = rayonList.get(rayonList.size() - 1);
        assertThat(testRayon.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testRayon.getNom()).isEqualTo(DEFAULT_NOM);
    }

    @Test
    @Transactional
    void fullUpdateRayonWithPatch() throws Exception {
        // Initialize the database
        rayonRepository.saveAndFlush(rayon);

        int databaseSizeBeforeUpdate = rayonRepository.findAll().size();

        // Update the rayon using partial update
        Rayon partialUpdatedRayon = new Rayon();
        partialUpdatedRayon.setId(rayon.getId());

        partialUpdatedRayon.code(UPDATED_CODE).nom(UPDATED_NOM);

        restRayonMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRayon.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRayon))
            )
            .andExpect(status().isOk());

        // Validate the Rayon in the database
        List<Rayon> rayonList = rayonRepository.findAll();
        assertThat(rayonList).hasSize(databaseSizeBeforeUpdate);
        Rayon testRayon = rayonList.get(rayonList.size() - 1);
        assertThat(testRayon.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testRayon.getNom()).isEqualTo(UPDATED_NOM);
    }

    @Test
    @Transactional
    void patchNonExistingRayon() throws Exception {
        int databaseSizeBeforeUpdate = rayonRepository.findAll().size();
        rayon.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRayonMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, rayon.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(rayon))
            )
            .andExpect(status().isBadRequest());

        // Validate the Rayon in the database
        List<Rayon> rayonList = rayonRepository.findAll();
        assertThat(rayonList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchRayon() throws Exception {
        int databaseSizeBeforeUpdate = rayonRepository.findAll().size();
        rayon.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRayonMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(rayon))
            )
            .andExpect(status().isBadRequest());

        // Validate the Rayon in the database
        List<Rayon> rayonList = rayonRepository.findAll();
        assertThat(rayonList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamRayon() throws Exception {
        int databaseSizeBeforeUpdate = rayonRepository.findAll().size();
        rayon.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRayonMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(rayon)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Rayon in the database
        List<Rayon> rayonList = rayonRepository.findAll();
        assertThat(rayonList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteRayon() throws Exception {
        // Initialize the database
        rayonRepository.saveAndFlush(rayon);

        int databaseSizeBeforeDelete = rayonRepository.findAll().size();

        // Delete the rayon
        restRayonMockMvc
            .perform(delete(ENTITY_API_URL_ID, rayon.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Rayon> rayonList = rayonRepository.findAll();
        assertThat(rayonList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
