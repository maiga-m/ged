package com.midi.ged.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Date;

import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;

/**
 * A Dossier.
 */
@Entity
@Table(name = "dossier")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Dossier extends AbstractAuditingEntity<Long> implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Size(max = 10)
    @Column(name = "code", length = 10)
    private String code;

    @Size(max = 30)
    @Column(name = "mot_cle", length = 30)
    private String motCle;

    @Column(name = "date_production")
    private LocalDateTime dateProduction;

    @ManyToOne
    @JsonIgnoreProperties(value = { "dossiers" }, allowSetters = true)
    private TypeDocument typeDocument;

    @ManyToOne
    @JsonIgnoreProperties(value = { "dossiers", "rayon" }, allowSetters = true)
    private Boite boite;

    @ManyToOne
    @JsonIgnoreProperties(value = { "dossiers" }, allowSetters = true)
    private Process process;

    @ManyToOne
    @JsonIgnoreProperties(value = { "sousServices", "dossiers" }, allowSetters = true)
    private Service service;

    @ManyToOne
    @JsonIgnoreProperties(value = { "dossiers", "service" }, allowSetters = true)
    private SousService sousService;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    @CreatedBy
    @Column(name = "created_by", nullable = false, length = 50, updatable = false)
    private String createdBy;

    @CreatedDate
    @Column(name = "created_date", updatable = false)
    private Instant createdDate = Instant.now();

    @LastModifiedBy
    @Column(name = "last_modified_by", length = 50)
    private String lastModifiedBy;

    @LastModifiedDate
    @Column(name = "last_modified_date")
    private Instant lastModifiedDate = Instant.now();
    

    public Long getId() {
        return this.id;
    }

    public Dossier id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return this.code;
    }

    public Dossier code(String code) {
        this.setCode(code);
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getMotCle() {
        return this.motCle;
    }

    public Dossier motCle(String motCle) {
        this.setMotCle(motCle);
        return this;
    }

    public void setMotCle(String motCle) {
        this.motCle = motCle;
    }

    public LocalDateTime getDateProduction() {
        return this.dateProduction;
    }

    public Dossier dateProduction(LocalDateTime dateProduction) {
        this.setDateProduction(dateProduction);
        return this;
    }

    public void setDateProduction(LocalDateTime dateProduction) {
        this.dateProduction = dateProduction;
    }

    public TypeDocument getTypeDocument() {
        return this.typeDocument;
    }

    public void setTypeDocument(TypeDocument typeDocument) {
        this.typeDocument = typeDocument;
    }

    public Dossier typeDocument(TypeDocument typeDocument) {
        this.setTypeDocument(typeDocument);
        return this;
    }

    public Boite getBoite() {
        return this.boite;
    }

    public void setBoite(Boite boite) {
        this.boite = boite;
    }

    public Dossier boite(Boite boite) {
        this.setBoite(boite);
        return this;
    }

    public Process getProcess() {
        return this.process;
    }

    public void setProcess(Process process) {
        this.process = process;
    }

    public Dossier process(Process process) {
        this.setProcess(process);
        return this;
    }

    public Service getService() {
        return this.service;
    }

    public void setService(Service service) {
        this.service = service;
    }

    public Dossier service(Service service) {
        this.setService(service);
        return this;
    }

    public SousService getSousService() {
        return this.sousService;
    }

    public void setSousService(SousService sousService) {
        this.sousService = sousService;
    }

    public Dossier sousService(SousService sousService) {
        this.setSousService(sousService);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Dossier)) {
            return false;
        }
        return id != null && id.equals(((Dossier) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Dossier{" +
            "id=" + getId() +
            ", code='" + getCode() + "'" +
            ", motCle='" + getMotCle() + "'" +
            ", dateProduction='" + getDateProduction() + "'" +
            "}";
    }
}
