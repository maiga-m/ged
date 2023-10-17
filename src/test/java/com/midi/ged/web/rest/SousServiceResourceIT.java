package com.midi.ged.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.midi.ged.IntegrationTest;
import com.midi.ged.domain.SousService;
import com.midi.ged.repository.SousServiceRepository;
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
 * Integration tests for the {@link SousServiceResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SousServiceResourceIT {

    private static final String DEFAULT_CODE = "AAAAAAAAAA";
    private static final String UPDATED_CODE = "BBBBBBBBBB";

    private static final String DEFAULT_NOM = "AAAAAAAAAA";
    private static final String UPDATED_NOM = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/sous-services";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SousServiceRepository sousServiceRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSousServiceMockMvc;

    private SousService sousService;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SousService createEntity(EntityManager em) {
        SousService sousService = new SousService().code(DEFAULT_CODE).nom(DEFAULT_NOM);
        return sousService;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SousService createUpdatedEntity(EntityManager em) {
        SousService sousService = new SousService().code(UPDATED_CODE).nom(UPDATED_NOM);
        return sousService;
    }

    @BeforeEach
    public void initTest() {
        sousService = createEntity(em);
    }

    @Test
    @Transactional
    void createSousService() throws Exception {
        int databaseSizeBeforeCreate = sousServiceRepository.findAll().size();
        // Create the SousService
        restSousServiceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sousService)))
            .andExpect(status().isCreated());

        // Validate the SousService in the database
        List<SousService> sousServiceList = sousServiceRepository.findAll();
        assertThat(sousServiceList).hasSize(databaseSizeBeforeCreate + 1);
        SousService testSousService = sousServiceList.get(sousServiceList.size() - 1);
        assertThat(testSousService.getCode()).isEqualTo(DEFAULT_CODE);
        assertThat(testSousService.getNom()).isEqualTo(DEFAULT_NOM);
    }

    @Test
    @Transactional
    void createSousServiceWithExistingId() throws Exception {
        // Create the SousService with an existing ID
        sousService.setId(1L);

        int databaseSizeBeforeCreate = sousServiceRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSousServiceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sousService)))
            .andExpect(status().isBadRequest());

        // Validate the SousService in the database
        List<SousService> sousServiceList = sousServiceRepository.findAll();
        assertThat(sousServiceList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllSousServices() throws Exception {
        // Initialize the database
        sousServiceRepository.saveAndFlush(sousService);

        // Get all the sousServiceList
        restSousServiceMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(sousService.getId().intValue())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE)))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM)));
    }

    @Test
    @Transactional
    void getSousService() throws Exception {
        // Initialize the database
        sousServiceRepository.saveAndFlush(sousService);

        // Get the sousService
        restSousServiceMockMvc
            .perform(get(ENTITY_API_URL_ID, sousService.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(sousService.getId().intValue()))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE))
            .andExpect(jsonPath("$.nom").value(DEFAULT_NOM));
    }

    @Test
    @Transactional
    void getNonExistingSousService() throws Exception {
        // Get the sousService
        restSousServiceMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingSousService() throws Exception {
        // Initialize the database
        sousServiceRepository.saveAndFlush(sousService);

        int databaseSizeBeforeUpdate = sousServiceRepository.findAll().size();

        // Update the sousService
        SousService updatedSousService = sousServiceRepository.findById(sousService.getId()).get();
        // Disconnect from session so that the updates on updatedSousService are not directly saved in db
        em.detach(updatedSousService);
        updatedSousService.code(UPDATED_CODE).nom(UPDATED_NOM);

        restSousServiceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSousService.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSousService))
            )
            .andExpect(status().isOk());

        // Validate the SousService in the database
        List<SousService> sousServiceList = sousServiceRepository.findAll();
        assertThat(sousServiceList).hasSize(databaseSizeBeforeUpdate);
        SousService testSousService = sousServiceList.get(sousServiceList.size() - 1);
        assertThat(testSousService.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testSousService.getNom()).isEqualTo(UPDATED_NOM);
    }

    @Test
    @Transactional
    void putNonExistingSousService() throws Exception {
        int databaseSizeBeforeUpdate = sousServiceRepository.findAll().size();
        sousService.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSousServiceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, sousService.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(sousService))
            )
            .andExpect(status().isBadRequest());

        // Validate the SousService in the database
        List<SousService> sousServiceList = sousServiceRepository.findAll();
        assertThat(sousServiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSousService() throws Exception {
        int databaseSizeBeforeUpdate = sousServiceRepository.findAll().size();
        sousService.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSousServiceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(sousService))
            )
            .andExpect(status().isBadRequest());

        // Validate the SousService in the database
        List<SousService> sousServiceList = sousServiceRepository.findAll();
        assertThat(sousServiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSousService() throws Exception {
        int databaseSizeBeforeUpdate = sousServiceRepository.findAll().size();
        sousService.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSousServiceMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sousService)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the SousService in the database
        List<SousService> sousServiceList = sousServiceRepository.findAll();
        assertThat(sousServiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSousServiceWithPatch() throws Exception {
        // Initialize the database
        sousServiceRepository.saveAndFlush(sousService);

        int databaseSizeBeforeUpdate = sousServiceRepository.findAll().size();

        // Update the sousService using partial update
        SousService partialUpdatedSousService = new SousService();
        partialUpdatedSousService.setId(sousService.getId());

        restSousServiceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSousService.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSousService))
            )
            .andExpect(status().isOk());

        // Validate the SousService in the database
        List<SousService> sousServiceList = sousServiceRepository.findAll();
        assertThat(sousServiceList).hasSize(databaseSizeBeforeUpdate);
        SousService testSousService = sousServiceList.get(sousServiceList.size() - 1);
        assertThat(testSousService.getCode()).isEqualTo(DEFAULT_CODE);
        assertThat(testSousService.getNom()).isEqualTo(DEFAULT_NOM);
    }

    @Test
    @Transactional
    void fullUpdateSousServiceWithPatch() throws Exception {
        // Initialize the database
        sousServiceRepository.saveAndFlush(sousService);

        int databaseSizeBeforeUpdate = sousServiceRepository.findAll().size();

        // Update the sousService using partial update
        SousService partialUpdatedSousService = new SousService();
        partialUpdatedSousService.setId(sousService.getId());

        partialUpdatedSousService.code(UPDATED_CODE).nom(UPDATED_NOM);

        restSousServiceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSousService.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSousService))
            )
            .andExpect(status().isOk());

        // Validate the SousService in the database
        List<SousService> sousServiceList = sousServiceRepository.findAll();
        assertThat(sousServiceList).hasSize(databaseSizeBeforeUpdate);
        SousService testSousService = sousServiceList.get(sousServiceList.size() - 1);
        assertThat(testSousService.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testSousService.getNom()).isEqualTo(UPDATED_NOM);
    }

    @Test
    @Transactional
    void patchNonExistingSousService() throws Exception {
        int databaseSizeBeforeUpdate = sousServiceRepository.findAll().size();
        sousService.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSousServiceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, sousService.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(sousService))
            )
            .andExpect(status().isBadRequest());

        // Validate the SousService in the database
        List<SousService> sousServiceList = sousServiceRepository.findAll();
        assertThat(sousServiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSousService() throws Exception {
        int databaseSizeBeforeUpdate = sousServiceRepository.findAll().size();
        sousService.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSousServiceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(sousService))
            )
            .andExpect(status().isBadRequest());

        // Validate the SousService in the database
        List<SousService> sousServiceList = sousServiceRepository.findAll();
        assertThat(sousServiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSousService() throws Exception {
        int databaseSizeBeforeUpdate = sousServiceRepository.findAll().size();
        sousService.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSousServiceMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(sousService))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SousService in the database
        List<SousService> sousServiceList = sousServiceRepository.findAll();
        assertThat(sousServiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSousService() throws Exception {
        // Initialize the database
        sousServiceRepository.saveAndFlush(sousService);

        int databaseSizeBeforeDelete = sousServiceRepository.findAll().size();

        // Delete the sousService
        restSousServiceMockMvc
            .perform(delete(ENTITY_API_URL_ID, sousService.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<SousService> sousServiceList = sousServiceRepository.findAll();
        assertThat(sousServiceList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
