package com.midi.ged.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.midi.ged.IntegrationTest;
import com.midi.ged.domain.TypeDocument;
import com.midi.ged.repository.TypeDocumentRepository;
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
 * Integration tests for the {@link TypeDocumentResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TypeDocumentResourceIT {

    private static final String DEFAULT_CODE = "AAAAAAAAAA";
    private static final String UPDATED_CODE = "BBBBBBBBBB";

    private static final String DEFAULT_LIBELLE = "AAAAAAAAAA";
    private static final String UPDATED_LIBELLE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/type-documents";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TypeDocumentRepository typeDocumentRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTypeDocumentMockMvc;

    private TypeDocument typeDocument;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TypeDocument createEntity(EntityManager em) {
        TypeDocument typeDocument = new TypeDocument().code(DEFAULT_CODE).libelle(DEFAULT_LIBELLE);
        return typeDocument;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TypeDocument createUpdatedEntity(EntityManager em) {
        TypeDocument typeDocument = new TypeDocument().code(UPDATED_CODE).libelle(UPDATED_LIBELLE);
        return typeDocument;
    }

    @BeforeEach
    public void initTest() {
        typeDocument = createEntity(em);
    }

    @Test
    @Transactional
    void createTypeDocument() throws Exception {
        int databaseSizeBeforeCreate = typeDocumentRepository.findAll().size();
        // Create the TypeDocument
        restTypeDocumentMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(typeDocument)))
            .andExpect(status().isCreated());

        // Validate the TypeDocument in the database
        List<TypeDocument> typeDocumentList = typeDocumentRepository.findAll();
        assertThat(typeDocumentList).hasSize(databaseSizeBeforeCreate + 1);
        TypeDocument testTypeDocument = typeDocumentList.get(typeDocumentList.size() - 1);
        assertThat(testTypeDocument.getCode()).isEqualTo(DEFAULT_CODE);
        assertThat(testTypeDocument.getLibelle()).isEqualTo(DEFAULT_LIBELLE);
    }

    @Test
    @Transactional
    void createTypeDocumentWithExistingId() throws Exception {
        // Create the TypeDocument with an existing ID
        typeDocument.setId(1L);

        int databaseSizeBeforeCreate = typeDocumentRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTypeDocumentMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(typeDocument)))
            .andExpect(status().isBadRequest());

        // Validate the TypeDocument in the database
        List<TypeDocument> typeDocumentList = typeDocumentRepository.findAll();
        assertThat(typeDocumentList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllTypeDocuments() throws Exception {
        // Initialize the database
        typeDocumentRepository.saveAndFlush(typeDocument);

        // Get all the typeDocumentList
        restTypeDocumentMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(typeDocument.getId().intValue())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE)))
            .andExpect(jsonPath("$.[*].libelle").value(hasItem(DEFAULT_LIBELLE)));
    }

    @Test
    @Transactional
    void getTypeDocument() throws Exception {
        // Initialize the database
        typeDocumentRepository.saveAndFlush(typeDocument);

        // Get the typeDocument
        restTypeDocumentMockMvc
            .perform(get(ENTITY_API_URL_ID, typeDocument.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(typeDocument.getId().intValue()))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE))
            .andExpect(jsonPath("$.libelle").value(DEFAULT_LIBELLE));
    }

    @Test
    @Transactional
    void getNonExistingTypeDocument() throws Exception {
        // Get the typeDocument
        restTypeDocumentMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingTypeDocument() throws Exception {
        // Initialize the database
        typeDocumentRepository.saveAndFlush(typeDocument);

        int databaseSizeBeforeUpdate = typeDocumentRepository.findAll().size();

        // Update the typeDocument
        TypeDocument updatedTypeDocument = typeDocumentRepository.findById(typeDocument.getId()).get();
        // Disconnect from session so that the updates on updatedTypeDocument are not directly saved in db
        em.detach(updatedTypeDocument);
        updatedTypeDocument.code(UPDATED_CODE).libelle(UPDATED_LIBELLE);

        restTypeDocumentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTypeDocument.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTypeDocument))
            )
            .andExpect(status().isOk());

        // Validate the TypeDocument in the database
        List<TypeDocument> typeDocumentList = typeDocumentRepository.findAll();
        assertThat(typeDocumentList).hasSize(databaseSizeBeforeUpdate);
        TypeDocument testTypeDocument = typeDocumentList.get(typeDocumentList.size() - 1);
        assertThat(testTypeDocument.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testTypeDocument.getLibelle()).isEqualTo(UPDATED_LIBELLE);
    }

    @Test
    @Transactional
    void putNonExistingTypeDocument() throws Exception {
        int databaseSizeBeforeUpdate = typeDocumentRepository.findAll().size();
        typeDocument.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTypeDocumentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, typeDocument.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(typeDocument))
            )
            .andExpect(status().isBadRequest());

        // Validate the TypeDocument in the database
        List<TypeDocument> typeDocumentList = typeDocumentRepository.findAll();
        assertThat(typeDocumentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTypeDocument() throws Exception {
        int databaseSizeBeforeUpdate = typeDocumentRepository.findAll().size();
        typeDocument.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTypeDocumentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(typeDocument))
            )
            .andExpect(status().isBadRequest());

        // Validate the TypeDocument in the database
        List<TypeDocument> typeDocumentList = typeDocumentRepository.findAll();
        assertThat(typeDocumentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTypeDocument() throws Exception {
        int databaseSizeBeforeUpdate = typeDocumentRepository.findAll().size();
        typeDocument.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTypeDocumentMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(typeDocument)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the TypeDocument in the database
        List<TypeDocument> typeDocumentList = typeDocumentRepository.findAll();
        assertThat(typeDocumentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTypeDocumentWithPatch() throws Exception {
        // Initialize the database
        typeDocumentRepository.saveAndFlush(typeDocument);

        int databaseSizeBeforeUpdate = typeDocumentRepository.findAll().size();

        // Update the typeDocument using partial update
        TypeDocument partialUpdatedTypeDocument = new TypeDocument();
        partialUpdatedTypeDocument.setId(typeDocument.getId());

        partialUpdatedTypeDocument.code(UPDATED_CODE).libelle(UPDATED_LIBELLE);

        restTypeDocumentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTypeDocument.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTypeDocument))
            )
            .andExpect(status().isOk());

        // Validate the TypeDocument in the database
        List<TypeDocument> typeDocumentList = typeDocumentRepository.findAll();
        assertThat(typeDocumentList).hasSize(databaseSizeBeforeUpdate);
        TypeDocument testTypeDocument = typeDocumentList.get(typeDocumentList.size() - 1);
        assertThat(testTypeDocument.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testTypeDocument.getLibelle()).isEqualTo(UPDATED_LIBELLE);
    }

    @Test
    @Transactional
    void fullUpdateTypeDocumentWithPatch() throws Exception {
        // Initialize the database
        typeDocumentRepository.saveAndFlush(typeDocument);

        int databaseSizeBeforeUpdate = typeDocumentRepository.findAll().size();

        // Update the typeDocument using partial update
        TypeDocument partialUpdatedTypeDocument = new TypeDocument();
        partialUpdatedTypeDocument.setId(typeDocument.getId());

        partialUpdatedTypeDocument.code(UPDATED_CODE).libelle(UPDATED_LIBELLE);

        restTypeDocumentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTypeDocument.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTypeDocument))
            )
            .andExpect(status().isOk());

        // Validate the TypeDocument in the database
        List<TypeDocument> typeDocumentList = typeDocumentRepository.findAll();
        assertThat(typeDocumentList).hasSize(databaseSizeBeforeUpdate);
        TypeDocument testTypeDocument = typeDocumentList.get(typeDocumentList.size() - 1);
        assertThat(testTypeDocument.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testTypeDocument.getLibelle()).isEqualTo(UPDATED_LIBELLE);
    }

    @Test
    @Transactional
    void patchNonExistingTypeDocument() throws Exception {
        int databaseSizeBeforeUpdate = typeDocumentRepository.findAll().size();
        typeDocument.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTypeDocumentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, typeDocument.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(typeDocument))
            )
            .andExpect(status().isBadRequest());

        // Validate the TypeDocument in the database
        List<TypeDocument> typeDocumentList = typeDocumentRepository.findAll();
        assertThat(typeDocumentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTypeDocument() throws Exception {
        int databaseSizeBeforeUpdate = typeDocumentRepository.findAll().size();
        typeDocument.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTypeDocumentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(typeDocument))
            )
            .andExpect(status().isBadRequest());

        // Validate the TypeDocument in the database
        List<TypeDocument> typeDocumentList = typeDocumentRepository.findAll();
        assertThat(typeDocumentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTypeDocument() throws Exception {
        int databaseSizeBeforeUpdate = typeDocumentRepository.findAll().size();
        typeDocument.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTypeDocumentMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(typeDocument))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the TypeDocument in the database
        List<TypeDocument> typeDocumentList = typeDocumentRepository.findAll();
        assertThat(typeDocumentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTypeDocument() throws Exception {
        // Initialize the database
        typeDocumentRepository.saveAndFlush(typeDocument);

        int databaseSizeBeforeDelete = typeDocumentRepository.findAll().size();

        // Delete the typeDocument
        restTypeDocumentMockMvc
            .perform(delete(ENTITY_API_URL_ID, typeDocument.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<TypeDocument> typeDocumentList = typeDocumentRepository.findAll();
        assertThat(typeDocumentList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
