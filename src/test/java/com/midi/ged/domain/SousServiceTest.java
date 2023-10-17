package com.midi.ged.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.midi.ged.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SousServiceTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SousService.class);
        SousService sousService1 = new SousService();
        sousService1.setId(1L);
        SousService sousService2 = new SousService();
        sousService2.setId(sousService1.getId());
        assertThat(sousService1).isEqualTo(sousService2);
        sousService2.setId(2L);
        assertThat(sousService1).isNotEqualTo(sousService2);
        sousService1.setId(null);
        assertThat(sousService1).isNotEqualTo(sousService2);
    }
}
