package es.app.biblioteca.dto;

import es.app.biblioteca.model.UsuarioTipo;

public record LoginResponse(
        Long id,
        String nombre,
        String apellidos,
        String email,
        UsuarioTipo tipo,
        UsuarioTipo rol
) {}

