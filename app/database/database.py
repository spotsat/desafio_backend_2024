import sqlalchemy as sa
import databases
from sqlalchemy.sql.expression import text

DATABASE_URL = "postgresql://postgres:senha@localhost:5432/geografos"

database = databases.Database(DATABASE_URL)

metadata = sa.MetaData()

graphs = sa.Table(
    "graphs",
    metadata,
    sa.Column(
        "id",
        sa.Integer,
        primary_key=True
    ),
    sa.Column(
        "nodes",
        sa.JSON
    ),
    sa.Column(
        "edges",
        sa.JSON
    ),
    sa.Column(
        "created_at",
        sa.DateTime,
        server_default=text("now()")
    ),
    sa.Column(
        "updated_at",
        sa.DateTime,
        server_default=text("now()"),
        onupdate=text("now()")
    ),
)

users = sa.Table(
    "users",
    metadata,
    sa.Column(
        "id",
        sa.String,
        primary_key=True,
        server_default=text("gen_random_uuid()")
    ),
    sa.Column(
        "username",
        sa.String,
        unique=True,
        nullable=False
    ),
    sa.Column(
        "hashed_password",
        sa.String,
        nullable=False
    ),
    sa.Column(
        "disable",
        sa.Boolean,
    ),
    sa.Column(
        "email",
        sa.String,
        unique=True,
        nullable=False
    ),
    sa.Column(
        "created_at",
        sa.TIMESTAMP(timezone=True),
        server_default=text("now()"),
    ),
    sa.Column(
        "updated_at",
        sa.TIMESTAMP(timezone=True),
        server_default=text("now()"),
        onupdate=text("now()")
    ),
)

engine = sa.create_engine(DATABASE_URL)

metadata.create_all(engine)
