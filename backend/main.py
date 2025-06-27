from fastapi import FastAPI
from routers import condominios, unidades, moradores, auth

app = FastAPI()

app.include_router(auth.router)
app.include_router(condominios.router)
app.include_router(unidades.router)
app.include_router(moradores.router)
