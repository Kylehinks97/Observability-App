from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://devpulse:devpulse@localhost:5432/devpulse"
    SECRET_KEY: str = "change-me-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    OPEN_ROUTER_API_KEY: str = ""

    class Config:
        env_file = ".env"


settings = Settings()
