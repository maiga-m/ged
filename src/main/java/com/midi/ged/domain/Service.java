package com.midi.ged.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Service.
 */
@Entity
@Table(name = "service")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Service extends AbstractAuditingEntity<Long> implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Size(max = 10)
    @Column(name = "code", length = 10)
    private String code;

    @Size(max = 30)
    @Column(name = "nom", length = 30)
    private String nom;

    @OneToMany(mappedBy = "service")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "dossiers", "service" }, allowSetters = true)
    private Set<SousService> sousServices = new HashSet<>();

    @OneToMany(mappedBy = "service")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "typeDocument", "boite", "process", "service", "sousService" }, allowSetters = true)
    private Set<Dossier> dossiers = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Service id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return this.code;
    }

    public Service code(String code) {
        this.setCode(code);
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getNom() {
        return this.nom;
    }

    public Service nom(String nom) {
        this.setNom(nom);
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public Set<SousService> getSousServices() {
        return this.sousServices;
    }

    public void setSousServices(Set<SousService> sousServices) {
        if (this.sousServices != null) {
            this.sousServices.forEach(i -> i.setService(null));
        }
        if (sousServices != null) {
            sousServices.forEach(i -> i.setService(this));
        }
        this.sousServices = sousServices;
    }

    public Service sousServices(Set<SousService> sousServices) {
        this.setSousServices(sousServices);
        return this;
    }

    public Service addSousServices(SousService sousService) {
        this.sousServices.add(sousService);
        sousService.setService(this);
        return this;
    }

    public Service removeSousServices(SousService sousService) {
        this.sousServices.remove(sousService);
        sousService.setService(null);
        return this;
    }

    public Set<Dossier> getDossiers() {
        return this.dossiers;
    }

    public void setDossiers(Set<Dossier> dossiers) {
        if (this.dossiers != null) {
            this.dossiers.forEach(i -> i.setService(null));
        }
        if (dossiers != null) {
            dossiers.forEach(i -> i.setService(this));
        }
        this.dossiers = dossiers;
    }

    public Service dossiers(Set<Dossier> dossiers) {
        this.setDossiers(dossiers);
        return this;
    }

    public Service addDossiers(Dossier dossier) {
        this.dossiers.add(dossier);
        dossier.setService(this);
        return this;
    }

    public Service removeDossiers(Dossier dossier) {
        this.dossiers.remove(dossier);
        dossier.setService(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Service)) {
            return false;
        }
        return id != null && id.equals(((Service) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Service{" +
            "id=" + getId() +
            ", code='" + getCode() + "'" +
            ", nom='" + getNom() + "'" +
            "}";
    }
}
