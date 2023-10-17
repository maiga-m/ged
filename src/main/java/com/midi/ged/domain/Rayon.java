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
 * A Rayon.
 */
@Entity
@Table(name = "rayon")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Rayon extends AbstractAuditingEntity<Long> implements Serializable {

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

    @OneToMany(mappedBy = "rayon")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "dossiers", "rayon" }, allowSetters = true)
    private Set<Boite> boites = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "rayons" }, allowSetters = true)
    private Salle salle;
    

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Rayon id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return this.code;
    }

    public Rayon code(String code) {
        this.setCode(code);
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getNom() {
        return this.nom;
    }

    public Rayon nom(String nom) {
        this.setNom(nom);
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public Set<Boite> getBoites() {
        return this.boites;
    }

    public void setBoites(Set<Boite> boites) {
        if (this.boites != null) {
            this.boites.forEach(i -> i.setRayon(null));
        }
        if (boites != null) {
            boites.forEach(i -> i.setRayon(this));
        }
        this.boites = boites;
    }

    public Rayon boites(Set<Boite> boites) {
        this.setBoites(boites);
        return this;
    }

    public Rayon addBoites(Boite boite) {
        this.boites.add(boite);
        boite.setRayon(this);
        return this;
    }

    public Rayon removeBoites(Boite boite) {
        this.boites.remove(boite);
        boite.setRayon(null);
        return this;
    }

    public Salle getSalle() {
        return this.salle;
    }

    public void setSalle(Salle salle) {
        this.salle = salle;
    }

    public Rayon salle(Salle salle) {
        this.setSalle(salle);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Rayon)) {
            return false;
        }
        return id != null && id.equals(((Rayon) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Rayon{" +
            "id=" + getId() +
            ", code='" + getCode() + "'" +
            ", nom='" + getNom() + "'" +
            "}";
    }
}
