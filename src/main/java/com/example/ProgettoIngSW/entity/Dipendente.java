package com.example.ProgettoIngSW.entity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Entity
@Table(name = "dipendente")
public class Dipendente implements Component{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id", nullable = false)
    @Getter @Setter
    private int id;

    @Column(name = "CF", nullable = false, length = 16)
    @Getter @Setter
    private String CF;

    @Column(name = "email", nullable = false, unique = true, length = 50)
    @Getter @Setter
    private String email;

    @Column(name = "password", length = 20)
    @Getter @Setter
    private String password;

    @Column(name = "nome", nullable = false, length = 20)
    @Getter @Setter
    private String nome;

    @Column(name = "cognome", nullable = false, length = 15)
    @Getter @Setter
    private String cognome;

    @ManyToMany(fetch = FetchType.EAGER, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "listaRuoli",
            joinColumns = @JoinColumn(name = "dipendente_id"),
            inverseJoinColumns = @JoinColumn(name = "ruolo_id")
    )
    @JsonIgnore
    @Getter @Setter
    private List<Ruolo> listaRuoli;

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "listaunitaorganizzative",
            joinColumns = @JoinColumn(name = "dipendente_id"),
            inverseJoinColumns = @JoinColumn(name = "unita_organizzativa_id")
    )
    @JsonIgnore
    @Getter @Setter
    private List<UnitaOrganizzativa> unitaOrganizzative;
}

