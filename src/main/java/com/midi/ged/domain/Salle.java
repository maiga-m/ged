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
 * A Salle.
 */
@Entity
@Table(name = "salle")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Salle extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Size(max = 10)
    @Column(name = "code", length = 10)
    private String code;

    @Column(name = "superficie")
    private Integer superficie;

    @OneToMany(mappedBy = "salle")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "boites", "salle" }, allowSetters = true)
    private Set<Rayon> rayons = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Salle id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return this.code;
    }

    public Salle code(String code) {
        this.setCode(code);
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Integer getSuperficie() {
        return this.superficie;
    }

    public Salle superficie(Integer superficie) {
        this.setSuperficie(superficie);
        return this;
    }

    public void setSuperficie(Integer superficie) {
        this.superficie = superficie;
    }

    public Set<Rayon> getRayons() {
        return this.rayons;
    }

    public void setRayons(Set<Rayon> rayons) {
        if (this.rayons != null) {
            this.rayons.forEach(i -> i.setSalle(null));
        }
        if (rayons != null) {
            rayons.forEach(i -> i.setSalle(this));
        }
        this.rayons = rayons;
    }

    public Salle rayons(Set<Rayon> rayons) {
        this.setRayons(rayons);
        return this;
    }

    public Salle addRayons(Rayon rayon) {
        this.rayons.add(rayon);
        rayon.setSalle(this);
        return this;
    }

    public Salle removeRayons(Rayon rayon) {
        this.rayons.remove(rayon);
        rayon.setSalle(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Salle)) {
            return false;
        }
        return id != null && id.equals(((Salle) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Salle{" +
            "id=" + getId() +
            ", code='" + getCode() + "'" +
            ", superficie=" + getSuperficie() +
            "}";
    }
}
