# import os
# import ssl
# from sqlalchemy import create_engine
# from sqlalchemy.orm import sessionmaker, declarative_base

# DATABASE_URL = os.environ.get(
#     "DATABASE_URL",
#     "mysql+pymysql://root:kasaudhan@localhost/teampulse"
# )

# print(f"CONNECTED DATABASE: {DATABASE_URL}")

# <<<<<<< Updated upstream
# if "aivencloud.com" in DATABASE_URL:
#     ssl_ctx = ssl.create_default_context()
#     ssl_ctx.check_hostname = False
#     ssl_ctx.verify_mode = ssl.CERT_NONE
#     engine = create_engine(
#         DATABASE_URL,
#         connect_args={"ssl": ssl_ctx}
# =======
# # Add SSL for Aiven (required), skip for localhost
# if "aivencloud.com" in DATABASE_URL:
#     engine = create_engine(
#         DATABASE_URL,
#         connect_args={"ssl": {"ssl_ca": "/etc/ssl/certs/ca-certificates.crt"}}
# >>>>>>> Stashed changes
#     )
# else:
#     engine = create_engine(DATABASE_URL)

# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
# Base = declarative_base()

# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = os.environ.get(
    "DATABASE_URL",
    "mysql+pymysql://root:kasaudhan@localhost/teampulse"
)

print(f"CONNECTED DATABASE: {DATABASE_URL}")

# Add SSL for Aiven (required), skip for localhost
if "aivencloud.com" in DATABASE_URL:
    engine = create_engine(
        DATABASE_URL,
        connect_args={"ssl": {"ssl_ca": "/etc/ssl/certs/ca-certificates.crt"}}
    )
else:
    engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()