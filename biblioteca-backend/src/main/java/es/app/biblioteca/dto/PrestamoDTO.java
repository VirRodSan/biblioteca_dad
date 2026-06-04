package es.app.biblioteca.dto;

import java.time.LocalDate;

public record PrestamoDTO(
        Long id,
        LocalDate fechaPrestamo,
        LocalDate fechaDevolucion,
        boolean devuelto,
        Long usuarioId,
        String usuarioNombre,
        Long libroId,
        String libroTitulo,
        String libroAutor,
        Long creadoPorId,
        String creadoPorNombre
) {}
