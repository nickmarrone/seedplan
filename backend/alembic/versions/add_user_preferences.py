"""add user preferences

Revision ID: add_user_preferences
Revises: 
Create Date: 2024-02-20 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'add_user_preferences'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Add new columns to users table
    op.add_column('users', sa.Column('full_name', sa.String(), nullable=True))
    op.add_column('users', sa.Column('gardening_zone', sa.String(), nullable=True))
    op.add_column('users', sa.Column('zipcode', sa.String(), nullable=True))
    op.add_column('users', sa.Column('latitude', sa.Float(), nullable=True))
    op.add_column('users', sa.Column('longitude', sa.Float(), nullable=True))
    op.add_column('users', sa.Column('last_frost_date', sa.Date(), nullable=True))
    op.add_column('users', sa.Column('first_frost_date', sa.Date(), nullable=True))


def downgrade():
    # Remove columns from users table
    op.drop_column('users', 'first_frost_date')
    op.drop_column('users', 'last_frost_date')
    op.drop_column('users', 'longitude')
    op.drop_column('users', 'latitude')
    op.drop_column('users', 'zipcode')
    op.drop_column('users', 'gardening_zone')
    op.drop_column('users', 'full_name') 