package com.example.ProgettoIngSW.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "unitaorganizzativa")
public class UnitaOrganizzativa implements Component{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id", nullable = false)
    @Getter
    private int id;

    @Column(name = "nome", nullable = false, length = 30, unique = true)
    @Getter @Setter
    private String nome;

    @ManyToMany
    @JoinTable(name = "unita_ruolo",
            joinColumns = @JoinColumn(name = "unitaOrganizzativa_id"),
            inverseJoinColumns = @JoinColumn(name = "ruolo_id")
    )
    @JsonIgnore
    @Getter @Setter
    private List<Ruolo> ruoliAmmissibili;

    @ManyToMany(mappedBy = "unitaOrganizzative")
    @JsonIgnore
    @Getter @Setter
    private List<Dipendente> listaDipendenti;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "unitaOrganizzativa_id")
    @JsonIgnore
    @Getter @Setter
    private UnitaOrganizzativa unitaOrganizzativaPadre;

    @OneToMany(mappedBy = "unitaOrganizzativaPadre", fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @Getter @Setter
    private List<UnitaOrganizzativa> listaSottoUnita;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organigramma_id")
    @JsonIgnore
    @Getter @Setter
    private Organigramma organigramma;
}
