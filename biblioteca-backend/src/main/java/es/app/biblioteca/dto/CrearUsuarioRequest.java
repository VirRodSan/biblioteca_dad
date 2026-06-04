package es.app.biblioteca.dto;

import es.app.biblioteca.model.UsuarioTipo;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;


public record CrearUsuarioRequest(
    @NotBlank(message = "El DNI es obligatorio")
    @Size(max = 20, message = "El DNI no puede superar 20 caracteres")
    String dni,

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 100, message = "El nombre no puede superar 100 caracteres")
    String nombre,

    @NotBlank(message = "Los apellidos son obligatorios")
    @Size(max = 150, message = "Los apellidos no pueden superar 150 caracteres")
    String apellidos,

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El email no tiene un formato válido")
    @Size(max = 150, message = "El email no puede superar 150 caracteres")
    String email,

    @NotNull(message = "El rol (tipo) es obligatorio")
    UsuarioTipo tipo,

    // Opcionales según rol
    @Size(max = 50, message = "El curso no puede superar 50 caracteres")
    String curso,

    @Size(max = 100, message = "El departamento no puede superar 100 caracteres")
    String departamento,

    @Size(max = 100, message = "El puesto no puede superar 100 caracteres")
    String puesto
){}

