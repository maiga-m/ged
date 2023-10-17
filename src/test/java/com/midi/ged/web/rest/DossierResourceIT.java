package com.midi.ged.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.midi.ged.IntegrationTest;
import com.midi.ged.domain.Dossier;
import com.midi.ged.repository.DossierRepository;
import java.time.LocalDate;
import java.time.ZoneId;
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
 * Integration tests for the {@link DossierResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class DossierResourceIT {

    private static final String DEFAULT_CODE = "AAAAAAAAAA";
    private static final String UPDATED_CODE = "BBBBBBBBBB";

    private static final String DEFAULT_MOT_CLE = "AAAAAAAAAA";
    private static final String UPDATED_MOT_CLE = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_DATE_PRODUCTION = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_PRODUCTION = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/dossiers";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private DossierRepository dossierRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDossierMockMvc;

    private Dossier dossier;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Dossier createEntity(EntityManager em) {
        Dossier dossier = new Dossier().code(DEFAULT_CODE).motCle(DEFAULT_MOT_CLE).dateProduction(DEFAULT_DATE_PRODUCTION);
        return dossier;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Dossier createUpdatedEntity(EntityManager em) {
        Dossier dossier = new Dossier().code(UPDATED_CODE).motCle(UPDATED_MOT_CLE).dateProduction(UPDATED_DATE_PRODUCTION);
        return dossier;
    }

    @BeforeEach
    public void initTest() {
        dossier = createEntity(em);
    }

    @Test
    @Transactional
    void createDossier() throws Exception {
        int databaseSizeBeforeCreate = dossierRepository.findAll().size();
        // Create the Dossier
        restDossierMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(dossier)))
            .andExpect(status().isCreated());

        // Validate the Dossier in the database
        List<Dossier> dossierList = dossierRepository.findAll();
        assertThat(dossierList).hasSize(databaseSizeBeforeCreate + 1);
        Dossier testDossier = dossierList.get(dossierList.size() - 1);
        assertThat(testDossier.getCode()).isEqualTo(DEFAULT_CODE);
        assertThat(testDossier.getMotCle()).isEqualTo(DEFAULT_MOT_CLE);
        assertThat(testDossier.getDateProduction()).isEqualTo(DEFAULT_DATE_PRODUCTION);
    }

    @Test
    @Transactional
    void createDossierWithExistingId() throws Exception {
        // Create the Dossier with an existing ID
        dossier.setId(1L);

        int databaseSizeBeforeCreate = dossierRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDossierMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(dossier)))
            .andExpect(status().isBadRequest());

        // Validate the Dossier in the database
        List<Dossier> dossierList = dossierRepository.findAll();
        assertThat(dossierList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllDossiers() throws Exception {
        // Initialize the database
        dossierRepository.saveAndFlush(dossier);

        // Get all the dossierList
        restDossierMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(dossier.getId().intValue())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE)))
            .andExpect(jsonPath("$.[*].motCle").value(hasItem(DEFAULT_MOT_CLE)))
            .andExpect(jsonPath("$.[*].dateProduction").value(hasItem(DEFAULT_DATE_PRODUCTION.toString())));
    }

    @Test
    @Transactional
    void getDossier() throws Exception {
        // Initialize the database
        dossierRepository.saveAndFlush(dossier);

        // Get the dossier
        restDossierMockMvc
            .perform(get(ENTITY_API_URL_ID, dossier.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(dossier.getId().intValue()))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE))
            .andExpect(jsonPath("$.motCle").value(DEFAULT_MOT_CLE))
            .andExpect(jsonPath("$.dateProduction").value(DEFAULT_DATE_PRODUCTION.toString()));
    }

    @Test
    @Transactional
    void getNonExistingDossier() throws Exception {
        // Get the dossier
        restDossierMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingDossier() throws Exception {
        // Initialize the database
        dossierRepository.saveAndFlush(dossier);

        int databaseSizeBeforeUpdate = dossierRepository.findAll().size();

        // Update the dossier
        Dossier updatedDossier = dossierRepository.findById(dossier.getId()).get();
        // Disconnect from session so that the updates on updatedDossier are not directly saved in db
        em.detach(updatedDossier);
        updatedDossier.code(UPDATED_CODE).motCle(UPDATED_MOT_CLE).dateProduction(UPDATED_DATE_PRODUCTION);

        restDossierMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedDossier.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedDossier))
            )
            .andExpect(status().isOk());

        // Validate the Dossier in the database
        List<Dossier> dossierList = dossierRepository.findAll();
        assertThat(dossierList).hasSize(databaseSizeBeforeUpdate);
        Dossier testDossier = dossierList.get(dossierList.size() - 1);
        assertThat(testDossier.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testDossier.getMotCle()).isEqualTo(UPDATED_MOT_CLE);
        assertThat(testDossier.getDateProduction()).isEqualTo(UPDATED_DATE_PRODUCTION);
    }

    @Test
    @Transactional
    void putNonExistingDossier() throws Exception {
        int databaseSizeBeforeUpdate = dossierRepository.findAll().size();
        dossier.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDossierMockMvc
            .perform(
                put(ENTITY_API_URL_ID, dossier.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(dossier))
            )
            .andExpect(status().isBadRequest());

        // Validate the Dossier in the database
        List<Dossier> dossierList = dossierRepository.findAll();
        assertThat(dossierList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDossier() throws Exception {
        int databaseSizeBeforeUpdate = dossierRepository.findAll().size();
        dossier.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDossierMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(dossier))
            )
            .andExpect(status().isBadRequest());

        // Validate the Dossier in the database
        List<Dossier> dossierList = dossierRepository.findAll();
        assertThat(dossierList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDossier() throws Exception {
        int databaseSizeBeforeUpdate = dossierRepository.findAll().size();
        dossier.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDossierMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(dossier)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Dossier in the database
        List<Dossier> dossierList = dossierRepository.findAll();
        assertThat(dossierList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDossierWithPatch() throws Exception {
        // Initialize the database
        dossierRepository.saveAndFlush(dossier);

        int databaseSizeBeforeUpdate = dossierRepository.findAll().size();

        // Update the dossier using partial update
        Dossier partialUpdatedDossier = new Dossier();
        partialUpdatedDossier.setId(dossier.getId());

        partialUpdatedDossier.dateProduction(UPDATED_DATE_PRODUCTION);

        restDossierMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDossier.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDossier))
            )
            .andExpect(status().isOk());

        // Validate the Dossier in the database
        List<Dossier> dossierList = dossierRepository.findAll();
        assertThat(dossierList).hasSize(databaseSizeBeforeUpdate);
        Dossier testDossier = dossierList.get(dossierList.size() - 1);
        assertThat(testDossier.getCode()).isEqualTo(DEFAULT_CODE);
        assertThat(testDossier.getMotCle()).isEqualTo(DEFAULT_MOT_CLE);
        assertThat(testDossier.getDateProduction()).isEqualTo(UPDATED_DATE_PRODUCTION);
    }

    @Test
    @Transactional
    void fullUpdateDossierWithPatch() throws Exception {
        // Initialize the database
        dossierRepository.saveAndFlush(dossier);

        int databaseSizeBeforeUpdate = dossierRepository.findAll().size();

        // Update the dossier using partial update
        Dossier partialUpdatedDossier = new Dossier();
        partialUpdatedDossier.setId(dossier.getId());

        partialUpdatedDossier.code(UPDATED_CODE).motCle(UPDATED_MOT_CLE).dateProduction(UPDATED_DATE_PRODUCTION);

        restDossierMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDossier.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDossier))
            )
            .andExpect(status().isOk());

        // Validate the Dossier in the database
        List<Dossier> dossierList = dossierRepository.findAll();
        assertThat(dossierList).hasSize(databaseSizeBeforeUpdate);
        Dossier testDossier = dossierList.get(dossierList.size() - 1);
        assertThat(testDossier.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testDossier.getMotCle()).isEqualTo(UPDATED_MOT_CLE);
        assertThat(testDossier.getDateProduction()).isEqualTo(UPDATED_DATE_PRODUCTION);
    }

    @Test
    @Transactional
    void patchNonExistingDossier() throws Exception {
        int databaseSizeBeforeUpdate = dossierRepository.findAll().size();
        dossier.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDossierMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, dossier.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(dossier))
            )
            .andExpect(status().isBadRequest());

        // Validate the Dossier in the database
        List<Dossier> dossierList = dossierRepository.findAll();
        assertThat(dossierList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDossier() throws Exception {
        int databaseSizeBeforeUpdate = dossierRepository.findAll().size();
        dossier.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDossierMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(dossier))
            )
            .andExpect(status().isBadRequest());

        // Validate the Dossier in the database
        List<Dossier> dossierList = dossierRepository.findAll();
        assertThat(dossierList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDossier() throws Exception {
        int databaseSizeBeforeUpdate = dossierRepository.findAll().size();
        dossier.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDossierMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(dossier)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Dossier in the database
        List<Dossier> dossierList = dossierRepository.findAll();
        assertThat(dossierList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDossier() throws Exception {
        // Initialize the database
        dossierRepository.saveAndFlush(dossier);

        int databaseSizeBeforeDelete = dossierRepository.findAll().size();

        // Delete the dossier
        restDossierMockMvc
            .perform(delete(ENTITY_API_URL_ID, dossier.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Dossier> dossierList = dossierRepository.findAll();
        assertThat(dossierList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
