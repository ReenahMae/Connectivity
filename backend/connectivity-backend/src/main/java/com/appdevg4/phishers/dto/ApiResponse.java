package com.appdevg4.phishers.dto;

public record ApiResponse<T>(String message, T data) {}
