package es.app.biblioteca.dto;

public record LibroDTO(
        Long id,
        String isbn,
        String titulo,
        String autor,
        String editorial,
        Integer anioPublicacion,
        int ejemplaresTotales,
        int ejemplaresDisponibles
) {}

