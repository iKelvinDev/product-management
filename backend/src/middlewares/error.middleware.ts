import { NextFunction, Request, Response } from "express";

export function errorMiddleware(
    error: Error, 
    _request: Request, 
    response: Response,
    _next: NextFunction
): void {
    console.error(error);

    response.status(500).json({
        message: "Ocorreu um erro interno no servidor",
    });
}