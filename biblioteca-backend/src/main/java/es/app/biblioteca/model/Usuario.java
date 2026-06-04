package es.app.biblioteca.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;


@Entity
@Table(name = "usuario")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(min = 9, max = 9)
    @Column(length = 9, nullable = false, unique = true)
    private String dni;

    @NotBlank
    @Size(max = 20)
    @Column(length = 20, nullable = false)
    private String nombre;

    @NotBlank
    @Size(max = 60)
    @Column(length = 60, nullable = false)
    private String apellidos;

    @NotBlank
    @Email
    @Size(max = 100)
    @Column(length = 100, nullable = false, unique = true)
    private String email;

    @NotBlank
    @Size(min = 4, max = 255)
    @Column(length = 255, nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UsuarioTipo tipo;

    @Size(max = 50)
    @Column(length = 50)
    private String curso;

    @Size(max = 100)
    @Column(length = 100)
    private String departamento;

    @Size(max = 100)
    @Column(length = 100)
    private String puesto;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDni() {
        return dni;
    }

    public void setDni(String dni) {
        this.dni = dni;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellidos() {
        return apellidos;
    }

    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public UsuarioTipo getTipo() {
        return tipo;
    }

    public void setTipo(UsuarioTipo tipo) {
        this.tipo = tipo;
    }

    public String getCurso() {
        return curso;
    }

    public void setCurso(String curso) {
        this.curso = curso;
    }

    public String getDepartamento() {
        return departamento;
    }

    public void setDepartamento(String departamento) {
        this.departamento = departamento;
    }

    public String getPuesto() {
        return puesto;
    }

    public void setPuesto(String puesto) {
        this.puesto = puesto;
    }
}

