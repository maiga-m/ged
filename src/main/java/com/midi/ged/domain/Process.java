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
 * A Process.
 */
@Entity
@Table(name = "process")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Process extends AbstractAuditingEntity<Long> implements Serializable {

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

    @OneToMany(mappedBy = "process")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "typeDocument", "boite", "process", "service", "sousService" }, allowSetters = true)
    private Set<Dossier> dossiers = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Process id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return this.code;
    }

    public Process code(String code) {
        this.setCode(code);
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getNom() {
        return this.nom;
    }

    public Process nom(String nom) {
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
            this.dossiers.forEach(i -> i.setProcess(null));
        }
        if (dossiers != null) {
            dossiers.forEach(i -> i.setProcess(this));
        }
        this.dossiers = dossiers;
    }

    public Process dossiers(Set<Dossier> dossiers) {
        this.setDossiers(dossiers);
        return this;
    }

    public Process addDossiers(Dossier dossier) {
        this.dossiers.add(dossier);
        dossier.setProcess(this);
        return this;
    }

    public Process removeDossiers(Dossier dossier) {
        this.dossiers.remove(dossier);
        dossier.setProcess(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Process)) {
            return false;
        }
        return id != null && id.equals(((Process) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Process{" +
            "id=" + getId() +
            ", code='" + getCode() + "'" +
            ", nom='" + getNom() + "'" +
            "}";
    }
}
