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
        server_default=text("now()")
    ),
)

roles = sa.Table(
    "roles",
    metadata,
    sa.Column(
        "id", sa.Integer, primary_key=True),
    sa.Column(
        "name", sa.String(25), unique=True),
)

users = sa.Table(
    "users",
    metadata,
    sa.Column(
        "id",
        sa.Integer,
        primary_key=True
    ),
    sa.Column(
        "username",
        sa.String(25),
        unique=True
    ),
    sa.Column(
        "hashed_password",
        sa.String(8)
    ),
    sa.Column(
        "is_active",
        sa.Boolean,
        default=False
    ),
    # sa.Column(
    #     "role",
    #     sa.Integer,
    #     sa.ForeignKey("roles.id")
    # ),
    # sa.Column(
    #     "created_at",
    #     sa.TIMESTAMP(timezone=True),
    #     server_default=sa.func.now(),
    # ),
    # sa.Column(
    #     "updated_at",
    #     sa.TIMESTAMP(timezone=True),
    #     server_default=sa.func.now(),
    #     onupdate=sa.func.now(),
    # ),
)

engine = sa.create_engine(DATABASE_URL)

metadata.create_all(engine)
