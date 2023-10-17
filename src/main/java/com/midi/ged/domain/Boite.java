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
 * A Boite.
 */
@Entity
@Table(name = "boite")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Boite extends AbstractAuditingEntity<Long> implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Size(max = 10)
    @Column(name = "code", length = 10)
    private String code;

    @Column(name = "capacite")
    private Integer capacite;

    @OneToMany(mappedBy = "boite")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "typeDocument", "boite", "process", "service", "sousService" }, allowSetters = true)
    private Set<Dossier> dossiers = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "boites", "salle" }, allowSetters = true)
    private Rayon rayon;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Boite id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return this.code;
    }

    public Boite code(String code) {
        this.setCode(code);
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Integer getCapacite() {
        return this.capacite;
    }

    public Boite capacite(Integer capacite) {
        this.setCapacite(capacite);
        return this;
    }

    public void setCapacite(Integer capacite) {
        this.capacite = capacite;
    }

    public Set<Dossier> getDossiers() {
        return this.dossiers;
    }

    public void setDossiers(Set<Dossier> dossiers) {
        if (this.dossiers != null) {
            this.dossiers.forEach(i -> i.setBoite(null));
        }
        if (dossiers != null) {
            dossiers.forEach(i -> i.setBoite(this));
        }
        this.dossiers = dossiers;
    }

    public Boite dossiers(Set<Dossier> dossiers) {
        this.setDossiers(dossiers);
        return this;
    }

    public Boite addDossiers(Dossier dossier) {
        this.dossiers.add(dossier);
        dossier.setBoite(this);
        return this;
    }

    public Boite removeDossiers(Dossier dossier) {
        this.dossiers.remove(dossier);
        dossier.setBoite(null);
        return this;
    }

    public Rayon getRayon() {
        return this.rayon;
    }

    public void setRayon(Rayon rayon) {
        this.rayon = rayon;
    }

    public Boite rayon(Rayon rayon) {
        this.setRayon(rayon);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Boite)) {
            return false;
        }
        return id != null && id.equals(((Boite) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Boite{" +
            "id=" + getId() +
            ", code='" + getCode() + "'" +
            ", capacite=" + getCapacite() +
            "}";
    }
}
