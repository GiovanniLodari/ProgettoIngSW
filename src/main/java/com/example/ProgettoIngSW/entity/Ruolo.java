package com.example.ProgettoIngSW.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "ruolo")
public class Ruolo implements Component{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id", nullable = false)
    private int id;

    @Column(name = "nome", nullable = false, length = 30, unique = true)
    @Getter @Setter
    private String nome;

    @Column(name = "descrizione", nullable = false, length = 255)
    @Getter @Setter
    private String descrizione;

    @ManyToMany(mappedBy = "ruoliAmmissibili")
    @Getter @Setter
    private List<UnitaOrganizzativa> unitaOrganizzative;

    @ManyToMany(mappedBy = "listaRuoli")
    @Getter @Setter
    private List<Dipendente> listaDipendenti;
}
