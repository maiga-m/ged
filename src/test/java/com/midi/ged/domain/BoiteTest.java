package com.midi.ged.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.midi.ged.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class BoiteTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Boite.class);
        Boite boite1 = new Boite();
        boite1.setId(1L);
        Boite boite2 = new Boite();
        boite2.setId(boite1.getId());
        assertThat(boite1).isEqualTo(boite2);
        boite2.setId(2L);
        assertThat(boite1).isNotEqualTo(boite2);
        boite1.setId(null);
        assertThat(boite1).isNotEqualTo(boite2);
    }
}
