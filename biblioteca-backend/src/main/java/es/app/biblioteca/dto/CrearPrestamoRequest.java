package es.app.biblioteca.dto;

import jakarta.validation.constraints.NotNull;

public record CrearPrestamoRequest(
        @NotNull Long usuarioId,
        @NotNull Long libroId,
        Integer diasPrestamo
) {}
