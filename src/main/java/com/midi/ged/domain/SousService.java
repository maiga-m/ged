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
 * A SousService.
 */
@Entity
@Table(name = "sous_service")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class SousService extends AbstractAuditingEntity<Long> implements Serializable {

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

    @OneToMany(mappedBy = "sousService")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "typeDocument", "boite", "process", "service", "sousService" }, allowSetters = true)
    private Set<Dossier> dossiers = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "sousServices", "dossiers" }, allowSetters = true)
    private Service service;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public SousService id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return this.code;
    }

    public SousService code(String code) {
        this.setCode(code);
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getNom() {
        return this.nom;
    }

    public SousService nom(String nom) {
        this.setNom(nom);
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public Set<Dossier> getDossiers() {
        return this.dossiers;
    }

    public void setDossiers(Set<Dossier> dossiers) {
        if (this.dossiers != null) {
            this.dossiers.forEach(i -> i.setSousService(null));
        }
        if (dossiers != null) {
            dossiers.forEach(i -> i.setSousService(this));
        }
        this.dossiers = dossiers;
    }

    public SousService dossiers(Set<Dossier> dossiers) {
        this.setDossiers(dossiers);
        return this;
    }

    public SousService addDossiers(Dossier dossier) {
        this.dossiers.add(dossier);
        dossier.setSousService(this);
        return this;
    }

    public SousService removeDossiers(Dossier dossier) {
        this.dossiers.remove(dossier);
        dossier.setSousService(null);
        return this;
    }

    public Service getService() {
        return this.service;
    }

    public void setService(Service service) {
        this.service = service;
    }

    public SousService service(Service service) {
        this.setService(service);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof SousService)) {
            return false;
        }
        return id != null && id.equals(((SousService) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "SousService{" +
            "id=" + getId() +
            ", code='" + getCode() + "'" +
            ", nom='" + getNom() + "'" +
            "}";
    }
}
