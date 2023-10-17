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
 * A TypeDocument.
 */
@Entity
@Table(name = "type_document")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class TypeDocument extends AbstractAuditingEntity<Long> implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Size(max = 10)
    @Column(name = "code", length = 10)
    private String code;

    @Size(max = 30)
    @Column(name = "libelle", length = 30)
    private String libelle;

    @OneToMany(mappedBy = "typeDocument")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "typeDocument", "boite", "process", "service", "sousService" }, allowSetters = true)
    private Set<Dossier> dossiers = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public TypeDocument id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return this.code;
    }

    public TypeDocument code(String code) {
        this.setCode(code);
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getLibelle() {
        return this.libelle;
    }

    public TypeDocument libelle(String libelle) {
        this.setLibelle(libelle);
        return this;
    }

    public void setLibelle(String libelle) {
        this.libelle = libelle;
    }

    public Set<Dossier> getDossiers() {
        return this.dossiers;
    }

    public void setDossiers(Set<Dossier> dossiers) {
        if (this.dossiers != null) {
            this.dossiers.forEach(i -> i.setTypeDocument(null));
        }
        if (dossiers != null) {
            dossiers.forEach(i -> i.setTypeDocument(this));
        }
        this.dossiers = dossiers;
    }

    public TypeDocument dossiers(Set<Dossier> dossiers) {
        this.setDossiers(dossiers);
        return this;
    }

    public TypeDocument addDossiers(Dossier dossier) {
        this.dossiers.add(dossier);
        dossier.setTypeDocument(this);
        return this;
    }

    public TypeDocument removeDossiers(Dossier dossier) {
        this.dossiers.remove(dossier);
        dossier.setTypeDocument(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof TypeDocument)) {
            return false;
        }
        return id != null && id.equals(((TypeDocument) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "TypeDocument{" +
            "id=" + getId() +
            ", code='" + getCode() + "'" +
            ", libelle='" + getLibelle() + "'" +
            "}";
    }
}
