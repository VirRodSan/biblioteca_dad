package es.app.biblioteca.dto;

import es.app.biblioteca.model.UsuarioTipo;

public record UsuarioDTO(
        Long id,
        String dni,
        String nombre,
        String apellidos,
        String email,
        UsuarioTipo tipo,
        String curso,
        String departamento,
        String puesto
) {}

