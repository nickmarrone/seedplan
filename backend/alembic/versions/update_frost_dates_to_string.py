"""update frost dates to string

Revision ID: update_frost_dates_to_string
Revises: add_user_preferences
Create Date: 2024-02-20 11:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'update_frost_dates_to_string'
down_revision = 'add_user_preferences'
branch_labels = None
depends_on = None


def upgrade():
    # Create temporary columns
    op.add_column('users', sa.Column('last_frost_date_str', sa.String(), nullable=True))
    op.add_column('users', sa.Column('first_frost_date_str', sa.String(), nullable=True))
    
    # Drop old columns
    op.drop_column('users', 'last_frost_date')
    op.drop_column('users', 'first_frost_date')
    
    # Rename new columns
    op.alter_column('users', 'last_frost_date_str', new_column_name='last_frost_date')
    op.alter_column('users', 'first_frost_date_str', new_column_name='first_frost_date')


def downgrade():
    # Create temporary columns
    op.add_column('users', sa.Column('last_frost_date_date', sa.Date(), nullable=True))
    op.add_column('users', sa.Column('first_frost_date_date', sa.Date(), nullable=True))
    
    # Drop string columns
    op.drop_column('users', 'last_frost_date')
    op.drop_column('users', 'first_frost_date')
    
    # Rename new columns
    op.alter_column('users', 'last_frost_date_date', new_column_name='last_frost_date')
    op.alter_column('users', 'first_frost_date_date', new_column_name='first_frost_date') 