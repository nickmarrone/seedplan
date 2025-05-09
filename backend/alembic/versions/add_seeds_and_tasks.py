"""add seeds and tasks

Revision ID: add_seeds_and_tasks
Revises: update_frost_dates_to_string
Create Date: 2024-02-14 09:42:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
from sqlalchemy import text

# revision identifiers, used by Alembic.
revision = 'add_seeds_and_tasks'
down_revision = 'update_frost_dates_to_string'
branch_labels = None
depends_on = None

def upgrade():
    # Create enum type for planting_type if it doesn't exist
    connection = op.get_bind()
    result = connection.execute(
        text("SELECT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'plantingtype')")
    ).scalar()
    if not result:
        planting_type = postgresql.ENUM('direct_seed', 'transplant', name='plantingtype')
        planting_type.create(op.get_bind())

    # Create seeds table
    op.create_table(
        'seeds',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('plant_type', sa.String(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('days_to_maturity', sa.Integer(), nullable=False),
        sa.Column('company', sa.String(), nullable=True),
        sa.Column('planting_type', sa.String(), nullable=False),
        sa.Column('weeks_before_frost', sa.Integer(), nullable=True),
        sa.Column('weeks_after_frost', sa.Integer(), nullable=True),
        sa.Column('seed_spacing', sa.Text(), nullable=True),
        sa.Column('seed_notes', sa.Text(), nullable=True),
        sa.Column('color', sa.String(), nullable=True),
        sa.Column('is_system', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.Date(), nullable=False),
        sa.Column('updated_at', sa.Date(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Create tasks table
    op.create_table(
        'tasks',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('seed_id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('task_type', sa.String(), nullable=False),
        sa.Column('start_date', sa.Date(), nullable=False),
        sa.Column('end_date', sa.Date(), nullable=False),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.Date(), nullable=False),
        sa.Column('updated_at', sa.Date(), nullable=True),
        sa.ForeignKeyConstraint(['seed_id'], ['seeds.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

def downgrade():
    op.drop_table('tasks')
    op.drop_table('seeds')
    op.execute('DROP TYPE IF EXISTS plantingtype') 