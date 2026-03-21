from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://tickets_user:tickets_pass@db:5432/tickets_db"
    SECRET_KEY: str = "dev-secret-key-change-in-production"

    model_config = {"env_file": ".env"}


settings = Settings()
