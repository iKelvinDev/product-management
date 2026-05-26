import { Request, Response } from "express";

export function notFoundMiddleware(_request: Request, response: Response): void {
    response.status(404).json({
        message: "Rota não encontrada",
    });
}